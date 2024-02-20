package com.munggle.user.service;

import com.munggle.domain.exception.DuplicateNickNameException;
import com.munggle.domain.model.entity.User;
import com.munggle.domain.model.entity.type.Role;
import com.munggle.follow.repository.FollowRepository;
import com.munggle.follow.service.FollowServiceImpl;
import com.munggle.user.dto.*;
import com.munggle.user.mapper.UserMapper;
import com.munggle.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;

import java.util.*;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @InjectMocks
    private UserServiceImpl userService;

    @Mock
    private DefaultOAuth2UserService defaultOAuth2UserService;

    @Mock
    private FollowServiceImpl followService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private FollowRepository followRepository;

    private static User user;

    @BeforeEach
    void setUp() {
        user = createUser("test@test.com",
                "testtest",
                "테스트계정",
                1);
    }

    @Test
    void findMemberById() {
        // given
        Long id = 1L;

        // when
        when(userRepository.findByIdAndIsEnabledTrue(id)).thenReturn(Optional.of(user));
        User foundUser = userService.findMemberById(id);

        // then
        assertEquals(user, foundUser);
    }

    @Test
    void getNicknameById() {
        // given
        Long id = 1L;

        // when
        when(userRepository.findByIdAndIsEnabledTrue(id)).thenReturn(Optional.of(user));
        String nickname = userService.getNicknameById(id);

        //then0
        assertEquals(user.getNickname(), nickname);
    }

    @Test
    void loadUserByUsername() {
        // given
        String username = "test@test.com";

        //when
        when(userRepository.findByUsernameAndIsEnabledTrue(username)).thenReturn(Optional.of(user));
        User userDetail = (User) userService.loadUserByUsername(username);

        //then
        assertEquals(username, userDetail.getUsername());
        Mockito.verify(userRepository, times(1)).findByUsernameAndIsEnabledTrue(username);
    }

    @Test
    void loadUser() {

    }

    @Test
    void getUserMypage() {
        // given
        Long userId = 1L;
        Integer followerCount = 10;
        Integer followingCount = 20;

        // when
        Mockito.lenient().when(userRepository.findByIdAndIsEnabledTrue(userId)).thenReturn(Optional.of(user));
        Mockito.lenient().when(followRepository.countByFollowToIdAndIsFollowedTrue(userId)).thenReturn(followerCount);
        Mockito.lenient().when(followRepository.countByFollowFromIdAndIsFollowedTrue(userId)).thenReturn(followingCount);
        UserMyPageDto result = userService.getUserMypage(userId);
        UserMyPageDto expected = UserMapper.toUserMyPageDto(user, followerCount, followingCount);

        // then
        assertEquals(expected.getId(), result.getId());
    }

    @Test
    void getUserProfile() {
        Long userId = 1L;

        when(userRepository.findByIdAndIsEnabledTrue(userId)).thenReturn(Optional.of(user));
        UserProfileDto result = userService.getUserProfile(userId);
        UserProfileDto expected = UserMapper.toUserProfileDto(user);

        assertEquals(expected.getId(), result.getId());
    }

    @Test
    void getSearchPage() {
        String keyword = "테스트";
        List<User> userlist = new ArrayList<>();
        User user1 = this.createUser("test1@test.com", "11111111", "테스트닉1", 1);
        User user2 = this.createUser("test2@test.com", "11111111", "테스트닉2", 1);
        User user3 = this.createUser("test3@test.com", "11111111", "테스트닉3", 1);

        userlist.add(user1);
        userlist.add(user2);
        userlist.add(user3);

        when(userRepository.findByNicknameContainingAndIsEnabledTrue(keyword)).thenReturn(userlist);

        List<UserListDto> expectedList = new ArrayList<>();
        expectedList.add(this.userListDto("테스트닉1"));
        expectedList.add(this.userListDto("테스트닉2"));
        expectedList.add(this.userListDto("테스트닉3"));
        List<UserListDto> actualList = userService.getSearchPage(keyword);

        assertEquals(expectedList.size(), actualList.size());
        IntStream.range(0, expectedList.size())
                .forEach(i -> assertEquals(expectedList.get(i).getNickname(),
                        actualList.get(i).getNickname()));
        Mockito.verify(userRepository, times(1)).findByNicknameContainingAndIsEnabledTrue(keyword);
    }

    private UserListDto userListDto(String nickname) {
        return UserListDto.builder()
                .nickname(nickname)
                .build();
    }

    @Test
    void checkDuplicateNickname() {
        String nickname = "테스트닉네임";
        when(userRepository.findByNicknameAndIsEnabledTrue(nickname)).thenReturn(Optional.of(user));

        // when & then
        DuplicateNickNameException exception = assertThrows(DuplicateNickNameException.class, () -> {
            userService.checkDuplicateNickname(nickname);
        });

        assertEquals(DuplicateNickNameException.class, exception.getClass());
    }

    @Test
    void verify() {
    }

    @Test
    void sendCodeToEmail() {
    }

    @Test
    void joinMember() {
        UserCreateDto userCreateDto = new UserCreateDto("test@test.com",
                "testpassword",
                "테스트닉네임");

        when(userRepository.save(any(User.class))).thenReturn(user);

        // when
        userService.joinMember(userCreateDto);

        // then
        Mockito.verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void changeBackgroundImage() {
    }

    @Test
    void changeProfileImage() {
    }

    @Test
    void updateProfile() {
        // given
        Long userId = 1L;
        String newNickname = "새닉네임";
        String newDesc = "소개글";
        UpdateProfileDto updateProfileDto = new UpdateProfileDto(newNickname, newDesc);

        // when
        when(userRepository.findByIdAndIsEnabledTrue(userId)).thenReturn(Optional.of(user));
        userService.updateProfile(userId, updateProfileDto);

        // then
        assertEquals(newNickname, user.getNickname());
        assertEquals(newDesc, user.getDescription());
    }

    @Test
    void updatePassword() {
        // given
        Long userId = 1L;
        String newPassword = "newPassword123";
        String passwordConfirm = "newPassword123";
        UpdatePasswordDto updatePasswordDto = new UpdatePasswordDto(newPassword, passwordConfirm);
        User user = new User();
        when(userRepository.findByIdAndIsEnabledTrue(userId)).thenReturn(Optional.of(user));

        // when
        userService.updatePassword(userId, updatePasswordDto);

        // then
        assertEquals(newPassword, user.getPassword());
    }

    @Test
    void deleteMember() {
        // given
        Long userId = 1L;
        User user = new User();
        when(userRepository.findByIdAndIsEnabledTrue(userId)).thenReturn(Optional.of(user));

        // when
        userService.deleteMember(userId);

        // then
        assertFalse(user.isEnabled());
    }

    @Test
    void deleteBackgroundImage() {
    }

    @Test
    void deleteProfileImage() {
    }

    private User createUser(String username,
                            String password,
                            String nickname,
                            int followIncreaseCount) {

        return User.builder()
                .username(username)
                .password(password)
                .nickname(nickname)
                .role(Role.MEMBER)
                .isEnabled(true)
                .followIncreaseCount(followIncreaseCount)
                .build();
    }
}