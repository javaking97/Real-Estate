package kr.co.realestate.exceptions;

import kr.co.realestate.domain.common.enums.ErrorCodeInterface;
import lombok.Getter;

public abstract class ApplicationException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    @Getter
    private final ErrorCodeInterface errorCode;

    protected ApplicationException(String message, ErrorCodeInterface errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    protected ApplicationException(ErrorCodeInterface errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
