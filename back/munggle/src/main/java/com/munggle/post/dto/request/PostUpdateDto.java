package com.munggle.post.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostUpdateDto {

    private Long postId;

    @Size(max = 100)
    @NotBlank
    private String postTitle;

    @Size(max = 500)
    private String postContent;

    // 해시태그
    @Builder.Default
    private List<String> hashtags = new ArrayList<>();

    private Boolean isPrivate;
}
