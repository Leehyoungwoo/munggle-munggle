import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet,
  TouchableOpacity, Dimensions, FlatList,
  Modal, StatusBar, TextInput
} from "react-native";
import iconClose from "../../assets/icons/close1.png";
import DirectMessageRoom from "./directMessageRoom";
import { AntDesign } from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

export default function DirectMessage (props) {
  const apiUrl = "http://i10a410.p.ssafy.io:8080";
  const [authToken, setAuthToken] = useState("");

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [userNickname, setUserNickname] = useState(null);
  const [otherUserId, setOtherUserId] = useState(null);
  const closeChatModal = (()=>{
    getRoomData();
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

  const getRoomData = async () => {
    if (!authToken) {
      setAuthToken(await AsyncStorage.getItem("accessToken"));
    };

    await axios.get(
      `${apiUrl}/message`,
      {headers: {
        "Authorization": authToken._j,
      }}
    ).then((res) => {
      setChatRoom(res.data);
    }).catch((err) => {
      console.log(err);
    })
  }

  useEffect(() => {
    if (!authToken) {
      setAuthToken(AsyncStorage.getItem("accessToken"));
    };
  }, []);

  useEffect(() => {
    getRoomData();
  }, [authToken]);


  //각각의 방 정보
  const renderChatRoom = () => {
    if (chatRoom && chatRoom.length > 0) {
      return (
        <View>
          {chatRoom.map((room, index) => {
            const formattedDate = getTimeDifference(room.lastSendTime);
            return (
              <TouchableOpacity 
                key={index}
                onPress={() => {
                  setRoomId(room.roomId);
                  setUserNickname(room.userNickname);
                  setOtherUserId(room.otherUserId);
                  setChatModalVisible(true)
                }}
                style={styles.chatRoomContainer}
              >
                <View style={styles.chatRoomLeftView}>
                  <Image src={room.profileImage} style={styles.chatRoomLeftImage} />
                </View>
                  
                <View style={styles.chatRoomRightView}>
                  <View style={styles.chatRoomRightTopView}>
                    <Text style={{fontSize: 17, marginLeft: SCREEN_WIDTH * 0.02, marginTop: SCREEN_HEIGHT * 0.005,}}>{room.lastContent}</Text>
                  </View>
                  <View style={styles.chatRoomRightBottomView}>
                    <Text style={{fontSize: 14, fontWeight: "500", marginLeft: SCREEN_WIDTH * 0.015}}>{room.userNickname}</Text>
                    <Text style={{fontSize: 13, fontWeight: "500", marginLeft: SCREEN_WIDTH * 0.27, color: "lightgrey"}}>{formattedDate}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }

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

          {renderChatRoom()}

          <TouchableOpacity style={{position: "absolute", bottom: 0, right: 10, marginRight: SCREEN_WIDTH * 0.01, width: SCREEN_WIDTH * 0.2, height: SCREEN_WIDTH * 0.2}} onPress={() => setCreateModalVisible(true)}>
              <AntDesign name="pluscircleo" size={60} color="rgb(13, 110, 253)" style={{  }} />
          </TouchableOpacity>

        
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
    justifyContent: "flex-end",
    alignItems: "flex-end",
    flexDirection: "row",
  },

  directMessageBottomView: {
    marginBottom: SCREEN_HEIGHT * 0.01,
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.215,
    alignItems: "center",
  },

  chatRoomContainer: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.1,
    flexDirection: "row",
    marginTop: SCREEN_HEIGHT * 0.02,
    borderWidth: 1,
    borderColor: "gainsboro",
    alignItems: "center",
    elevation: 3,
  },
  chatRoomLeftView: {
    width: SCREEN_WIDTH * 0.2,
    height: SCREEN_HEIGHT * 0.08,
    justifyContent: "center",
    alignItems: "center",
  },
  chatRoomLeftImage: {
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_WIDTH * 0.15,
    borderRadius: 100,
  },
  chatRoomRightView: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_HEIGHT * 0.08,
    
  },
  chatRoomRightTopView: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_HEIGHT * 0.05,
  },
  chatRoomRightBottomView: {
    flexDirection: "row",
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_HEIGHT * 0.03,
  },
});