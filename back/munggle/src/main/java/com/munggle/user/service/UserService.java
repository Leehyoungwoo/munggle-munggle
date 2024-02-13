package com.munggle.user.service;

import com.munggle.domain.model.entity.User;
import com.munggle.user.dto.*;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService extends UserDetailsService, OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    User findMemberById(Long id);

    String getNicknameById(Long id);
    UserMyPageDto getUserMypage(Long id);

    UserProfileDto getUserProfile(Long id);

    List<UserListDto> getSearchPage(String keyword);

    void checkDuplicateNickname(String nickname);

    void verify(String email, String autoCode);

    void sendCodeToEmail(String email);

    void joinMember(UserCreateDto userCreateDto);

    void changeBackgroundImage(Long id, MultipartFile file);

    void changeProfileImage(Long id, MultipartFile file);

    void updateProfile(Long id, UpdateProfileDto updateProfileDto);

    void updatePassword(Long id, UpdatePasswordDto updatePasswordDto);

    void deleteMember(Long id);

    void deleteBackgroundImage(Long id);

    void deleteProfileImage(Long id);

    List<UserProfileDto> recommendUserList(Long userId);

    void resetFollowIncreaseCnt();
}
