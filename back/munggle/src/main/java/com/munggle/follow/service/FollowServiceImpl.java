package com.munggle.follow.service;

import com.munggle.alarm.service.AlarmService;
import com.munggle.domain.exception.FollowNotFoundException;
import com.munggle.domain.exception.SelfInteractionException;
import com.munggle.domain.exception.UserNotFoundException;
import com.munggle.domain.model.entity.Follow;
import com.munggle.domain.model.entity.FollowId;
import com.munggle.domain.model.entity.User;
import com.munggle.follow.mapper.FollowMapper;
import com.munggle.follow.repository.FollowRepository;
import com.munggle.user.dto.UserListDto;
import com.munggle.user.mapper.UserMapper;
import com.munggle.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static com.munggle.domain.exception.ExceptionMessage.*;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class FollowServiceImpl implements FollowService {

    private final UserRepository userRepository;
    private final FollowRepository followRepository;
    private final AlarmService alarmService;

    @Override
    public Page<UserListDto> getFollowerList(Long userId, Pageable pageable) {
        Page<User> userListDtoPage = followRepository.findByFollowToIdAndIsFollowedTrue(userId, pageable)
                .map(Follow::getFollowFrom);
        return UserMapper.convertToUserListDtoPage(userListDtoPage, userId);
    }

    @Override
    public Page<UserListDto> getFollowingList(Long userId, Pageable pageable) {
        Page<User> userPage = followRepository.findByFollowFromIdAndIsFollowedTrue(userId, pageable)
                .map(Follow::getFollowTo);

        return this.convertToUserListDtoPage(userPage, userId);
    }

    @Override
    public Integer getFollowerCount(Long userId) {
        return followRepository.countByFollowToIdAndIsFollowedTrue(userId);
    }

    @Override
    public Integer getFollowingCount(Long userId) {
        return followRepository.countByFollowFromIdAndIsFollowedTrue(userId);
    }

    @Override
    public boolean checkIsFollowed(Long myId, Long targetId) {
        return followRepository.existsByFollowFromIdAndFollowToIdAndIsFollowedTrue(myId, targetId);
    }

    @Override
    @Transactional
    public void followUser(Long fromUserId, Long targetUserId) {
        // 자기 자신을 팔로우하는지 검증
        Optional.of(fromUserId)
                .filter(id -> !id.equals(targetUserId))
                .orElseThrow(() -> new SelfInteractionException(SELF_FOLLOW));
        // 받아온 userId 검증
        User fromUser = userRepository.findByIdAndIsEnabledTrue(fromUserId)
                .orElseThrow(() -> new UserNotFoundException(USER_NOT_FOUND));
        User targetUser = userRepository.findByIdAndIsEnabledTrue(targetUserId)
                .orElseThrow(() -> new UserNotFoundException(USER_NOT_FOUND));
        // 팔로우 과정
        targetUser.plusFollowIncreaseCount();
        FollowId followId = FollowMapper.toFollowId(fromUserId, targetUserId);
        Follow follow = followRepository.findById(followId)
                .orElseGet(() -> followRepository.save(
                        Follow.builder()
                                .followId(followId)
                                .followFrom(fromUser)
                                .followTo(targetUser)
                                .isFollowed(true)
                                .build()
                ));

        // 팔로우 알림 생성
        alarmService.insertAlarm("FOLLOW", fromUser, targetUser, fromUserId);
        follow.follow();
    }

    @Override
    @Transactional
    public void unfollow(Long fromUserId, Long targetUserId) {
        User targetUser = userRepository.findByIdAndIsEnabledTrue(targetUserId)
                .orElseThrow(() -> new UserNotFoundException(USER_NOT_FOUND));
        targetUser.minusFollowIncreaseCount();

        FollowId followId = FollowMapper.toFollowId(fromUserId, targetUserId);
        Follow follow = followRepository.findById(followId)
                .orElseThrow(() -> new FollowNotFoundException(FOLLOW_NOT_FOUND));

        follow.unfollow();
    }

    @Override
    @Transactional
    public void deleteFollower(Long myId, Long followerId) {
        FollowId followId = FollowMapper.toFollowId(followerId, myId);
        Follow follow = followRepository.findById(followId)
                .orElseThrow(() -> new FollowNotFoundException(FOLLOW_NOT_FOUND));

        follow.unfollow();
    }

    public Page<UserListDto> convertToUserListDtoPage(Page<User> userPage, Long myId) {
        return userPage.map(user -> {
            UserListDto userListDto = UserListDto.toUserListDto(user);
            return userListDto;
        });
    }

}
