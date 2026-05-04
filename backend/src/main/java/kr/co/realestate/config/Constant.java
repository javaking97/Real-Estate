package kr.co.realestate.config;

import java.time.ZoneId;

public class Constant {

    public static final String FORMAT_LOCAL_DATE_TIME = "yyyy-MM-dd'T'HH:mm:ss";
    public static final String FORMAT_LOCAL_DATE = "yyyy-MM-dd";
    public static final String FORMAT_LOCAL_TIME = "HH:mm:ss";
    public static final String FORMAT_DATE = "yyyyMMddHHmmss";

    public static final ZoneId DEFAULT_ZONE_ID = ZoneId.of("Asia/Seoul");

    public static final String API_VERSION = "/v1";

    private Constant() {
        throw new UnsupportedOperationException("불변변수용 클래스");
    }
}
