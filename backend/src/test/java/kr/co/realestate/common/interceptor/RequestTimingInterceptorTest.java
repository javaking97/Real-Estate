package kr.co.realestate.common.interceptor;

import kr.co.realestate.config.TimingProperties;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.assertj.core.api.Assertions.assertThat;

class RequestTimingInterceptorTest {

    @Test
    void afterCompletion_shouldAddTimingHeader_whenAddHeaderEnabled() {
        TimingProperties timingProperties = new TimingProperties();
        timingProperties.setAddHeader(true);
        timingProperties.setLogAllRequests(false);
        timingProperties.setSlowRequestThreshold(Long.MAX_VALUE);

        RequestTimingInterceptor interceptor = new RequestTimingInterceptor(timingProperties);
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/v1/timing/header-on");
        MockHttpServletResponse response = new MockHttpServletResponse();

        interceptor.preHandle(request, response, new Object());
        interceptor.afterCompletion(request, response, new Object(), null);

        String header = response.getHeader("X-Response-Time");
        assertThat(header).isNotNull();
        assertThat(header).matches("\\d+ms");
    }

    @Test
    void afterCompletion_shouldNotAddTimingHeader_whenAddHeaderDisabled() {
        TimingProperties timingProperties = new TimingProperties();
        timingProperties.setAddHeader(false);
        timingProperties.setLogAllRequests(false);
        timingProperties.setSlowRequestThreshold(Long.MAX_VALUE);

        RequestTimingInterceptor interceptor = new RequestTimingInterceptor(timingProperties);
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/v1/timing/header-off");
        MockHttpServletResponse response = new MockHttpServletResponse();

        interceptor.preHandle(request, response, new Object());
        interceptor.afterCompletion(request, response, new Object(), null);

        assertThat(response.getHeader("X-Response-Time")).isNull();
    }
}
