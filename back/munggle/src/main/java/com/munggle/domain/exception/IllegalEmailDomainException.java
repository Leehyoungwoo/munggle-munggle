package com.munggle.domain.exception;

public class IllegalEmailDomainException extends RuntimeException{

    public IllegalEmailDomainException(ExceptionMessage message) {
        super(message.getMessage());
    }

}
