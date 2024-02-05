package com.munggle.comment.service;

import com.munggle.comment.dto.CommentCreateDto;
import com.munggle.comment.dto.CommentDetailDto;
import com.munggle.comment.dto.CommentUpdateDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CommentService {

    // 댓글 작성
    void insertComment(CommentCreateDto commentCreateDto);

    // 댓글 수정
    void updateComment(Long userId, CommentUpdateDto commentUpdateDto);

    // 게시글 댓글 목록
    List<CommentDetailDto> getCommentList(Long postId);

    // 댓글 상세
    CommentDetailDto getComment(Long commentId);

    // 댓글 삭제
    void deleteComment(Long userId, Long commentId);

    // 댓글 좋아요
}