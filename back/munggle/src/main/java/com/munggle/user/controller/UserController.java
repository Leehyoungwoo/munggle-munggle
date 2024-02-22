package com.munggle.user.controller;

import com.munggle.domain.model.entity.User;
import com.munggle.user.dto.*;
import com.munggle.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/mypage")
    @ResponseStatus(HttpStatus.OK)
    public UserMyPageDto getMyPage(@AuthenticationPrincipal User principal) {
        Long id = principal.getId();
        return userService.getUserMypage(id);
    }

    @GetMapping("/{userId}")
    @ResponseStatus(HttpStatus.OK)
    public UserProfileDto getMemberInfo(@PathVariable Long userId) {
        return userService.getUserProfile(userId);
    }

    @GetMapping("/nickname")
    @ResponseStatus(HttpStatus.OK)
    public void checkDuplicatedNickname(@RequestParam("nickname") String nickname) {
        userService.checkDuplicateNickname(nickname);
    }

    @PostMapping("/emails/verification-requests")
    @ResponseStatus(HttpStatus.OK)
    public void sendVerificationMessage(@RequestParam("email") String email) {
        userService.sendCodeToEmail(email);
    }

    @GetMapping("/emails/verifications")
    @ResponseStatus(HttpStatus.OK)
    public void verifyByEmail(@RequestParam("email") String email,
                              @RequestParam("code") String autoCode) {
        userService.verify(email, autoCode);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    public void joinMember(@RequestBody @Valid UserCreateDto userCreateDto) {
        userService.joinMember(userCreateDto);
    }

    @PutMapping("/background")
    @ResponseStatus(HttpStatus.OK)
    public void updateBackgroundImage(@AuthenticationPrincipal User principal,
                                      @RequestPart(value = "backgroundImage") MultipartFile file) {
        Long id = principal.getId();
        userService.changeBackgroundImage(id, file);
    }

    @PutMapping("/profile-image")
    @ResponseStatus(HttpStatus.OK)
    public void updateProfileImage(@AuthenticationPrincipal User principal,
                                   @RequestPart(value = "profileImage") MultipartFile file) {
        Long id = principal.getId();
        userService.changeProfileImage(id, file);
    }

    @PutMapping()
    @ResponseStatus(HttpStatus.OK)
    public void updateProfile(@AuthenticationPrincipal User principal,
                              @Valid @RequestBody UpdateProfileDto updateProfileDto) {
        Long id = principal.getId();
        userService.updateProfile(id, updateProfileDto);
    }

    @PutMapping("/password")
    @ResponseStatus(HttpStatus.OK)
    public void updatePassword(@AuthenticationPrincipal User principal,
                               @RequestBody @Valid UpdatePasswordDto updatePasswordDto) {
        Long id = principal.getId();
        userService.updatePassword(id, updatePasswordDto);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.OK)
    public void deleteMember(@AuthenticationPrincipal User principal) {
        Long id = principal.getId();
        userService.deleteMember(id);
    }

    @DeleteMapping("/background")
    @ResponseStatus(HttpStatus.OK)
    public void deleteBackgroundImage(@AuthenticationPrincipal User principal) {
        Long id = principal.getId();
        userService.deleteBackgroundImage(id);
    }

    @DeleteMapping("/profile-image")
    @ResponseStatus(HttpStatus.OK)
    public void deleteProfileImage(@AuthenticationPrincipal User principal) {
        Long id = principal.getId();
        userService.deleteProfileImage(id);
    }

    @GetMapping("/recommend")
    @ResponseStatus(HttpStatus.OK)
    public List<UserProfileDto> recommendUserList(@AuthenticationPrincipal User principal){
        Long id = principal.getId();
        return userService.recommendUserList(id);
    }
}