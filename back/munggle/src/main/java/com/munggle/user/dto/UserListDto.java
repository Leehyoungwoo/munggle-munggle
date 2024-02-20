package com.munggle.user.dto;

import com.munggle.domain.model.entity.User;
import com.munggle.domain.model.entity.UserImage;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Optional;

@Getter
@Builder
@AllArgsConstructor
public class UserListDto {

    private final Long id;

    private final String profileImgUrl;

    @NotBlank
    private final String nickname;

    @Setter
    private boolean isFollowing;

    public static UserListDto toUserListDto(User user) {
        return UserListDto.builder()
                .id(user.getId())
                .profileImgUrl(Optional.ofNullable(user.getProfileImage())
                        .map(UserImage::getImageURL).orElse(null))
                .nickname(user.getNickname())
                .build();
    }

    public static UserListDto toUserListDto(User user, Long id) {
        return UserListDto.builder()
                .id(user.getId())
                .profileImgUrl(Optional.ofNullable(user.getProfileImage())
                        .map(UserImage::getImageURL).orElse(null))
                .nickname(user.getNickname())
                .build();
    }
}
