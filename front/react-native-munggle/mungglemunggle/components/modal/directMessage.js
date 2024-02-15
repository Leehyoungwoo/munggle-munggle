import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet,
  TouchableOpacity, Dimensions, FlatList,
  Modal, Switch, StatusBar, TextInput, KeyboardAvoidingView, Platform
} from "react-native";
import iconClose from "../../assets/icons/close1.png";
import axios, { Axios } from "axios";
import DirectMessageRoom from "./directMessageRoom";
import WS from "react-native-websocket";
import { AntDesign } from '@expo/vector-icons';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

export default function DirectMessage (props) {

  const defaultImage = require("../../assets/icons/profile.png");

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [userNickname, setUserNickname] = useState(null);
  const [otherUserId, setOtherUserId] = useState(null);
  const closeChatModal = (()=>{
    setChatModalVisible(false);
  });
  const [chatRoom, setChatRoom] = useState([]);
  const [searchUser, setSearchUser] = useState([]);
  const [DMUser, setDMUser] = useState(""); //textInput

  const searchUserAPI = async (keyword) => {
    try {
      const response = await fetch(`http://i10a410.p.ssafy.io:8080/search/user?keyword=${keyword}`);
      const data = await response.json();
      setSearchUser(data); // 검색 결과를 상태에 저장
    } catch (error) {
      console.error("dm검색 실패:", error);
    }
  };

  useEffect(() => {
    searchUserAPI(DMUser);
  }, [DMUser]);

  useEffect(() => {
    const fetchChatRoomData = async () => {
      try {
        // GET 요청 보내기
        const response = await axios.get("http://i10a410.p.ssafy.io:8080/message");
        console.log(response.data);
        // 서버 응답에서 필요한 데이터 추출
        const chatRoomData = response.data;

        // chatRoom 상태 업데이트
        setChatRoom(chatRoomData);
      } catch (error) {
        console.error("Error fetching chat room data:", error);
      }
    };
    fetchChatRoomData();
  }, []);

  //각각의 방 정보
  const renderChatRoom = ({ item }) => {
    const formattedDate = getTimeDifference(item.lastSendTime);
    const message = item.lastContent;
    return (
      <TouchableOpacity onPress={() => {
        setRoomId(item.roomId);
        setUserNickname(item.userNickname);
        setOtherUserId(item.otherUserId);
        setChatModalVisible(true)}}>
      <View style={{alignItems:"center", flexDirection: "row", marginVertical: 15, marginHorizontal: 10}}>
        <Image source={item.profileImage ? { uri: item.profileImage } : defaultImage} style={{ width: SCREEN_WIDTH*0.12, height: SCREEN_WIDTH*0.12, borderRadius: 20, marginRight: SCREEN_WIDTH*0.03 }} />
        <View style={{ flex: 1 }}>
          <Text>{item.userNickname}</Text>
          <Text style={{ color: "gray" }}>{message}</Text>
        </View>
        <Text style={{ color: "gray" }}>{formattedDate}</Text>
      </View>
      </TouchableOpacity>
    );
  };

  //각각의 검색 내용
  const renderSearchItem = ({ item }) => {
    return (
      <View style={{alignItems:"center", flexDirection: "row", marginVertical: 10, marginHorizontal: 10}}>
        <Image source={{ uri: item.profileImgUrl }} style={{ width: SCREEN_WIDTH*0.12, height: SCREEN_WIDTH*0.12, borderRadius: 25, marginRight: SCREEN_WIDTH*0.03 }} />
        <View style={{ flex: 1 }}>
          <Text>{item.nickname}</Text>
        </View>
        <TouchableOpacity onPress={()=>{
          setOtherUserId(item.id);
          setUserNickname(item.nickname);
          setRoomId(null);
          setCreateModalVisible(false);
          setChatModalVisible(true);
        }}>
          <Image source={require("../../assets/icons/next.png")} style={{ width: SCREEN_WIDTH*0.06, height: SCREEN_WIDTH*0.06 }} />
        </TouchableOpacity>
      </View>
    );
  };

  //현재시간, 알람시간 차이 계산
  function getTimeDifference(registDate) {
    const currentDate = new Date();
    const targetDate = new Date(registDate);
    const timeDifference = currentDate - targetDate;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (seconds < 60) {
      return `${seconds}초 전`;
    } else if (minutes < 60) {
      return `${minutes}분 전`;
    } else if (hours < 24) {
      return `${hours}시간 전`;
    } else if (days < 30) {
      return `${days}일 전`;
    } else if (months < 12) {
      return `${months}개월 전`;
    } else {
      return `${years}년 전`;
    }
  }

  return (
    <View style={styles.directMessageModalBackGround}>
      <View style={styles.directMessageModalContainer}>
          <TouchableOpacity style={styles.directMessageTopView}>
            <Text style={styles.directMessageTopText}>DM</Text>
            <TouchableOpacity
            style={styles.closeView}
            onPress={props.closeDirectMessageModal}
            >
            <Image 
              style={styles.closeImage}
              source={iconClose}
            />
          </TouchableOpacity>
          </TouchableOpacity>

          <View style={styles.directMessageMiddleView}>
          <FlatList
              data={chatRoom}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderChatRoom}
            />
            <TouchableOpacity onPress={() => setCreateModalVisible(true)}>
                {/* <Image source={require("../../assets/icons/plus.png")} style={{ position:"absolute", width: 70, height: 70,
              right: 20, bottom: 20 }} /> */}
                <AntDesign name="pluscircleo" size={60} color="rgb(13, 110, 253)" style={{ position: "absolute", bottom: 0, right: 20 }} />
            </TouchableOpacity>
          </View>

          
          {/* 검색 모달 */}
          <Modal
        transparent={true}
        visible={createModalVisible}
        onRequestClose={() => setCreateModalVisible(!createModalVisible)}
      >
        <StatusBar backgroundColor="rgba(0,0,0,0.5)" />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.2)" }}>
          <View style={{ 
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "lightgrey",
            backgroundColor: "white", padding: 16, width: 300,
            elevation: 5,
          }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
            <View style={{ width: 24, height: 24 }} />
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>DM상대 초대</Text>
              <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                <Image source={require("../../assets/icons/close1.png")} style={{ width: 24, height: 24 }} />
              </TouchableOpacity>
              
            </View >
            <View style={{
              marginTop: SCREEN_HEIGHT * 0.02,
              height: SCREEN_HEIGHT * 0.05,
              justifyContent: "center",
              marginLeft: SCREEN_WIDTH * 0.02,
              padding: 10,
              borderRadius: 10, // 모서리 둥근 정도
              borderColor: "gray", // 테두리 색상
              borderWidth: 1, // 테두리 두께
            }}>
            <TextInput
              placeholder="유저 닉네임을 입력하세요"
              value={DMUser}
              onChangeText={setDMUser}
            />
            </View>

            <View style={{height:400}}>
            <FlatList
              data={searchUser}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderSearchItem}
            />
            </View>

          </View>
        </View>
      </Modal>

      {/* 방 모달 */}
      <Modal
        transparent={true}
        visible={chatModalVisible}
        onRequestClose={() => setChatModalVisible(!chatModalVisible)}
      >
          <DirectMessageRoom otherUserId={otherUserId} userNickname={userNickname} roomId={roomId} closeChatModal={closeChatModal}/>

      </Modal>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  directMessageModalBackGround: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)"
  },
  directMessageModalContainer: {
    alignItems: "center",
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.8,
    marginBottom: SCREEN_HEIGHT * 0.015,
    padding: SCREEN_WIDTH * 0.0,
    position: "relative",
    borderWidth: 1,
    borderColor: "lightgrey",
    backgroundColor: "white",
    elevation: 5,
    borderRadius: 10,
  },
  directMessageModalScrollView: {
  },

  closeView: {
    width: SCREEN_WIDTH * 0.06,
    height: SCREEN_WIDTH * 0.06,
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeImage: {
    width: SCREEN_WIDTH * 0.06,
    height: SCREEN_WIDTH * 0.06,
  },

  directMessageTopView: {
    width: SCREEN_WIDTH * 0.82,
    height: SCREEN_HEIGHT * 0.06,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "gainsboro",
    marginLeft: 5,
  },

  directMessageTopText: {
    fontSize: 18,
    fontWeight: "bold"
  },

  directMessageMiddleView: {
    marginTop: SCREEN_HEIGHT * 0.01,
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.7,
    justifyContent: "center",
    // alignItems: "center",
    flexDirection: "row",
  },

  directMessageBottomView: {
    marginBottom: SCREEN_HEIGHT * 0.01,
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.215,
    alignItems: "center",
  },
});