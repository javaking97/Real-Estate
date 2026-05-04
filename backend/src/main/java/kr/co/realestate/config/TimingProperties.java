package kr.co.realestate.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "timing")
public class TimingProperties {

    private long slowRequestThreshold = 1000;
    private boolean logAllRequests = false;
    private boolean addHeader = true;
}
