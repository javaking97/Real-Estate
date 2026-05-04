package kr.co.realestate.common.logging;

import kr.co.realestate.config.TraceProperties;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.assertj.core.api.Assertions.assertThat;

class CorrelationIdFilterTest {

    @Test
    void doFilter_shouldUseCorrelationHeaderAsCanonicalId() throws Exception {
        TraceProperties traceProperties = new TraceProperties();
        CorrelationIdFilter filter = new CorrelationIdFilter(traceProperties);
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        request.addHeader("X-Correlation-Id", "corr-1");
        request.addHeader("X-Request-Id", "req-1");
        request.addHeader("X-Trace-Id", "trace-1");

        filter.doFilter(request, response, new MockFilterChain());

        assertThat(request.getAttribute(CorrelationIdFilter.REQUEST_TRACE_ID_ATTR)).isEqualTo("corr-1");
        assertThat(request.getAttribute(CorrelationIdFilter.REQUEST_CORRELATION_ID_ATTR)).isEqualTo("corr-1");
        assertThat(response.getHeader("X-Trace-Id")).isEqualTo("corr-1");
        assertThat(response.getHeader("X-Correlation-Id")).isEqualTo("corr-1");
        assertThat(response.getHeader("X-Request-Id")).isEqualTo("corr-1");
    }

    @Test
    void doFilter_shouldUseRequestIdWhenCorrelationHeaderMissing() throws Exception {
        TraceProperties traceProperties = new TraceProperties();
        CorrelationIdFilter filter = new CorrelationIdFilter(traceProperties);
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        request.addHeader("X-Request-Id", "req-2");
        request.addHeader("X-Trace-Id", "trace-2");

        filter.doFilter(request, response, new MockFilterChain());

        assertThat(response.getHeader("X-Trace-Id")).isEqualTo("req-2");
        assertThat(response.getHeader("X-Correlation-Id")).isEqualTo("req-2");
        assertThat(response.getHeader("X-Request-Id")).isEqualTo("req-2");
    }

    @Test
    void doFilter_shouldUseTraceIdWhenOthersMissing() throws Exception {
        TraceProperties traceProperties = new TraceProperties();
        CorrelationIdFilter filter = new CorrelationIdFilter(traceProperties);
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        request.addHeader("X-Trace-Id", "trace-3");

        filter.doFilter(request, response, new MockFilterChain());

        assertThat(response.getHeader("X-Trace-Id")).isEqualTo("trace-3");
        assertThat(response.getHeader("X-Correlation-Id")).isEqualTo("trace-3");
        assertThat(response.getHeader("X-Request-Id")).isEqualTo("trace-3");
    }
}
