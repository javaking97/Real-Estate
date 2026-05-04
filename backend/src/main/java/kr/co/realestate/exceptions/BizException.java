package kr.co.realestate.exceptions;

import kr.co.realestate.domain.common.enums.ErrorCodeInterface;

import lombok.Builder;

public class BizException extends ApplicationException {

    private static final long serialVersionUID = 1L;

    @Builder
    public BizException(String message, ErrorCodeInterface errorCode) {
        super(message, errorCode);
    }

    public BizException(ErrorCodeInterface errorCode) {
        super(errorCode);
    }
}
