import React, { useRef, useEffect, useState} from "react";
import { View, Text, Image, ScrollView, Dimensions, KeyboardAvoidingView, TextInput, TouchableOpacity, Platform, StyleSheet } from "react-native";
import send from "../../assets/icons/send.png"
import close from "../../assets/icons/close1.png"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import axios, { Axios } from "axios";


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

export default function DirectMessageRoom(props) {

  const [myPK, setMyPK] = useState();
  const accessTokenRef = useRef(null);

  const getToken = async () => {
    await AsyncStorage.getItem("accessToken")
    .then((accessToken) => {
      accessTokenRef.current = accessToken;
      console.log(accessTokenRef.current);
    });
  }

  const getId = async () => {
    await AsyncStorage.getItem("userId")
    .then((userId) => {
      setMyPK(userId);
      console.log(userId)
    });
  }
  const userNickname = props.userNickname;//남
  const otherUserId = props.otherUserId;
  const roomId = props.roomId;
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState();
  const scrollViewRef = useRef();
  const ws = useRef(null);

  useEffect(() => {
      getId();
      if(props.roomId!=null){
      const fetchChatRoomData = async () => {
        try {
          // GET 요청 보내기
          const response = await axios.get(`http://i10a410.p.ssafy.io:8080/message/${props.roomId}`);
          // console.log(response.data);
          setMessages(response.data);
        } catch (error) {
          console.error("Error fetching chat room data:", error);
        }
      };
      fetchChatRoomData();
    }

      getToken()
        .then(() => {
          console.log("token");
          console.log(accessTokenRef.current);
          ws.current = new WebSocket("ws://i10a410.p.ssafy.io:8080/dm",[],{
            headers: {
              Authorization: accessTokenRef.current,
            },
          });

          console.log(ws.current)
          ws.current.onopen = () => {
              // connection opened
              console.log("connected")
              // send a message
          };

        ws.current.onmessage = (e) => {
          console.log("메세지 받음");
          const newMessage = {
            "createAt": new Date().toISOString(),
            "message": JSON.parse(e.data).message,
            "receiverNickname": null,
            "senderNickname": userNickname,
          }
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        };})
        .catch((error) => {
          // Handle error during the getToken process
          console.error("Error during the WebSocket setup:", error);
        });

      return () => {
        console.log("end");
        ws.current.close();
      };
  }, []);

  useEffect(()=>{
    console.log("scroll");
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  }, [messages]);

  const sendMessage = () => {
    if (ws.current && inputMessage !== "") {
      const message = {
        "senderId": parseInt(myPK),
        "receiver": otherUserId,
        "message": inputMessage
    }
      const jsonString = JSON.stringify(message);
      ws.current.send(jsonString);

      console.log("전송");
      console.log(JSON.stringify(message));

      const newMessage = {
        "createAt": new Date().toISOString(),
        "message": inputMessage,
        "receiverNickname": userNickname,
        "senderNickname": "aa",
      }
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputMessage();
    }
  };

  const adjustTime = ((createAt)=>{
    const date = new Date(createAt);
    date.setHours(date.getHours() + 9);
    return`${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  })

  const shouldDisplayDate = (index) => {
    if (index === 0) {
      return true; // 대화의 첫 번째 메시지는 무조건 날짜를 표시
    }

    const currentDate = new Date(messages[index].createAt).toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" });
    const prevDate = new Date(messages[index - 1].createAt).toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" });

    return currentDate !== prevDate;
  };

  // 날짜를 한국 시간으로 포맷팅하는 함수
  const getFormattedDate = (createAt) => {
    const date = new Date(createAt);
    date.setHours(date.getHours() + 9);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("ko-KR", options);
  };

  return (
    <View style={styles.dmContainer}>
      <View style={styles.dmView}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={60}
          style={{height:SCREEN_HEIGHT*0.76}}
        >
          <View style={styles.dmViewTopView}>
            <View style={{ width: 24, height: 24 }}/>
            <Text style={styles.topViewText}>{userNickname}</Text>
            <TouchableOpacity onPress={props.closeChatModal}>
              <Image source={close} style={{ width: 24, height: 24 }} />
            </TouchableOpacity>
          </View >
          <ScrollView ref={scrollViewRef}>
            {messages && messages.map((msg, index) => (
            <View key={index}>
              {(shouldDisplayDate(index))&& (
              <View style={styles.centerDayContainer}>
                <View style={styles.centerDay}>
                  <Text>{getFormattedDate(msg.createAt)}</Text>
                </View>
              </View>
              )}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: msg.receiverNickname == userNickname ? "flex-end" : "flex-start",
                  margin: 5,
                }}
              >
                <View
                  style={{
                    marginRight: 10,
                    alignSelf: "flex-end",
                  }}
                >
                  {(index === messages.length - 1 || messages[index + 1].senderNickname !== messages[index].senderNickname || messages[index + 1].createAt.slice(11,16) !== msg.createAt.slice(11,16)) && msg.receiverNickname == userNickname ? <Text>{adjustTime(msg.createAt)}</Text> : ""}
                </View>
                <View
                  style={{
                    maxWidth: "70%",
                    backgroundColor: msg.receiverNickname == userNickname ? "#2ecc71" : "#3498db",
                    padding: 10,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ color: "white" }}>{msg.message}</Text>
                </View>
                <View
                  style={{
                    marginLeft: 10,
                    alignSelf: "flex-end",
                  }}
                >
                  {(index === messages.length - 1 || messages[index + 1].senderNickname !== messages[index].senderNickname || messages[index + 1].createAt.slice(11,16) !== msg.createAt.slice(11,16)) && msg.receiverNickname != userNickname ? <Text>{adjustTime(msg.createAt)}</Text> : ""}
                </View>
              </View>
            </View>
            ))}
          </ScrollView>
          <View style={{
            flexDirection:"row",
            marginTop: SCREEN_HEIGHT * 0.02,
            height: SCREEN_HEIGHT * 0.05,
            // justifyContent: "center",
            alignItems:"center",
            marginLeft: SCREEN_WIDTH * 0.02,
            padding: 10,
            borderRadius: 10, // 모서리 둥근 정도
            borderColor: "gray", // 테두리 색상
            borderWidth: 1, // 테두리 두께
          }}>
            <TextInput
              style={{width:"90%"}}
              value={inputMessage}
              onChangeText={setInputMessage}
            />
            <TouchableOpacity
            onPress={sendMessage}
            >
              <Image 
                style={{ width:30, height:30}}
                source={send}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dmContainer : {
    marginTop:SCREEN_HEIGHT*0.09,
    justifyContent: "center",
    alignItems: "center"
  },
  dmView : {
    padding: 16,
    borderWidth: 1,
    borderColor: "lightgrey",
    backgroundColor: "white",
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.802,
    borderRadius: 10,
    elevation: 5,
  },
  dmViewTopView : {
    flexDirection: "row",
    justifyContent: "space-between", 
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "gainsboro",
    paddingBottom: 20,
  },
  topViewText : {
    fontSize: 18,
    fontWeight: "bold"
  },
  centerDayContainer : {
    alignItems: "center",
    marginVertical: 10
  },
  centerDay : {
    backgroundColor: "#ecf0f1",
    padding: 5,
    borderRadius: 15,
  }
});
