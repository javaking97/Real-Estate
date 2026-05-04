package kr.co.realestate.exceptions;

import kr.co.realestate.common.logging.CorrelationIdFilter;
import kr.co.realestate.domain.common.enums.ErrorCode;
import kr.co.realestate.domain.common.model.ErrorResponse;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.method.HandlerMethod;

import static org.assertj.core.api.Assertions.assertThat;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler globalExceptionHandler = new GlobalExceptionHandler();

    @Test
    void handleApplicationException_shouldIncludeErrorResponseContext() {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/v1/test/application");
        request.setAttribute(CorrelationIdFilter.REQUEST_TRACE_ID_ATTR, "trace-123");
        request.setAttribute(CorrelationIdFilter.REQUEST_CORRELATION_ID_ATTR, "corr-123");

        BizException exception = new BizException("business error", ErrorCode.BAD_REQUEST_ERROR);

        ResponseEntity<ErrorResponse> response = globalExceptionHandler.handleApplicationException(exception, request);

        assertThat(response.getStatusCode().value()).isEqualTo(400);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getDivisionCode()).isEqualTo("G001");
        assertThat(response.getBody().getReason()).isEqualTo("business error");
        assertThat(response.getBody().getPath()).isEqualTo("/v1/test/application");
        assertThat(response.getBody().getTraceId()).isEqualTo("trace-123");
        assertThat(response.getBody().getCorrelationId()).isEqualTo("corr-123");
        assertThat(response.getBody().getTimestamp()).isNotNull();
    }

    @Test
    void handleMethodArgumentNotValid_shouldReturnValidationErrorWithContext() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/v1/test/validation");
        request.setAttribute(CorrelationIdFilter.REQUEST_TRACE_ID_ATTR, "trace-456");
        request.setAttribute(CorrelationIdFilter.REQUEST_CORRELATION_ID_ATTR, "corr-456");

        ValidationTarget target = new ValidationTarget();
        BeanPropertyBindingResult bindingResult = new BeanPropertyBindingResult(target, "validationTarget");
        bindingResult.addError(new FieldError("validationTarget", "name", "", false, null, null, "must not be blank"));

        MethodArgumentNotValidException exception = new MethodArgumentNotValidException(
                new HandlerMethod(this, this.getClass().getDeclaredMethod("dummyHandler", ValidationTarget.class)).getMethodParameters()[0],
                bindingResult
        );

        ResponseEntity<ErrorResponse> response = globalExceptionHandler.handleMethodArgumentNotValid(exception, request);

        assertThat(response.getStatusCode().value()).isEqualTo(400);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getDivisionCode()).isEqualTo(ErrorCode.NOT_VALID_ERROR.getDivisionCode());
        assertThat(response.getBody().getErrors()).hasSize(1);
        assertThat(response.getBody().getErrors().get(0).getField()).isEqualTo("name");
        assertThat(response.getBody().getErrors().get(0).getValue()).isEmpty();
        assertThat(response.getBody().getErrors().get(0).getReason()).isEqualTo("must not be blank");
        assertThat(response.getBody().getPath()).isEqualTo("/v1/test/validation");
        assertThat(response.getBody().getTraceId()).isEqualTo("trace-456");
        assertThat(response.getBody().getCorrelationId()).isEqualTo("corr-456");
    }

    @SuppressWarnings("unused")
    private void dummyHandler(ValidationTarget validationTarget) {
    }

    private static final class ValidationTarget {
        private String name;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}
