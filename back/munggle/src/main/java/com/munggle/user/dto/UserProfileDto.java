package com.munggle.user.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
public record UserProfileDto(
        Long id,
        String backgroundImgUrl,
        String profileImgUrl,
        @NotNull
        String nickname,
        String desc,
        Integer followerCount,
        Integer followingCount) {
}