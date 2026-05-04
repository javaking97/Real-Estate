package kr.co.realestate;

import kr.co.realestate.config.AppProperties;
import java.util.TimeZone;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@Slf4j
@RequiredArgsConstructor
public class RealEstateApplication {

    private final AppProperties appProperties;

	public static void main(String[] args) {
		SpringApplication.run(RealEstateApplication.class, args);
	}

	@PostConstruct
	void init() {
		TimeZone.setDefault(TimeZone.getTimeZone(appProperties.getTimezone()));
		log.info("Application started with timezone: {}", appProperties.getTimezone());
	}
}
