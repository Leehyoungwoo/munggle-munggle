package com.munggle.user.repository;

import com.munggle.domain.model.entity.User;
import com.munggle.domain.model.entity.converter.PasswordConverter;
import com.munggle.domain.model.entity.type.Role;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({PasswordConverter.class, BCryptPasswordEncoder.class})
class UserRepositoryTest {

    @Autowired
    UserRepository userRepository;

    @Autowired
    EntityManager em;

    @Autowired
    PasswordEncoder passwordEncoder;

    private static User user;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .username("test@test.com")
                .password(passwordEncoder.encode("11111111"))
                .nickname("테스트계정")
                .role(Role.MEMBER)
                .isEnabled(true)
                .build();
    }

    @Test
    @DisplayName("pk로 회원 찾기")
    @Transactional
    void findByIdAndIsEnabledTrue() {
        // given
        userRepository.save(user);
        em.flush();
        em.clear();
        // when
        User getUser = userRepository.findByIdAndIsEnabledTrue(user.getId())
                .get();
        // then
        assertThat(getUser.getId()).isEqualTo(user.getId());
    }

    @Test
    @DisplayName("유저네임으로 회원 찾기")
    @Transactional
    void findByUsernameAndIsEnabledTrue() {
        // given
        userRepository.save(user);
        em.flush();
        em.clear();
        // when
        User getUser = userRepository.findByUsernameAndIsEnabledTrue("test@test.com")
                .get();
        // then
        assertThat(getUser.getId()).isEqualTo(user.getId());
    }

    @Test
    @DisplayName("키워드를 포함하는 닉네임을 가진 회원들 찾기")
    @Transactional
    void findByNicknameContainingAndIsEnabledTrue() {
        // given
        userRepository.save(user);
        em.flush();
        em.clear();

        // when
        List<User> getUser = userRepository.findByNicknameContainingAndIsEnabledTrue("스트");

        // then
        assertThat(getUser.contains(user));
    }

    @Test
    @DisplayName("닉네임으로 회원 찾기")
    @Transactional
    void findByNicknameAndIsEnabledTrue() {
        // given
        userRepository.save(user);
        em.flush();
        em.clear();

        // when
        User getUser = userRepository.findByNicknameAndIsEnabledTrue("테스트계정")
                .get();

        //then
        assertThat(getUser.getId()).isEqualTo(user.getId());
    }

    @ParameterizedTest
    @ValueSource(longs = {1L})
    @DisplayName("팔로워가 많은 순으로 회원 가져오기")
    @Transactional
    void findAllAndNotMeOrderByFollowIncreaseCountDesc(Long userId) {
        // given
        User user1 = createUser("user1@test.com", "11111111", "user1", 3);  // 예시 사용자 생성
        User user2 = createUser("user2@test.com", "11111111", "user2", 5);  // 예시 사용자 생성
        User user3 = createUser("user3@test.com", "11111111", "user3", 7);  // 예시 사용자 생성
        User user4 = createUser("user4@test.com", "11111111", "user4", 2);  // 예시 사용자 생성

        userRepository.save(user1);
        userRepository.save(user2);
        userRepository.save(user3);
        userRepository.save(user4);

        // when
        List<User> result = userRepository.findAllAndNotMeOrderByFollowIncreaseCountDesc(userId, Pageable.ofSize(4));

        // then
        List<User> expected = List.of(user3, user2, user1, user4);
        assertThat(result).isEqualTo(expected);
    }
    @ParameterizedTest
    @ValueSource(longs = {1L})
    @DisplayName("팔로우가 아닌 타 회원 팔로우 수로 조회")
    @Transactional
    void findAllAndNotMeNotFollowOrderByFollowIncreaseCountDesc(Long userId) {
        // given
        User user1 = createUser("user1@test.com", "11111111", "user1", 3);  // 예시 사용자 생성
        User user2 = createUser("user2@test.com", "11111111", "user2", 5);  // 예시 사용자 생성
        User user3 = createUser("user3@test.com", "11111111", "user3", 7);  // 예시 사용자 생성
        User user4 = createUser("user4@test.com", "11111111", "user4", 2);  // 예시 사용자 생성

        userRepository.save(user1);
        userRepository.save(user2);
        userRepository.save(user3);
        userRepository.save(user4);

        // when
        List<Long> followList = Arrays.asList(2L, 3L);
        List<User> result = userRepository.findAllAndNotMeNotFollowOrderByFollowIncreaseCountDesc(userId, followList, Pageable.ofSize(3));

        // then
        assertThat(result).isNotNull();
        assertThat(result.contains(user4));
    }

    // 테스트용 사용자 객체 생성 메서드
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