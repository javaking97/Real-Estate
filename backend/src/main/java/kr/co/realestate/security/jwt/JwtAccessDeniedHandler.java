package kr.co.realestate.security.jwt;

import kr.co.realestate.domain.common.enums.ErrorCode;
import kr.co.realestate.domain.common.model.ErrorResponse;
import kr.co.realestate.domain.common.model.ErrorResponseContext;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper;

    @Override
    public void handle(HttpServletRequest request,
                       HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        ErrorCode errorCode = ErrorCode.FORBIDDEN_ERROR;
        ErrorResponse body = ErrorResponseContext.enrich(
                ErrorResponse.of(errorCode, accessDeniedException.getMessage(), errorCode.getMessage()),
                request
        );
        response.getWriter().write(objectMapper.writeValueAsString(body));
    }
}
