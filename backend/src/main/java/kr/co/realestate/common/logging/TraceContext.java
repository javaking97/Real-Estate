package kr.co.realestate.common.logging;

import org.slf4j.MDC;

public final class TraceContext {

    public static final String TRACE_ID_KEY = "traceId";
    public static final String CORRELATION_ID_KEY = "correlationId";

    private TraceContext() {}

    public static String getTraceId() {
        return MDC.get(TRACE_ID_KEY);
    }

    public static String getCorrelationId() {
        return MDC.get(CORRELATION_ID_KEY);
    }

    public static void setTraceId(String traceId) {
        if (traceId != null) {
            MDC.put(TRACE_ID_KEY, traceId);
        }
    }

    public static void setCorrelationId(String correlationId) {
        if (correlationId != null) {
            MDC.put(CORRELATION_ID_KEY, correlationId);
        }
    }

    public static void setTraceAndCorrelation(String traceId, String correlationId) {
        setTraceId(traceId);
        setCorrelationId(correlationId);
    }

    public static void clear() {
        MDC.remove(TRACE_ID_KEY);
        MDC.remove(CORRELATION_ID_KEY);
    }
}
