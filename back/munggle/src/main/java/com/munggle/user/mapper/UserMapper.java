package com.munggle.user.mapper;

import com.munggle.domain.model.entity.User;
import com.munggle.domain.model.entity.UserImage;
import com.munggle.domain.model.entity.type.Role;
import com.munggle.image.dto.FileInfoDto;
import com.munggle.user.dto.UserCreateDto;
import com.munggle.user.dto.UserMyPageDto;
import com.munggle.user.dto.UserProfileDto;
import com.munggle.user.dto.UserListDto;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class UserMapper {

    public static User toEntity(UserCreateDto userCreateDto) {
        return User.builder()
                .username(userCreateDto.username())
                .password(userCreateDto.password())
                .nickname(userCreateDto.nickname())
                .role(Role.MEMBER)
                .isEnabled(true)
                .build();
    }

    public static UserMyPageDto toUserMyPageDto(User user, Integer followerCount, Integer followingCount) {
        return UserMyPageDto.builder()
                .Id(user.getId())
                .backgroundImgUrl(Optional.ofNullable(user.getBackgroundImage())
                        .map(UserImage::getImageURL).orElse(null))
                .profileImgUrl(Optional.ofNullable(user.getProfileImage())
                        .map(UserImage::getImageURL).orElse(null))
                .username(user.getUsername())
                .nickname(user.getNickname())
                .description(user.getDescription())
                .followerCount(followerCount)
                .followingCount(followingCount)
                .build();
    }

    public static UserProfileDto toUserProfileDto(User user) {
        return UserProfileDto.builder()
                .id(user.getId())
                .backgroundImgUrl(Optional.ofNullable(user.getBackgroundImage())
                        .map(UserImage::getImageURL).orElse(null))
                .profileImgUrl(Optional.ofNullable(user.getProfileImage())
                        .map(UserImage::getImageURL).orElse(null))
                .nickname(user.getNickname())
                .desc(user.getDescription())
                .build();
    }

    public static List<UserListDto> fromUsers(List<User> users) {
        return users.stream()
                .map(UserListDto::toUserListDto)
                .collect(Collectors.toList());
    }

    public static Page<UserListDto> convertToUserListDtoPage(Page<User> userPage, Long id) {
        return userPage.map(UserListDto::toUserListDto);
    }


    public static UserImage toUserImage(FileInfoDto file, User user, String type) {
        return UserImage.builder()
                .imageName(file.getFileName())
                .imageURL(file.getFileURL())
                .user(user)
                .imageType(type)
                .build();
    }
}