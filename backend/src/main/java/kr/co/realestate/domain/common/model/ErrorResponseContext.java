package kr.co.realestate.domain.common.model;

import java.time.LocalDateTime;

import kr.co.realestate.common.logging.CorrelationIdFilter;
import kr.co.realestate.common.logging.TraceContext;

import jakarta.servlet.http.HttpServletRequest;

public final class ErrorResponseContext {

    private ErrorResponseContext() {
    }

    public static ErrorResponse enrich(ErrorResponse errorResponse, HttpServletRequest request) {
        String traceId = (String) request.getAttribute(CorrelationIdFilter.REQUEST_TRACE_ID_ATTR);
        String correlationId = (String) request.getAttribute(CorrelationIdFilter.REQUEST_CORRELATION_ID_ATTR);

        if (traceId == null) {
            traceId = TraceContext.getTraceId();
        }

        if (correlationId == null) {
            correlationId = TraceContext.getCorrelationId();
        }

        return errorResponse.withRequestContext(traceId, correlationId, request.getRequestURI(), LocalDateTime.now());
    }
}
