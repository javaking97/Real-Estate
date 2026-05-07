package kr.co.realestate.domain.common.model;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ApiResponse<T> {

    @Builder.Default
    private int resultCode = 200;

    @Builder.Default
    private String resultMsg = "success";

    private T result;

    public static <T> ApiResponse<T> success(T result) {
        return ApiResponse.<T>builder().result(result).build();
    }

    public static <T> ApiResponse<T> error(int code, String message) {
        return ApiResponse.<T>builder().resultCode(code).resultMsg(message).build();
    }
}
