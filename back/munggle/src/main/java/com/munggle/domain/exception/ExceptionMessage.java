package com.munggle.domain.exception;

import lombok.Getter;

@Getter
public enum ExceptionMessage {

    ILLEGEL_EMAIL_DOMAIN("올바르지 않은 도메인입니다."),

    USER_NOT_FOUND("회원을 찾을 수 없습니다."),

    NICKNAME_ILLEGAL("닉네임이 올바르지 않습니다."),

    PASSWORD_ILLEGAL("비밀번호는 공백이 포함되지 않은 8 ~ 15자리 입니다."),

    SELF_FOLLOW("자신을 팔로우할 수 없습니다."),

    SELF_BLOCK("자신을 차단할 수 없습니다."),

    BLOCK_NOT_FOUND("차단된 회원을 찾을 수 없습니다"),

    FOLLOW_NOT_FOUND("팔로우한 회원을 찾을 수 없습니다."),

    WALK_NOT_FOUND("산책 기록을 찾을 수 없습니다."),

    DUPLICATED_NICKNAME("닉네임이 중복됩니다."),

    MAIL_NOT_VALID("이메일이 유효하지 않습니다."),

    EMAIL_DUPLICATE("이미 가입된 이메일입니다."),

    WALK_LOG_NOT_FOUND("산책 로그를 찾을 수 없습니다."),

    POST_NOT_FOUND("게시글을 찾을 수 없습니다."),

    EXTENSION_ILLEGAL("지원하지 않는 파일 확장자입니다."),

    PASSWORD_NOT_CONFIRM("새 비밀번호와 비밀번호 확인이 일치하지 않습니다."),

    DOG_NOT_FOUND("반려견 정보를 찾을 수 없습니다."),

    MATCHING_CHARACTER_NOT_FOUND("매칭 특성이 등록되지 않았습니다."),

    MATCHING_IS_NOT_ON("매칭 옵션이 켜지지 않았습니다."),

    NOT_YOUR_DOG("당신의 반려견이 아닙니다."),

    TOKEN_NOT_AVAILABLE("토큰이 유효하지 않습니다"),

    ROOM_NOT_FOUND("대화 상대를 찾을 수 없습니다"),

    TAG_NOT_FOUND("해당 태그를 찾을 수 없습니다."),

    COMMENT_NOT_FOUND("댓글을 찾을 수 없습니다."),

    KIND_NOT_FOUND("품종을 찾을 수 없습니다."),

    NOT_YOUR_COMMENT("당신이 작성한 댓글이 아닙니다."),

    NOT_YOUR_POST("당신이 작성한 게시글이 아닙니다."),

    ALARM_NOT_FOUND("알림을 찾을 수 없습니다."),

    NOT_YOUR_ALARM("당신의 알림이 아닙니다."),

    NOT_YOUR_WALK("당신이 기록한 산책이 아닙니다."),

    ALARM_TYPE_ILLEGAL("지원하지 않는 알림 타입입니다."),

    SEARCH_TYPE_ILLEGAL("지원하지 않는 검색 기능입니다."),

    OPEN_API_RESPONSE_ERROR("오류가 발생했습니다. 잠시후 다시 시도해주세요 : "),

    NOT_ALLOW_PAGE("잘못된 페이지 접근입니다.");


    private final String message;

    ExceptionMessage(String message) {
        this.message = message;
    }
}
