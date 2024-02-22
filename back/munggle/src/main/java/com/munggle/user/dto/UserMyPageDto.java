package com.munggle.user.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
public record UserMyPageDto(

        Long Id,

        String backgroundImgUrl,

        String profileImgUrl,

        @NotNull
        String username,

        @NotNull
        String nickname,

        String description,

        Integer followerCount,

        Integer followingCount) {
}