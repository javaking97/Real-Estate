package kr.co.realestate.domain.auth.service;

import kr.co.realestate.domain.auth.dto.LoginRequest;
import kr.co.realestate.domain.common.enums.ErrorCode;
import kr.co.realestate.domain.user.generated.mapper.UserMapper;
import kr.co.realestate.domain.user.generated.model.User;
import kr.co.realestate.domain.user.service.UserRoleQueryService;
import kr.co.realestate.exceptions.BizException;
import kr.co.realestate.security.jwt.JwtProperties;
import kr.co.realestate.security.jwt.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mybatis.dynamic.sql.select.SelectDSLCompleter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserMapper userMapper;
    @Mock private UserRoleQueryService userRoleQueryService;
    @Mock private RefreshTokenService refreshTokenService;

    private PasswordEncoder passwordEncoder;
    private JwtTokenProvider jwtTokenProvider;
    private JwtProperties jwtProperties;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder(4);
        jwtProperties = new JwtProperties();
        jwtProperties.setSecret("test-secret-key-must-be-at-least-32-characters-long!!");
        jwtProperties.setAccessTokenTtl(3600L);
        jwtProperties.setRefreshTokenTtl(2592000L);
        jwtTokenProvider = new JwtTokenProvider(jwtProperties);

        authService = new AuthService(
                userMapper, userRoleQueryService, passwordEncoder, jwtTokenProvider, jwtProperties, refreshTokenService
        );
    }

    @Test
    void login_shouldSucceed_withValidCredentials() {
        String rawPassword = "validPassword1!";
        User user = buildUser(1L, "user", passwordEncoder.encode(rawPassword), true);
        LoginRequest request = buildLoginRequest("user", rawPassword);

        when(userMapper.selectOne(any(SelectDSLCompleter.class))).thenReturn(Optional.of(user));
        when(userRoleQueryService.getRoleNames(1L)).thenReturn(List.of("ROLE_USER"));
        doNothing().when(refreshTokenService).save(any(), anyString());

        var response = authService.login(request);

        assertThat(response.getAccessToken()).isNotBlank();
    }

    @Test
    void login_shouldThrow_withWrongPassword() {
        User user = buildUser(1L, "user", passwordEncoder.encode("correctPassword"), true);
        LoginRequest request = buildLoginRequest("user", "wrongPassword");

        when(userMapper.selectOne(any(SelectDSLCompleter.class))).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(BizException.class)
                .satisfies(e -> assertThat(((BizException) e).getErrorCode())
                        .isEqualTo(ErrorCode.AUTH_INVALID_CREDENTIALS));
    }

    private LoginRequest buildLoginRequest(String username, String password) {
        try {
            var request = new LoginRequest();
            setField(request, "username", username);
            setField(request, "password", password);
            return request;
        } catch (Exception exception) {
            throw new RuntimeException(exception);
        }
    }

    private void setField(Object target, String fieldName, Object value) throws Exception {
        var field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(target, value);
    }

    private User buildUser(Long id, String username, String encodedPassword, Boolean enabled) {
        User user = new User();
        user.setId(id);
        user.setUsername(username);
        user.setPassword(encodedPassword);
        user.setEnabled(enabled);
        return user;
    }
}
