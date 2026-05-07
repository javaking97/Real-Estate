package kr.co.realestate.domain.auth.service;

import kr.co.realestate.domain.auth.dto.AuthResponse;
import kr.co.realestate.domain.auth.dto.LoginRequest;
import kr.co.realestate.domain.auth.dto.TokenRefreshRequest;
import kr.co.realestate.domain.common.enums.ErrorCode;
import kr.co.realestate.domain.user.generated.mapper.UserMapper;
import kr.co.realestate.domain.user.generated.model.User;
import kr.co.realestate.domain.user.service.UserRoleQueryService;
import kr.co.realestate.exceptions.BizException;
import kr.co.realestate.security.jwt.JwtProperties;
import kr.co.realestate.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static kr.co.realestate.domain.user.generated.support.UserDynamicSqlSupport.username;
import static org.mybatis.dynamic.sql.SqlBuilder.isEqualTo;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserMapper userMapper;
    private final UserRoleQueryService userRoleQueryService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtProperties jwtProperties;
    private final RefreshTokenService refreshTokenService;

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = selectByUsername(request.getUsername())
                .orElseThrow(() -> new BizException(ErrorCode.AUTH_INVALID_CREDENTIALS));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BizException(ErrorCode.AUTH_INVALID_CREDENTIALS);
        }

        List<String> roles = userRoleQueryService.getRoleNames(user.getId());

        return issueTokenPair(user, roles);
    }

    @Transactional
    public AuthResponse refresh(TokenRefreshRequest request) {
        refreshTokenService.validate(request.getRefreshToken());

        Long userId = jwtTokenProvider.extractUserId(request.getRefreshToken());
        User user = userMapper.selectByPrimaryKey(userId)
                .orElseThrow(() -> new BizException(ErrorCode.NOT_FOUND_ERROR));

        List<String> roles = userRoleQueryService.getRoleNames(userId);

        refreshTokenService.revoke(request.getRefreshToken());
        return issueTokenPair(user, roles);
    }

    @Transactional
    public void logout(String rawRefreshToken) {
        refreshTokenService.validate(rawRefreshToken);
        refreshTokenService.revoke(rawRefreshToken);
    }

    private AuthResponse issueTokenPair(User user, List<String> roles) {
        String accessToken  = jwtTokenProvider.generateAccessToken(user.getId(), user.getUsername(), roles);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId(), user.getUsername(), roles);
        refreshTokenService.save(user.getId(), refreshToken);
        return AuthResponse.of(accessToken, refreshToken, jwtProperties.getAccessTokenTtl());
    }

    private Optional<User> selectByUsername(String loginUsername) {
        return userMapper.selectOne(query -> query.where(username, isEqualTo(loginUsername)));
    }
}
