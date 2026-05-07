package kr.co.realestate.config.cache;

import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.cache.RedisCacheManagerBuilderCustomizer;
import org.springframework.data.redis.cache.RedisCacheConfiguration;

import java.time.Duration;

import static org.assertj.core.api.Assertions.assertThat;

class CacheConfigTest {

    @Test
    void cacheProperties_shouldUseExpectedDefaults() {
        CacheProperties cacheProperties = new CacheProperties();

        assertThat(cacheProperties.getDefaultTtl()).isEqualTo(Duration.ofMinutes(10));
        assertThat(cacheProperties.getKeyPrefix()).isEqualTo("real-estate::");
        assertThat(cacheProperties.isCacheNullValues()).isFalse();
    }

    @Test
    void redisCacheConfiguration_shouldBeCreatedWithGivenProperties() {
        CacheConfig cacheConfig = new CacheConfig();
        CacheProperties cacheProperties = new CacheProperties();
        cacheProperties.setDefaultTtl(Duration.ofSeconds(30));
        cacheProperties.setKeyPrefix("custom::");
        cacheProperties.setCacheNullValues(false);

        RedisCacheConfiguration configuration = cacheConfig.redisCacheConfiguration(cacheProperties);

        Duration ttl = configuration.getTtlFunction().getTimeToLive("users", "value");
        assertThat(ttl).isEqualTo(Duration.ofSeconds(30));
        String prefix = configuration.getKeyPrefix().compute("users");
        assertThat(prefix).isEqualTo("custom::users::");
        assertThat(configuration.getAllowCacheNullValues()).isFalse();
    }

    @Test
    void redisCacheManagerBuilderCustomizer_shouldBeExposed() {
        CacheConfig cacheConfig = new CacheConfig();
        CacheProperties cacheProperties = new CacheProperties();
        RedisCacheConfiguration configuration = cacheConfig.redisCacheConfiguration(cacheProperties);

        RedisCacheManagerBuilderCustomizer customizer = cacheConfig.redisCacheManagerBuilderCustomizer(configuration);

        assertThat(customizer).isNotNull();
    }
}
