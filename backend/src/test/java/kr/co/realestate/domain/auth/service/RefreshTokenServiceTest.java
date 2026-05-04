package kr.co.realestate.domain.auth.service;

import kr.co.realestate.domain.common.enums.ErrorCode;
import kr.co.realestate.exceptions.BizException;
import kr.co.realestate.security.jwt.JwtProperties;
import kr.co.realestate.security.jwt.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RefreshTokenServiceTest {

    @Mock private StringRedisTemplate redisTemplate;
    @Mock private ValueOperations<String, String> valueOps;
    @Mock private HashOperations<String, Object, Object> hashOps;

    private JwtTokenProvider jwtTokenProvider;
    private JwtProperties jwtProperties;

    @InjectMocks
    private RefreshTokenService refreshTokenService;

    private String validRefreshToken;
    private String jti;

    @BeforeEach
    void setUp() {
        jwtProperties = new JwtProperties();
        jwtProperties.setSecret("test-secret-key-must-be-at-least-32-characters-long!!");
        jwtProperties.setAccessTokenTtl(3600L);
        jwtProperties.setRefreshTokenTtl(2592000L);
        jwtTokenProvider = new JwtTokenProvider(jwtProperties);

        refreshTokenService = new RefreshTokenService(
                redisTemplate, jwtTokenProvider, jwtProperties);

        validRefreshToken = jwtTokenProvider.generateRefreshToken(1L, "user", List.of("ROLE_USER"));
        jti = jwtTokenProvider.extractJti(validRefreshToken);
    }

    @Test
    void validate_shouldPass_whenTokenExistsInRedis() {
        // Arrange
        when(redisTemplate.opsForValue()).thenReturn(valueOps);
        when(valueOps.get("refresh:" + jti)).thenReturn("1");

        // Act & Assert — 예외 없음
        assertThatCode(() -> refreshTokenService.validate(validRefreshToken)).doesNotThrowAnyException();
    }

    @Test
    void validate_shouldThrowRevoked_whenTokenMissingInRedis() {
        when(redisTemplate.opsForValue()).thenReturn(valueOps);
        when(valueOps.get("refresh:" + jti)).thenReturn(null);

        assertThatThrownBy(() -> refreshTokenService.validate(validRefreshToken))
                .isInstanceOf(BizException.class)
                .satisfies(e -> assertThat(((BizException) e).getErrorCode())
                        .isEqualTo(ErrorCode.AUTH_REFRESH_TOKEN_REVOKED));
    }

    @Test
    void revoke_shouldDeleteFromRedisAndUserIndex() {
        when(redisTemplate.opsForHash()).thenReturn(hashOps);
        when(redisTemplate.delete(anyString())).thenReturn(true);

        refreshTokenService.revoke(validRefreshToken);

        verify(redisTemplate).delete("refresh:" + jti);
        verify(hashOps).delete(eq("refresh:user:1"), eq(jti));
    }

    @Test
    void revokeAll_shouldDeleteAllUserTokensAndUserIndex() {
        when(redisTemplate.opsForHash()).thenReturn(hashOps);
        when(hashOps.keys("refresh:user:1")).thenReturn(Set.of("jti-a", "jti-b"));
        when(redisTemplate.delete(anyString())).thenReturn(true);

        refreshTokenService.revokeAll(1L);

        verify(redisTemplate).delete("refresh:jti-a");
        verify(redisTemplate).delete("refresh:jti-b");
        verify(redisTemplate).delete("refresh:user:1");
    }
}
