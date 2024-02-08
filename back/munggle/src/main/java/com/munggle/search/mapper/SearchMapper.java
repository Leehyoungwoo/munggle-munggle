package com.munggle.search.mapper;

import com.munggle.domain.model.entity.*;
import com.munggle.search.dto.SearchPostListDto;
import com.munggle.search.dto.SearchTagDto;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class SearchMapper {

    public static SearchPostListDto toSearchPostListDto(Post post, Boolean isLiked, Boolean isMine, Boolean isFollowed) {
        List<String> imageUrls = post.getPostImageList().stream()
                .map(PostImage::getImageURL)
                .collect(Collectors.toList());

        return SearchPostListDto.builder()
                .postId(post.getId())
                .postTitle(post.getPostTitle())
                .imageURLs(imageUrls)
                .userId(post.getUser().getId())
                .isMine(isMine)
                .isFollowed(isFollowed)
                .profileImage(Optional.ofNullable(post.getUser().getProfileImage())
                        .map(UserImage::getImageURL).orElse(null))
                .nickname(post.getUser().getNickname())
                .likeCnt(post.getLikeCnt())
                .isLiked(isLiked)
                .createdAt(post.getCreatedAt())
                .build();
    }

    public static SearchTagDto toSearchTagDto(Tag tag) {
        return SearchTagDto.builder()
                .tagId(tag.getId())
                .tagNm(tag.getTagNm())
                .build();
    }
}
