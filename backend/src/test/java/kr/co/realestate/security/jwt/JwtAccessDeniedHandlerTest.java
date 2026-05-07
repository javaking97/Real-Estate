package kr.co.realestate.security.jwt;

import kr.co.realestate.common.logging.CorrelationIdFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.access.AccessDeniedException;

import static org.assertj.core.api.Assertions.assertThat;

class JwtAccessDeniedHandlerTest {

    private final JwtAccessDeniedHandler handler = new JwtAccessDeniedHandler(
            new ObjectMapper().findAndRegisterModules()
    );

    @Test
    void handle_shouldWriteForbiddenErrorResponse() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/v1/admin/test");
        request.setAttribute(CorrelationIdFilter.REQUEST_TRACE_ID_ATTR, "trace-789");
        request.setAttribute(CorrelationIdFilter.REQUEST_CORRELATION_ID_ATTR, "corr-789");
        MockHttpServletResponse response = new MockHttpServletResponse();

        handler.handle(request, response, new AccessDeniedException("forbidden"));

        assertThat(response.getStatus()).isEqualTo(403);
        assertThat(response.getContentType()).startsWith("application/json");
        assertThat(response.getContentAsString()).contains("G011");
        assertThat(response.getContentAsString()).contains("trace-789");
        assertThat(response.getContentAsString()).contains("corr-789");
    }
}
