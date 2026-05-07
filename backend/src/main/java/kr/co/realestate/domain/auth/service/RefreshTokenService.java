package kr.co.realestate.domain.auth.service;

import kr.co.realestate.domain.common.enums.ErrorCode;
import kr.co.realestate.exceptions.BizException;
import kr.co.realestate.security.jwt.JwtProperties;
import kr.co.realestate.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private static final String REDIS_PREFIX = "refresh:";
    private static final String REDIS_USER_INDEX_PREFIX = "refresh:user:";

    private final StringRedisTemplate redisTemplate;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtProperties jwtProperties;

    @Transactional
    public void save(Long userId, String rawToken) {
        String jti = jwtTokenProvider.extractJti(rawToken);
        String tokenKey = REDIS_PREFIX + jti;
        String userIndexKey = REDIS_USER_INDEX_PREFIX + userId;
        String ttlSeconds = String.valueOf(jwtProperties.getRefreshTokenTtl());

        redisTemplate.opsForValue().set(
                tokenKey,
                String.valueOf(userId),
                jwtProperties.getRefreshTokenTtl(),
                TimeUnit.SECONDS
        );
        redisTemplate.opsForHash().put(userIndexKey, jti, ttlSeconds);
        redisTemplate.expire(userIndexKey, jwtProperties.getRefreshTokenTtl(), TimeUnit.SECONDS);
    }

    public void validate(String rawToken) {
        if (!jwtTokenProvider.validateToken(rawToken)) {
            throw new BizException(ErrorCode.AUTH_TOKEN_INVALID);
        }

        String jti = jwtTokenProvider.extractJti(rawToken);
        String cached = redisTemplate.opsForValue().get(REDIS_PREFIX + jti);
        if (cached == null) {
            throw new BizException(ErrorCode.AUTH_REFRESH_TOKEN_REVOKED);
        }
    }

    @Transactional
    public void revoke(String rawToken) {
        Long userId = jwtTokenProvider.extractUserId(rawToken);
        String jti = jwtTokenProvider.extractJti(rawToken);
        redisTemplate.delete(REDIS_PREFIX + jti);
        redisTemplate.opsForHash().delete(REDIS_USER_INDEX_PREFIX + userId, jti);
    }

    @Transactional
    public void revokeAll(Long userId) {
        String userIndexKey = REDIS_USER_INDEX_PREFIX + userId;
        var userTokens = redisTemplate.opsForHash().keys(userIndexKey);
        if (userTokens == null || userTokens.isEmpty()) {
            return;
        }
        for (Object userTokenJti : userTokens) {
            redisTemplate.delete(REDIS_PREFIX + userTokenJti);
        }
        redisTemplate.delete(userIndexKey);
    }
}
