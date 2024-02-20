package com.munggle.user.repository;

import com.munggle.domain.model.entity.Post;
import com.munggle.domain.model.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByIdAndIsEnabledTrue(Long id);

    Optional<User> findByUsernameAndIsEnabledTrue(String username);

    List<User> findByNicknameContainingAndIsEnabledTrue(String keyword);

    Optional<User> findByNicknameAndIsEnabledTrue(String nickname);

    @Query("select u from User u where u.isEnabled = true and u.id <> :userId order by u.followIncreaseCount DESC")
    List<User> findAllAndNotMeOrderByFollowIncreaseCountDesc(@Param("userId") Long userId, Pageable pageable);

    @Query("select u from User u where u.isEnabled = true and u.id <> :userId and u.id not in :followList order by u.followIncreaseCount DESC")
    List<User> findAllAndNotMeNotFollowOrderByFollowIncreaseCountDesc(@Param("userId") Long userId, @Param("followList") List<Long> followList, Pageable pageable);
    
}