package kr.co.realestate.security.jwt;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() {
        JwtProperties props = new JwtProperties();
        props.setSecret("test-secret-key-must-be-at-least-32-characters-long!!");
        props.setAccessTokenTtl(3600L);
        props.setRefreshTokenTtl(2592000L);
        jwtTokenProvider = new JwtTokenProvider(props);
    }

    @Test
    void generateAccessToken_shouldContainExpectedClaims() {
        // Arrange
        Long userId = 1L;
        String username = "testuser";
        List<String> roles = List.of("ROLE_USER");

        // Act
        String token = jwtTokenProvider.generateAccessToken(userId, username, roles);

        // Assert
        assertThat(jwtTokenProvider.extractUsername(token)).isEqualTo(username);
        assertThat(jwtTokenProvider.extractUserId(token)).isEqualTo(userId);
        assertThat(jwtTokenProvider.extractRoles(token)).containsExactly("ROLE_USER");
        assertThat(jwtTokenProvider.extractJti(token)).isNotBlank();
    }

    @Test
    void validateToken_shouldReturnTrue_forValidToken() {
        // Arrange
        String token = jwtTokenProvider.generateAccessToken(1L, "user", List.of("ROLE_USER"));

        // Act & Assert
        assertThat(jwtTokenProvider.validateToken(token)).isTrue();
    }

    @Test
    void validateToken_shouldReturnFalse_forTamperedToken() {
        // Arrange
        String token = jwtTokenProvider.generateAccessToken(1L, "user", List.of("ROLE_USER")) + "tampered";

        // Act & Assert
        assertThat(jwtTokenProvider.validateToken(token)).isFalse();
    }

    @Test
    void validateToken_shouldReturnFalse_forExpiredToken() {
        // Arrange — ttl 0 → 즉시 만료
        JwtProperties expiredProps = new JwtProperties();
        expiredProps.setSecret("test-secret-key-must-be-at-least-32-characters-long!!");
        expiredProps.setAccessTokenTtl(0L);
        expiredProps.setRefreshTokenTtl(0L);
        JwtTokenProvider expiredProvider = new JwtTokenProvider(expiredProps);

        String token = expiredProvider.generateAccessToken(1L, "user", List.of("ROLE_USER"));

        // Act & Assert
        assertThat(expiredProvider.validateToken(token)).isFalse();
    }

    @Test
    void generateRefreshToken_shouldHaveDifferentJti_fromAccessToken() {
        // Arrange
        Long userId = 1L;

        // Act
        String accessToken  = jwtTokenProvider.generateAccessToken(userId, "user", List.of());
        String refreshToken = jwtTokenProvider.generateRefreshToken(userId, "user", List.of());

        // Assert — 두 토큰의 jti가 서로 다름
        assertThat(jwtTokenProvider.extractJti(accessToken))
                .isNotEqualTo(jwtTokenProvider.extractJti(refreshToken));
    }
}
