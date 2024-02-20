package com.munggle.domain.exception;

import com.munggle.jwt.InvalidTokenException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.text.ParseException;

@RestControllerAdvice
@Slf4j
public class ExceptionAdvice {

    @ExceptionHandler({UserNotFoundException.class, FollowNotFoundException.class, BlockNotFoundException.class,
            WalkNotFoundException.class, LocationsNotFoundException.class, DogNotFoundException.class, MatchingCharacterNotFoundException.class,
            CommentNotFoundException.class, RoomNotFoundException.class, KindNotFoundException.class})
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String handleNotFound(RuntimeException e) {
        return e.getMessage();
    }

    @ExceptionHandler({IllegalNicknameException.class, IllegalPasswordException.class, SelfInteractionException.class,
            MatchingNotOnException.class, NotYourDogException.class, NotYourCommentException.class, NotYourWalkException.class,
            OpenAPIErrorException.class, IllegalEmailDomainException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleBadRequest(RuntimeException e) {
        return e.getMessage();
    }

    @ExceptionHandler(EmailVerificationFailException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public String handleMailException(MailException e) {
        // 메일 전송 실패는 보통 서버 내부 오류로 간주됩니다.
        return e.getMessage();
    }

    @ExceptionHandler(DuplicateNickNameException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public String handleDuplicateException(RuntimeException e) {
        return e.getMessage();
    }

    @ExceptionHandler(InvalidTokenException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public String handleTokenException(InvalidTokenException e) {
        return e.getMessage();
    }
}
