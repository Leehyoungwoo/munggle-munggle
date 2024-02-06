package com.munggle.comment.dto;

import com.munggle.user.dto.UserProfileDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommentDetailDto {

    private Long commentId;
    private Long postId;
    private String contents;
    private Integer likeCnt;
    private Boolean isDeleted;

    private UserProfileDto user;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Boolean haveLiked;

}
