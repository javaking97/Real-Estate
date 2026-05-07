package kr.co.realestate.domain.common.enums;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public enum ErrorCode implements ErrorCodeInterface {

    // 4xx Client errors
    BAD_REQUEST_ERROR(400,           "G001", "Bad request"),
    REQUEST_BODY_MISSING_ERROR(400,  "G002", "Request body is missing"),
    INVALID_TYPE_VALUE(400,          "G003", "Invalid type value"),
    MISSING_REQUEST_PARAMETER_ERROR(400, "G004", "Missing request parameter"),
    NOT_VALID_ERROR(400,             "G008", "Validation failed"),
    NOT_VALID_HEADER_ERROR(400,      "G009", "Invalid header value"),

    UNAUTHORIZED(401,                "G010", "Unauthorized"),
    FORBIDDEN_ERROR(403,             "G011", "Forbidden"),
    NOT_FOUND_ERROR(404,             "G012", "Resource not found"),

    // 5xx Server errors
    INTERNAL_SERVER_ERROR(500,       "G999", "Internal server error"),

    // Auth domain
    AUTH_INVALID_CREDENTIALS(400,    "A001", "Invalid username or password"),
    AUTH_TOKEN_EXPIRED(401,          "A004", "Token has expired"),
    AUTH_TOKEN_INVALID(401,          "A005", "Token is invalid"),
    AUTH_REFRESH_TOKEN_REVOKED(401,  "A006", "Refresh token has been revoked");

    private int status;
    private String divisionCode;
    private String message;

    ErrorCode(int status, String divisionCode, String message) {
        this.status = status;
        this.divisionCode = divisionCode;
        this.message = message;
    }
}
