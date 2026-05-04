package kr.co.realestate.common.interceptor;

import kr.co.realestate.config.TimingProperties;
import kr.co.realestate.config.annotations.NoLog;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

@Slf4j
@Component
@RequiredArgsConstructor
public class RequestTimingInterceptor implements HandlerInterceptor {

    private static final String START_TIME_ATTR = "requestStartTime";
    private static final String TIMING_HEADER = "X-Response-Time";

    private final TimingProperties timingProperties;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        request.setAttribute(START_TIME_ATTR, System.currentTimeMillis());
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response,
                                Object handler, Exception ex) {
        Long startTime = (Long) request.getAttribute(START_TIME_ATTR);
        if (startTime == null) return;

        long elapsed = System.currentTimeMillis() - startTime;

        if (timingProperties.isAddHeader()) {
            response.setHeader(TIMING_HEADER, elapsed + "ms");
        }

        if (isLoggingSuppressed(handler)) return;

        if (elapsed > timingProperties.getSlowRequestThreshold()) {
            log.warn("SLOW REQUEST: {} {} took {}ms (threshold: {}ms)",
                    request.getMethod(), request.getRequestURI(), elapsed, timingProperties.getSlowRequestThreshold());
        } else if (timingProperties.isLogAllRequests()) {
            log.info("Request: {} {} took {}ms", request.getMethod(), request.getRequestURI(), elapsed);
        }
    }

    private boolean isLoggingSuppressed(Object handler) {
        if (!(handler instanceof HandlerMethod hm)) return false;
        return hm.getMethodAnnotation(NoLog.class) != null
                || hm.getBeanType().getAnnotation(NoLog.class) != null;
    }
}
