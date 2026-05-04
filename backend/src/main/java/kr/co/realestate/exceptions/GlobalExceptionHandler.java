package kr.co.realestate.exceptions;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.json.JsonParseException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.servlet.NoHandlerFoundException;

import kr.co.realestate.domain.common.enums.ErrorCode;
import kr.co.realestate.domain.common.enums.ErrorCodeInterface;
import kr.co.realestate.domain.common.model.ErrorResponse;
import kr.co.realestate.domain.common.model.ErrorResponseContext;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ApplicationException.class)
    protected ResponseEntity<ErrorResponse> handleApplicationException(ApplicationException e, HttpServletRequest request) {
        logHandledException(e.getErrorCode(), e);
        return buildResponse(e.getErrorCode(), ErrorResponse.of(e.getErrorCode(), e.getMessage(), e.getMessage()), request);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<ErrorResponse> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                           HttpServletRequest request) {
        ErrorCode errorCode = ErrorCode.NOT_VALID_ERROR;
        logHandledException(errorCode, ex);
        return buildResponse(errorCode, ErrorResponse.of(errorCode, ex.getBindingResult(), errorCode.getMessage()), request);
    }

    @ExceptionHandler({MissingRequestHeaderException.class, HttpMessageNotReadableException.class})
    protected ResponseEntity<ErrorResponse> handleMissingBodyOrHeader(Exception ex, HttpServletRequest request) {
        ErrorCode errorCode = ErrorCode.REQUEST_BODY_MISSING_ERROR;
        logHandledException(errorCode, ex);
        return buildResponse(errorCode, ErrorResponse.of(errorCode, errorCode.getMessage(), errorCode.getMessage()), request);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    protected ResponseEntity<ErrorResponse> handleMissingServletRequestParameter(MissingServletRequestParameterException ex,
                                                                                   HttpServletRequest request) {
        ErrorCode errorCode = ErrorCode.MISSING_REQUEST_PARAMETER_ERROR;
        logHandledException(errorCode, ex);
        return buildResponse(errorCode, ErrorResponse.of(errorCode, errorCode.getMessage(), errorCode.getMessage()), request);
    }

    @ExceptionHandler({HttpClientErrorException.BadRequest.class, JsonParseException.class,
            com.fasterxml.jackson.core.JsonProcessingException.class})
    protected ResponseEntity<ErrorResponse> handleBadRequest(Exception ex, HttpServletRequest request) {
        ErrorCode errorCode = ErrorCode.BAD_REQUEST_ERROR;
        logHandledException(errorCode, ex);
        return buildResponse(errorCode, ErrorResponse.of(errorCode, errorCode.getMessage(), errorCode.getMessage()), request);
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    protected ResponseEntity<ErrorResponse> handleNoHandlerFound(NoHandlerFoundException ex, HttpServletRequest request) {
        ErrorCode errorCode = ErrorCode.NOT_FOUND_ERROR;
        logHandledException(errorCode, ex);
        return buildResponse(errorCode, ErrorResponse.of(errorCode, errorCode.getMessage(), errorCode.getMessage()), request);
    }

    @ExceptionHandler(Exception.class)
    protected ResponseEntity<ErrorResponse> handleAll(Exception ex, HttpServletRequest request) {
        log.error("Unhandled exception", ex);
        ErrorCode errorCode = ErrorCode.INTERNAL_SERVER_ERROR;
        return buildResponse(errorCode, ErrorResponse.of(errorCode, errorCode.getMessage(), errorCode.getMessage()), request);
    }

    private ResponseEntity<ErrorResponse> buildResponse(ErrorCodeInterface errorCode, ErrorResponse errorResponse,
                                                        HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.valueOf(errorCode.getStatus()))
                .body(ErrorResponseContext.enrich(errorResponse, request));
    }

    private void logHandledException(ErrorCodeInterface errorCode, Exception exception) {
        if (errorCode.getStatus() >= 500) {
            log.error("Handled exception status={} code={}", errorCode.getStatus(), errorCode.getDivisionCode(), exception);
            return;
        }

        log.warn("Handled exception status={} code={} message={}",
                errorCode.getStatus(), errorCode.getDivisionCode(), exception.getMessage());
    }
}
