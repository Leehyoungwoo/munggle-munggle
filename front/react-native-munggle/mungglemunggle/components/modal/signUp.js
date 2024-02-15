import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet,
  ScrollView, TouchableOpacity, Button,
  Dimensions, Alert,
  TextInput, 
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import iconClose from "../../assets/icons/close1.png";

import axios, { Axios } from "axios";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

export default function SignUp (props) {
  const apiUrl = "http://i10a410.p.ssafy.io:8080";

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const [isCheckEmail, setIsCheckEmail] = useState(false);
  const [checkEmailVal, setCheckEmailVal] = useState('');
  const [isConfirmEmail, setIsConfirmEmail] = useState(false);
  
  const [isConfirmNickname, setIsConfirmNickname] = useState(false);
  
  useEffect(()=> {
  }, []);

  const signUp = () => {
    if (isConfirmEmail && isConfirmNickname && (password1 === password2)) {
      const payLoad = { email, password: password1, nickname };
      console.log(payLoad);
      axios.post(
        `${apiUrl}/users`,
        payLoad,
        {headers: {
          "Content-Type": "application/json",
        }}
      ).then((res) => {
        console.log(res.status);
        props.closeSignUpModal()
      }).catch((err) => {
        console.log(err);
      })
    } else {
      console.log("회원가입 실패")
    }
  };

  const checkEmail = () => {
    console.log(email);
    axios.post(
      `${apiUrl}/users/emails/verification-requests?email=${email}`,
      {headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      }}
    ).then((res) => {
      console.log(res.status);
      setIsCheckEmail(true);
    }).catch((err) => {
      console.log(err);
    })
  };
  
  const confirmEmail = () => {
    console.log(email);
    console.log(checkEmailVal);
    
    axios.get(
      `${apiUrl}/users/emails/verifications?email=${email}&code=${checkEmailVal}`,
      {headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      }}
      ).then((res) => {
        console.log(res.status);
        setIsCheckEmail(false);
        setIsConfirmEmail(true);
      }).catch((err) => {
        console.log(err);
      })
    };
    
  const checkNickname = () => {
    console.log(nickname);
    axios.get(
      `${apiUrl}/users/nickname?nickname=${nickname}`,
      // {headers: {
      //   "Content-Type": "application/x-www-form-urlencoded",
      // }}
    ).then((res) => {
      setIsConfirmNickname(true);
      console.log(res.status);
    }).catch((err) => {
      console.log(err);
    })
  };

  const inputEmailView = () => {
    if (isCheckEmail) {
      return (
        <View style={{...styles.signUpTextInputView, position:"relative"}}>
          <TextInput 
            placeholder="이메일 주소"
            style={styles.signUpTextInput}
            keyboardType="email-address"
            value={email}
          />
          <View style={styles.checkEmailView}>
            <TextInput 
              value={checkEmailVal}
              placeholder="인증번호"
              onChangeText={(e) => setCheckEmailVal(e)}
              style={styles.checkEmailInput}
            />

            <TouchableOpacity
              style={styles.checkEmailInView}
              onPress={confirmEmail}
            >
            <Text style={styles.checkEmailText}>확인</Text>
          </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View style={{...styles.signUpTextInputView, position:"relative"}}>
          <TextInput 
            placeholder="이메일 주소"
            style={styles.signUpTextInput}
            keyboardType="email-address"
            value={email}
            onChangeText={(e) => setEmail(e)}
          />
          <TouchableOpacity
            style={{...styles.checkView, backgroundColor: isConfirmEmail ? "rgb(13, 110, 253)" : "white"}}
            onPress={checkEmail}
          >
            <Text style={{...styles.checkEmailText, color: isCheckEmail ? "white" : "black"}}>인증</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  return (
    <View style={styles.signUpModalBackGround}>
      <View style={styles.signUpModalContainer}>
        <TouchableOpacity
          style={styles.closeView}
          onPress={props.closeSignUpModal}
          >
          <Image 
            style={styles.closeImage}
            source={iconClose}
          />
        </TouchableOpacity>

        <View style={styles.signUpTopView}>
          <Text style={styles.signUpTopViewTopText}>멍글멍글</Text>
          <Text style={styles.signUpTopViewBottomText}>반려견의 일상을 기록하고</Text>
          <Text style={styles.signUpTopViewBottomText}>친구들과 공유해보세요!</Text>
        </View>

        <View style={styles.signUpMiddleView}>
          {inputEmailView()}

          <View style={{...styles.signUpTextInputView, position:"relative"}}>
            <TextInput 
              placeholder="닉네임"
              style={styles.signUpTextInput}
              keyboardType="default"
              value={nickname}
              onChangeText={(e) => setNickname(e)}
            />
            <TouchableOpacity
              style={{...styles.checkView, backgroundColor: isConfirmNickname ? "rgb(13, 110, 253)" : "white"}}
              onPress={checkNickname}
            >
              <Text style={{...styles.checkNicknameText, color: isConfirmNickname ? "white" : "black"}}>중복 확인</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.signUpTextInputView}>
            <TextInput 
              placeholder="비밀번호"
              style={styles.signUpTextInput}
              value={password1}
              secureTextEntry={true} 
              onChangeText={(e) => setPassword1(e)}
            />
          </View>
          <View style={styles.signUpTextInputView}>
            <TextInput 
              placeholder="비밀번호 확인"
              style={styles.signUpTextInput}
              secureTextEntry={true}
              value={password2}
              onChangeText={(e) => setPassword2(e)}
            />
          </View>
        </View>

        <View style={styles.signUpBottomView}>
          <TouchableOpacity
            style={styles.signUpSubmitView}
            onPress={signUp}
          >
            <Text style={styles.signUpSubmitText}>가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  signUpModalBackGround: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  signUpModalContainer: {
    alignItems: "center",
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.94,
    backgroundColor: "white",
    position: "relative",
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 20,
    marginBottom: SCREEN_HEIGHT * 0.035,
  },

  closeView: {
    width: SCREEN_WIDTH * 0.1,
    height: SCREEN_WIDTH * 0.1,
    position: "absolute",
    top: 5,
    right: 5,
  },
  closeImage: {
    width: SCREEN_WIDTH * 0.1,
    height: SCREEN_WIDTH * 0.1,
  },

  signUpTopView: {
    marginTop: SCREEN_HEIGHT * 0.06,
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.31,
    justifyContent: "center",
    alignItems: "center",
  },
  signUpTopViewTopText: {
    fontSize: 50,
    fontWeight: "600",
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  signUpTopViewBottomText: {
    fontSize: 30,
    fontWeight: "600",
    marginVertical: SCREEN_HEIGHT * 0.01,
    color: "gray",
  },

  signUpMiddleView: {
    marginTop: SCREEN_HEIGHT * 0.01,  
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.36,
    alignItems: "center",
    justifyContent: "center",
  },
  signUpTextInputView: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_HEIGHT * 0.075,
    marginBottom: SCREEN_HEIGHT * 0.01,
    justifyContent: "center",
    alignItems: "center",
  },
  signUpTextInput: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_HEIGHT * 0.07,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 20,
    fontSize: 17,
    paddingLeft: SCREEN_WIDTH * 0.03,
  },
  checkView: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.16,
    height: SCREEN_HEIGHT * 0.06,
    right: SCREEN_WIDTH * 0.015,
    top: SCREEN_HEIGHT * 0.008,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  checkEmailView: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.4,
    height: SCREEN_HEIGHT * 0.06,
    right: SCREEN_WIDTH * 0.015,
    top: SCREEN_HEIGHT * 0.008,
    
    backgroundColor: "white",
    zIndex: 20,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  checkEmailInput: {
    width: SCREEN_WIDTH * 0.23,
    height: SCREEN_HEIGHT * 0.055,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 15,
    paddingLeft: SCREEN_WIDTH * 0.03,
    fontSize: 18,
    fontWeight: "600",
  },
  checkEmailInView: {
    width: SCREEN_WIDTH * 0.16,
    height: SCREEN_HEIGHT * 0.06,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  checkEmailText: {
    fontSize: 17,
    color: "black",
  },
  checkNicknameText: {
    fontSize: 14,
    color: "black",
  },


  signUpBottomView: {
    marginBottom: SCREEN_HEIGHT * 0.01,
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.08,
    alignItems: "center",
    justifyContent: "center",
  },
  signUpSubmitView: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_HEIGHT * 0.06,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgb(253, 245, 169)",
    borderRadius: 100,
    backgroundColor: "rgb(253, 245, 169)",
  },
  signUpSubmitText: {
    fontSize: 20,
    fontWeight: "600",
  },
});