package com.munggle.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

public record UpdatePasswordDto(
        @NotBlank @Size(min = 8, max = 15) String newPassword,
        @NotBlank @Size(min = 8, max = 15) String newPasswordConfirmation) {
}