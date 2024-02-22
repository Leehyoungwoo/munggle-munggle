package com.munggle.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

public record UpdateProfileDto(
        @NotBlank @Size(min = 2, max = 10) String newNickname,
        @Size(max = 100) String description) {
}
