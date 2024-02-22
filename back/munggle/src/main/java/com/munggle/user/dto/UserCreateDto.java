package com.munggle.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserCreateDto(
        @Size(max = 50)
        @NotBlank
        @JsonProperty("email")
        String username,

        @Size(min = 8, max = 15)
        @NotBlank
        String password,

        @Size(min = 2, max = 10)
        @NotNull
        String nickname
) {}
