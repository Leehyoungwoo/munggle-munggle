import React, {useEffect, useState} from "react";
import { View, Text, TextInput, Modal,
  Image, TouchableOpacity, Dimensions,
  StyleSheet, KeyboardAvoidingView, Platform
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from "expo-auth-session";
import axios from "axios";

import imgLogo from "../../assets/icons/logo.png";
import iconGoogle from "../../assets/icons/googleLogin.png"; 
import iconKakao from "../../assets/icons/kakaoLogin.png"; 
import iconNaver from "../../assets/icons/naverLogin.png"; 

import SignUp from "../../components/modal/signUp";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

export default function LoginScreen (props) {
  const apiUrl = "http://i10a410.p.ssafy.io:8080";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    console.log(AsyncStorage.getItem("isLogin"));
  }, []);

  const handleLogin = () => {
    const payLoad = { username, password };
    console.log(payLoad);

    axios.post(
      `${apiUrl}/login`,
      payLoad,
      {headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      }})
      .then((res) => {
        AsyncStorage.setItem("accessToken", res.headers.get("access-token"))
        .then(AsyncStorage.setItem("accessToken", res.headers.get("refresh-token")))
        .then(
          axios.get(
            `${apiUrl}/users/mypage`,
            {headers: {
              "Authorization": res.headers.get("access-token")
            }}
          ).then((response) => {
            AsyncStorage.setItem("userId", `${response.data.id}`)
            .then(() =>
              props.logIn()
            );
          }).catch((err) => {
            console.log(err);
          })
        )
      })
      .catch((err) => console.log(err))
  };

  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const openSignUpModal = () => { setIsSignUpModalOpen(true) }; 
  const closeSignUpModal = () => { setIsSignUpModalOpen(false) }; 


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
      style={styles.keyboardAvoidingView}
    >
      <View style={styles.loginContainer}>
        <View style={styles.loginTopImageView}>
          <Image 
            style={styles.loginTopImage} 
            source={imgLogo}
          />
        </View>
        
        <View style={styles.textInputView}>
          <TextInput 
            placeholder="아이디"
            value={username}
            onChangeText={(e) => setUsername(e)}
            style={styles.usernameInput} 
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            placeholder="비밀번호"
            value={password}
            onChangeText={(e) => setPassword(e)}
            secureTextEntry={true} 
            style={styles.passwordInput}
            autoCapitalize="none"
            textContentType="password"
          />
        </View>
        
        <TouchableOpacity 
          style={styles.loginButtonView} 
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>
        
        <View style={styles.signInButtonView}>
          <TouchableOpacity 
            style={styles.signInButtonTouch}
            onPress={openSignUpModal}
          >
            <Text style={styles.signInButtonText}>회원가입</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.signInButtonTouch}
          >
            <Text style={styles.signInButtonText}>아이디/비밀번호 찾기</Text>
          </TouchableOpacity>
        </View>
        
        {/* <View style={styles.underLineView}>
          <View style={styles.underLineSideView} />
          <View style={styles.underLineCenterView}>
            <Text style={styles.underLineText}>또는</Text>
          </View>
          <View style={styles.underLineSideView} />
        </View>
        
        <View style={styles.snsLoginView}>
          <TouchableOpacity 
            style={styles.googleLoginView}
          >
            <Image 
              style={styles.googleLoginIcon}
              source={iconGoogle}
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.kakaoLoginView}
          >
            <Image 
              style={styles.kakaoLoginIcon}
              source={iconKakao}
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.naverLoginView}
          >
            <Image 
              style={styles.naverLoginIcon}
              source={iconNaver}
            />
          </TouchableOpacity>
        </View> */}

        <Modal
          animationType="slide"
          apiUrl={apiUrl}
          transparent={true}
          visible={isSignUpModalOpen}
          onRequestClose={() => closeSignUpModal()}>
          <SignUp closeSignUpModal={closeSignUpModal} />
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.8,
    justifyContent: "center",
    alignItems: "center",
  },
  loginContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    alignItems: "center",
  },

  loginTopImageView: {
    width: SCREEN_WIDTH * 0.6, 
    height: SCREEN_HEIGHT * 0.15, 
    marginTop: SCREEN_HEIGHT * 0.3,
    marginBottom: SCREEN_HEIGHT * 0.05,
  },
  loginTopImage: {
    width: SCREEN_WIDTH * 0.6, 
    height: SCREEN_HEIGHT * 0.15, 
  },
  
  textInputView: {
    width: SCREEN_WIDTH * 0.8, 
    height: SCREEN_HEIGHT * 0.2, 
    justifyContent: "center",
    alignItems: "center",
    marginVertical: SCREEN_HEIGHT * 0.02,
  },
  usernameInput: {
    width: SCREEN_WIDTH * 0.65, 
    height: SCREEN_HEIGHT * 0.07, 

    borderColor: "gray", 
    borderWidth: 1, 
    borderRadius: 20,
    paddingLeft: SCREEN_WIDTH * 0.05,
    fontSize: 17,
    marginVertical: SCREEN_HEIGHT * 0.01,
  },
  passwordInput: {
    width: SCREEN_WIDTH * 0.65, 
    height: SCREEN_HEIGHT * 0.07, 
    
    borderColor: "gray", 
    borderWidth: 1, 
    borderRadius: 20,
    paddingLeft: SCREEN_WIDTH * 0.05,
    fontSize: 17,
    marginVertical: SCREEN_HEIGHT * 0.01,
  },

  loginButtonView: {
    width: SCREEN_WIDTH * 0.23,
    height: SCREEN_HEIGHT * 0.06,
    backgroundColor: "rgb(253, 245, 169)", 
    borderRadius: 10, 
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SCREEN_HEIGHT * 0.02,
    borderWidth: 1,
    borderColor: "lightgrey",
  },
  loginButtonText: {
    color: "black", 
    fontSize: 18,
    fontWeight: "600",
  },
  
  signInButtonView: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.06,
    marginVertical: SCREEN_HEIGHT * 0.005,
  },
  signInButtonTouch: {
    width: SCREEN_WIDTH * 0.37,
    height: SCREEN_HEIGHT * 0.05,
    justifyContent: "center",
    alignItems: "center",
  },
  signInButtonText: {
    fontSize: 15,
  },

  underLineView: {
    flexDirection: "row", 
    alignItems: "center",
    width: SCREEN_WIDTH, 
    height: SCREEN_HEIGHT * 0.04,
  },
  underLineSideView: {
    width: SCREEN_WIDTH * 0.42,
    height: SCREEN_HEIGHT * 0.002, 
    backgroundColor: "black"
  },
  underLineCenterView: {
    width: SCREEN_WIDTH * 0.16,
    height: SCREEN_HEIGHT * 0.03, 
    justifyContent: "center",
    alignItems: "center",
  },
  underLineText: {
    fontSize: 17,
    fontWeight: "500",
  },

  snsLoginView: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.15,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  googleLoginView: {
    width: SCREEN_WIDTH * 0.2,
    height: SCREEN_HEIGHT * 0.1,
    justifyContent: "center",
    alignItems: "center",
  },
  googleLoginIcon: {
    width: SCREEN_WIDTH * 0.17,
    height: SCREEN_HEIGHT * 0.08,
    borderWidth: 0.5,
    borderColor: "gray",
    borderRadius: 100,
  },
  kakaoLoginView: {
    width: SCREEN_WIDTH * 0.2,
    height: SCREEN_HEIGHT * 0.1,
    justifyContent: "center",
    alignItems: "center",
  },
  kakaoLoginIcon: {
    width: SCREEN_WIDTH * 0.17,
    height: SCREEN_HEIGHT * 0.08,
    borderWidth: 0.5,
    borderColor: "gray",
    borderRadius: 100,
  },
  naverLoginView: {
    width: SCREEN_WIDTH * 0.2,
    height: SCREEN_HEIGHT * 0.1,
    justifyContent: "center",
    alignItems: "center",
  },
  naverLoginIcon: {
    width: SCREEN_WIDTH * 0.17,
    height: SCREEN_HEIGHT * 0.08,
    borderWidth: 0.5,
    borderColor: "gray",
    borderRadius: 100,
  },
});