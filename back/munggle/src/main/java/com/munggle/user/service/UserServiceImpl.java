package com.munggle.user.service;

import com.munggle.domain.exception.*;
import com.munggle.domain.model.entity.User;
import com.munggle.domain.model.entity.UserImage;
import com.munggle.follow.repository.FollowRepository;
import com.munggle.follow.service.FollowService;
import com.munggle.image.dto.FileInfoDto;
import com.munggle.image.service.FileS3UploadService;
import com.munggle.user.dto.*;
import com.munggle.email.service.EmailService;
import com.munggle.emailverification.EmailVerification;
import com.munggle.emailverification.EmailVerificationRepository;
import com.munggle.user.dto.UserCreateDto;
import com.munggle.user.dto.UserMyPageDto;
import com.munggle.user.dto.UserProfileDto;
import com.munggle.user.dto.UserListDto;
import com.munggle.user.mapper.UserMapper;
import com.munggle.user.repository.UserImageRepository;
import com.munggle.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.*;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.munggle.domain.exception.ExceptionMessage.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private final DefaultOAuth2UserService defaultOAuth2UserService = new DefaultOAuth2UserService();
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final UserImageRepository userImageRepository;
    private final FollowService followService;
    private final FollowRepository followRepository;
    private final FileS3UploadService fileS3UploadService;
    private final EmailVerificationRepository emailVerificationRepository;

    @Override
    public User findMemberById(Long id) {
        return userRepository.findByIdAndIsEnabledTrue(id)
                .orElseThrow(() -> new UserNotFoundException(USER_NOT_FOUND));
    }

    @Override
    public String getNicknameById(Long id) {
        User user = findMemberById(id);
        return user.getNickname();
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsernameAndIsEnabledTrue(username)
                .orElseThrow(() -> new UserNotFoundException(USER_NOT_FOUND));
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = defaultOAuth2UserService.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String email = switch (registrationId) {
            case "naver" -> {
                @SuppressWarnings("unchecked")
                Map<String, Object> response = (Map<String, Object>) oauth2User.getAttributes().get("response");
                email = (String) response.get("email");
                yield email;
            }
            case "kakao" -> {
                @SuppressWarnings("unchecked")
                Map<String, Object> response = (Map<String, Object>) oauth2User.getAttributes().get("kakao_account");
                email = (String) response.get("email");
                yield email;
            }
            default -> throw new IllegalEmailDomainException(ILLEGEL_EMAIL_DOMAIN);
        };

        return (User) this.loadUserByUsername(email);
    }


    @Override
    public UserMyPageDto getUserMypage(Long id) {
        User user = findMemberById(id);
        Integer followerCount = followService.getFollowerCount(id);
        Integer followingCount = followService.getFollowingCount(id);
        return UserMapper.toUserMyPageDto(user, followerCount, followingCount);
    }

    public UserProfileDto getUserProfile(Long id) {
        User user = findMemberById(id);
        return UserMapper.toUserProfileDto(user);
    }

    @Override
    public List<UserListDto> getSearchPage(String keyword) {
        List<User> userList = userRepository.findByNicknameContainingAndIsEnabledTrue(keyword);
        return UserMapper.fromUsers(userList);
    }

    @Override
    public void checkDuplicateNickname(String nickname) {
        userRepository.findByNicknameAndIsEnabledTrue(nickname)
                .ifPresent(user -> {
                    throw new DuplicateNickNameException(DUPLICATED_NICKNAME);
                });
    }


    @Override
    @Transactional
    public void verify(String email, String autoCode) {
        // 이메일 중복 가입 검증
        this.checkDuplicatedEmail(email);

        EmailVerification emailVerification = emailVerificationRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("인증 정보가 존재하지 않습니다."));

        // 인증 코드 검증
        if (!emailVerification.getVerificationCode().equals(autoCode)) {
            throw new IllegalArgumentException("인증 코드가 일치하지 않습니다.");
        }

        if (emailVerification.getExpirationTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("인증 코드가 만료되었습니다.");
        }

        // 인증이 성공하면 인증 정보 삭제
        emailVerificationRepository.delete(emailVerification);
    }

    @Override
    @Transactional
    public void sendCodeToEmail(String toEmail) {
        String title = "멍글멍글 이메일 인증 번호";
        String authCode = this.createCode();
        emailService.sendEmail(toEmail, title, authCode);
        // 이메일 인증 요청 시 인증 번호 Redis에 저장 ( key = "AuthCode " + Email / value = AuthCode )
        // 임시 구현으로 테이블로 구현
        EmailVerification emailVerification = EmailVerification.builder()
                .email(toEmail)
                .verificationCode(authCode)
                .expirationTime(LocalDateTime.now().plusMinutes(3))
                .build();
        emailVerificationRepository.save(emailVerification);
    }

    @Override
    @Transactional
    public void joinMember(UserCreateDto userCreateDto) {
        User newUser = UserMapper.toEntity(userCreateDto);
        userRepository.save(newUser);
    }

    @Override
    @Transactional
    public void changeBackgroundImage(Long id, MultipartFile file) {
        User user = this.findMemberById(id);
        // 기존 이미지 확인
        Optional.ofNullable(user.getBackgroundImage())
                .map(UserImage::getImageName)
                .ifPresent(imageName -> {
                    fileS3UploadService.removeFile(imageName);
                    userImageRepository.deleteByImageName(imageName);
                });

        // 새로운 이미지 업로드
        String uploadBackPath = user.getId() + "/" + "back" + "/";
        FileInfoDto backFileInfoDto = fileS3UploadService.uploadFile(uploadBackPath, file);

        // UserImage 객체 업데이트 및 새로운 배경화면 저장
        UserImage background = UserMapper.toUserImage(backFileInfoDto, user, "background");
        userImageRepository.save(background);
        user.changeBackgroundImage(background);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void changeProfileImage(Long id, MultipartFile file) {
        User user = this.findMemberById(id);

        Optional.ofNullable(user.getProfileImage())
                .map(UserImage::getImageName)
                .ifPresent(imageName -> {
                    fileS3UploadService.removeFile(imageName);
                    userImageRepository.deleteByImageName(imageName);
                });

        String uploadProfilePath = user.getId() + "/" + "profile" + "/";
        FileInfoDto profileFileInfoDto = fileS3UploadService.uploadFile(uploadProfilePath, file);

        UserImage profileImage = UserMapper.toUserImage(profileFileInfoDto, user, "profile");
        userImageRepository.save(profileImage);
        user.changeProfileImage(profileImage);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void updateProfile(Long id, UpdateProfileDto updateProfileDto) {
        User user = this.findMemberById(id);
        String newNickname = updateProfileDto.getNewNickname();
        String newDesc = updateProfileDto.getDescription();
        user.changeProfile(newNickname, newDesc);
    }

    @Override
    @Transactional
    public void updatePassword(Long id, UpdatePasswordDto updatePasswordDto) {
        User user = findMemberById(id);
        String newPassword = updatePasswordDto.getNewPassword();
        String passwordConfirm = updatePasswordDto.getNewPasswordConfirmation();
        // 비밀번호 확인과 일치하는지 확인
        if (!newPassword.equals(passwordConfirm)) {
            throw new PasswordNotConfirmException(PASSWORD_NOT_CONFIRM);
        }

        user.changePassword(newPassword);
    }

    @Override
    @Transactional
    public void deleteMember(Long id) {
        User user = findMemberById(id);
        user.markAsDeleted();
    }

    private String createCode() {
        Integer length = 6;
        try {
            Random random = SecureRandom.getInstanceStrong();
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < length; i++) {
                builder.append(random.nextInt(10));
            }
            return builder.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    private void checkDuplicatedEmail(String email) {
        userRepository.findByUsernameAndIsEnabledTrue(email)
                .ifPresent(u -> {
                    log.debug("회원 중복 이슈");
                    throw new EmailVerificationFailException(EMAIL_DUPLICATE);
                });
    }

    @Override
    @Transactional
    public void deleteBackgroundImage(Long id) {
        User user = this.findMemberById(id);

        Optional.ofNullable(user.getBackgroundImage())
                .map(UserImage::getImageName)
                .ifPresent(imageName -> {
                    fileS3UploadService.removeFile(imageName);  // 이미지 파일 삭제
                    user.changeBackgroundImage(null);  // User 객체에서 UserImage 참조 제거
                    userRepository.save(user);  // User 객체 업데이트
                    userImageRepository.deleteByImageName(imageName);  // UserImage 테이블의 데이터 삭제
                });
    }

    @Override
    @Transactional
    public void deleteProfileImage(Long id) {
        User user = this.findMemberById(id);

        Optional.ofNullable(user.getProfileImage())
                .map(UserImage::getImageName)
                .ifPresent(imageName -> {
                    fileS3UploadService.removeFile(imageName);  // 이미지 파일 삭제
                    user.changeProfileImage(null);  // User 객체에서 UserImage 참조 제거
                    userRepository.save(user);  // User 객체 업데이트
                    userImageRepository.deleteByImageName(imageName);  // UserImage 테이블의 데이터 삭제
                });
    }

    @Override
    public List<UserProfileDto> recommendUserList(Long userId){

        List<Long> followIdList = followRepository.findByFollowFromIdAndIsFollowedTrue(userId).stream().map(user -> user.getFollowTo().getId()).collect(Collectors.toList());

        List<User> list = new ArrayList<>();

        // 상위 20명만 리턴
        int page = 0; // 첫 페이지
        int size = 20; // 페이지 당 결과 수

        if(followIdList.isEmpty())
            list = userRepository.findAllAndNotMeOrderByFollowIncreaseCountDesc(userId, PageRequest.of(page, size));
        else
            list = userRepository.findAllAndNotMeNotFollowOrderByFollowIncreaseCountDesc(userId, followIdList, PageRequest.of(page, size));
        return list
                .stream().map(user->UserMapper.toUserProfileDto(user)).collect(Collectors.toList());
    }

    @Override
    @Transactional
    @Scheduled(cron = "* 59 23 * * *", zone = "Asia/Seoul")
    public void resetFollowIncreaseCnt(){
        List<User> userList = userRepository.findAll().stream().map(user-> {
            user.resetFollowIncreaseCount();
            return user;
        }).collect(Collectors.toList());
    }
}
