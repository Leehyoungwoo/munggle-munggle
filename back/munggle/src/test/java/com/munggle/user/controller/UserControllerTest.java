package com.munggle.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.munggle.user.dto.UserCreateDto;
import com.munggle.user.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {

    }
    @Test
    @WithMockUser
    @DisplayName("회원정보조회 테스트")
    void getMyPage() {
    }

    @Test
    void getMemberInfo() throws Exception {
    }

    @Test
    @WithMockUser
    @DisplayName("중복 닉네임 확인 테스트")
    void checkDuplicatedNickname() throws Exception {
        String nickname = "테스트닉네임";

        mockMvc.perform(MockMvcRequestBuilders.get("/users/nickname")
                        .param("nickname", nickname))
                .andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    void sendVerificationMessage() {
    }

    @Test
    void verifyByEmail() {
    }

    @Test
    @WithMockUser
    @DisplayName("회원가입 테스트")
    void joinMember() throws Exception {
        UserCreateDto userCreateDto = new UserCreateDto("test@example.com", "password123", "nickname");

        mockMvc.perform(MockMvcRequestBuilders.post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(new ObjectMapper().writeValueAsString(userCreateDto)))
                .andExpect(status().isOk());
    }

    @Test
    void updateBackgroundImage() {
    }

    @Test
    void updateProfileImage() {
    }

    @Test
    void updateProfile() {
    }

    @Test
    void updatePassword() {
    }

    @Test
    void deleteMember() {
    }

    @Test
    void deleteBackgroundImage() {
    }

    @Test
    void deleteProfileImage() {
    }

    @Test
    void recommendUserList() {
    }
}