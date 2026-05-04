package kr.co.realestate.common.logging;

import kr.co.realestate.config.TraceProperties;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@RequiredArgsConstructor
public class CorrelationIdFilter extends OncePerRequestFilter {

    public static final String REQUEST_TRACE_ID_ATTR = "traceId";
    public static final String REQUEST_CORRELATION_ID_ATTR = "correlationId";

    private final TraceProperties traceProperties;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String canonicalRequestId = resolveCanonicalRequestId(request);
        String correlationId = canonicalRequestId;
        String traceId = canonicalRequestId;

        TraceContext.setTraceAndCorrelation(traceId, correlationId);
        request.setAttribute(REQUEST_TRACE_ID_ATTR, traceId);
        request.setAttribute(REQUEST_CORRELATION_ID_ATTR, correlationId);

        response.setHeader(traceProperties.getTraceHeader(), traceId);
        response.setHeader(traceProperties.getCorrelationHeader(), correlationId);
        response.setHeader(traceProperties.getRequestIdHeader(), correlationId);

        try {
            filterChain.doFilter(request, response);
        } finally {
            TraceContext.clear();
        }
    }

    private String resolveCanonicalRequestId(HttpServletRequest request) {
        String correlationHeaderValue = request.getHeader(traceProperties.getCorrelationHeader());
        if (StringUtils.hasText(correlationHeaderValue)) {
            return correlationHeaderValue;
        }

        String requestHeaderValue = request.getHeader(traceProperties.getRequestIdHeader());
        if (StringUtils.hasText(requestHeaderValue)) {
            return requestHeaderValue;
        }

        String traceHeaderValue = request.getHeader(traceProperties.getTraceHeader());
        if (StringUtils.hasText(traceHeaderValue)) {
            return traceHeaderValue;
        }

        return UUID.randomUUID().toString();
    }
}
