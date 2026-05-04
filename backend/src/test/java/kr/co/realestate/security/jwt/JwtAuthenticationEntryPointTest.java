package kr.co.realestate.security.jwt;

import kr.co.realestate.common.logging.CorrelationIdFilter;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.AuthenticationException;

import static org.assertj.core.api.Assertions.assertThat;

class JwtAuthenticationEntryPointTest {

    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint = new JwtAuthenticationEntryPoint(objectMapper);

    @Test
    void commence_shouldWriteUnauthorizedBodyWithRequestContext() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/v1/secure/resource");
        request.setAttribute(CorrelationIdFilter.REQUEST_TRACE_ID_ATTR, "trace-jwt");
        request.setAttribute(CorrelationIdFilter.REQUEST_CORRELATION_ID_ATTR, "corr-jwt");

        MockHttpServletResponse response = new MockHttpServletResponse();
        AuthenticationException authException = new AuthenticationException("token missing") {
        };

        jwtAuthenticationEntryPoint.commence(request, response, authException);

        assertThat(response.getStatus()).isEqualTo(401);
        assertThat(response.getContentType()).startsWith("application/json");

        JsonNode body = objectMapper.readTree(response.getContentAsString());
        assertThat(body.get("status").asInt()).isEqualTo(401);
        assertThat(body.get("divisionCode").asText()).isEqualTo("G010");
        assertThat(body.get("reason").asText()).isEqualTo("token missing");
        assertThat(body.get("path").asText()).isEqualTo("/v1/secure/resource");
        assertThat(body.get("traceId").asText()).isEqualTo("trace-jwt");
        assertThat(body.get("correlationId").asText()).isEqualTo("corr-jwt");
        assertThat(body.get("timestamp").asText()).isNotBlank();
    }
}
