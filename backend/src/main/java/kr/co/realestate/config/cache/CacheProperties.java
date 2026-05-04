package kr.co.realestate.config.cache;

import java.time.Duration;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "cache")
public class CacheProperties {

    private Duration defaultTtl = Duration.ofMinutes(10);
    private String keyPrefix = "real-estate::";
    private boolean cacheNullValues = false;
}
