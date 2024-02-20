//package com.munggle.user.controller;
//
//import static org.mockito.Mockito.*;
//import static org.mockito.ArgumentMatchers.*;
//import static org.mockito.Mockito.times;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.munggle.user.dto.UserCreateDto;
//import com.munggle.user.dto.UserMyPageDto;
//import com.munggle.user.repository.UserRepository;
//import com.munggle.user.service.UserService;
//import org.assertj.core.api.Assertions;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.mockito.Mockito;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.http.MediaType;
//import org.springframework.security.test.context.support.WithMockUser;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
//import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
//
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//@SpringBootTest
//@AutoConfigureMockMvc
//class UserControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockBean
//    private UserService userService;
//
//
//    @Test
//    @WithMockUser
//    @DisplayName("회원정보조회 테스트")
//    void getMyPage() throws Exception {
//        Long userId = 1L;
//
//        UserMyPageDto userMyPageDto = UserMyPageDto.builder()
//                .Id(userId)
//                .username("testUsername")
//                .nickname("테스트계정")
//                .build();
//
//        mockMvc.perform(MockMvcRequestBuilders.get("/users/mypage"))
//                .andExpect(status().isOk())
//                .andExpect(MockMvcResultMatchers.jsonPath("$.userId").value(userId))
//                .andExpect(MockMvcResultMatchers.jsonPath("$.username").value("testUsername"))
//                .andExpect(MockMvcResultMatchers.jsonPath("$.nickname").value("테스트계정"));
//
//    }
//
//    @Test
//    void getMemberInfo() {
//    }
//
//    @Test
//    @WithMockUser
//    @DisplayName("중복 닉네임 확인 테스트")
//    void checkDuplicatedNickname() {
//        String nickname = "테스트닉네임";
//
//        Assertions.assertThat()
//    }
//
//    @Test
//    void sendVerificationMessage() {
//    }
//
//    @Test
//    void verifyByEmail() {
//    }
//
//    @Test
//    @WithMockUser
//    @DisplayName("회원가입 테스트")
//    void joinMember() throws Exception {
//        UserCreateDto userCreateDto = new UserCreateDto("test@example.com", "password123", "nickname");
//
//        mockMvc.perform(MockMvcRequestBuilders.post("/users")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(new ObjectMapper().writeValueAsString(userCreateDto)))
//                .andExpect(status().isOk());
//    }
//
//    @Test
//    void updateBackgroundImage() {
//    }
//
//    @Test
//    void updateProfileImage() {
//    }
//
//    @Test
//    void updateProfile() {
//    }
//
//    @Test
//    void updatePassword() {
//    }
//
//    @Test
//    void deleteMember() {
//    }
//
//    @Test
//    void deleteBackgroundImage() {
//    }
//
//    @Test
//    void deleteProfileImage() {
//    }
//
//    @Test
//    void recommendUserList() {
//    }
//}