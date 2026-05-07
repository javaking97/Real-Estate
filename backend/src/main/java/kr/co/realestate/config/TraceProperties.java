package kr.co.realestate.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "app.tracing")
public class TraceProperties {

    private String traceHeader = "X-Trace-Id";
    private String correlationHeader = "X-Correlation-Id";
    /** Accepted as correlationId when X-Correlation-Id header is absent. */
    private String requestIdHeader = "X-Request-Id";
}
