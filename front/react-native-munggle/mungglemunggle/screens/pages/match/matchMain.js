import React, { useState, useEffect } from "react";
import { StatusBar, View, Text, Image, Switch, 
  Button, ScrollView, StyleSheet,
  Dimensions, TouchableOpacity, Alert, Modal, FlatList
} from "react-native";
import ToggleSwitch from 'toggle-switch-react-native';

import imageWink from "../../../assets/icons/wink.png";
import imageNose from "../../../assets/icons/nose.png";
import iconInfoEdit from "../../../assets/icons/infoEdit.png";
import { useNavigation } from "@react-navigation/native";
import profile from "../../../assets/icons/profile.png";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from '@expo/vector-icons';

import CreateDog from "../../../components/modal/createDog";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

export default function MatchMain () {
  const apiUrl = "http://i10a410.p.ssafy.io:8080";

  const [profile, setProfile] = useState(false);

  const [authToken, setAuthToken] = useState("");

  const [dogList, setDogList] = useState(false);

  const getMyProfile = async () => {
    if (!authToken) {
      setAuthToken(await AsyncStorage.getItem("accessToken"));
    };

    await axios.get(
      `${apiUrl}/users/mypage`,
      {headers: {
        "Authorization": authToken ,
      }}
    ).then((res) => {
      setProfile(res.data);
      console.log(res.data);
    }) .catch((err) => {
      console.log(err);
    })
  }

  const getMyDogList = async () => {
    if (!authToken) {
      setAuthToken(await AsyncStorage.getItem("accessToken"));
    };

    await axios.get(
      `${apiUrl}/userpages/${profile.id}/dog`,
      {headers: {
        "Authorization": authToken ,
      }}
    ).then((res) => {
      setDogList(res.data);
      console.log(res.data);
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
    getMyProfile();
  }, [authToken]);

  useEffect(() => {
    getMyDogList();
  }, [profile]);


  const navigation = useNavigation();

  //매칭하려고 선택한 강아지 PK
  const [currentDogID, setCurrentDogID] = useState(0); 

  // 산책할 강아지
  const [chooseMyDog, setChooseMyDog] = useState(false);

  //매칭하고싶은지 여부
  const [isMatch, setIsMatch] = useState(false)
  
  //내 특징, 원하는 강아지 특징을 적었는지 여부
  const [mySetting, setMySetting] = useState(true)
  const [wantSetting, setWantSetting] = useState(true)


  //토글 버튼 클릭
  const handleIsMatch = () => {
    haveNoDog();
    if (haveDog == true){
    setIsMatch(!isMatch);}
  };

  //코 클릭
  const clickNose = () => {
    if (mySetting == true && wantSetting){
      navigation.navigate('MatchLoading')
    }
  }

  //편집버튼 누를때 나오는 모달
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  //편집버튼 클릭
  const openEditModal = () => {
    setEditModalOpen(true);
  }

  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  const openMySetting = () => {
    closeEditModal();
    navigation.navigate('MatchMySetting', { dog: chooseMyDog});
  }

  const openWantSetting = () => {
    setEditModalOpen(!isEditModalOpen);
    navigation.navigate('MatchWantSetting')
  }

  //매칭 대상 강아지 변경 모달
  const [isDogModalOpen, setDogModalOpen] = useState(false);

  const openDogModal = () => {
    setDogModalOpen(true);
  };

  const closeDogModal = () => {
    setDogModalOpen(false);
  };

  const [isCreateDogModalOpen, setIsCreateDogModalOpen] = useState(false);

  const openCreateDogModal = () => { setIsCreateDogModalOpen(true) }; 
  const closeCreateDogModal = () => { setIsCreateDogModalOpen(false) }; 

  const dogListView = () => {
    if (dogList && dogList.length > 0) {
      if (chooseMyDog) {
          return (
          <TouchableOpacity 
            onPress={openDogModal} 
            style={{
              ...styles.imageButtonOpacity, 
              backgroundColor:'white',
              borderRadius: 100,
            }}
          >
            <Image
              src={chooseMyDog.image}
              style={styles.imageButton}
            />
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity 
            onPress={openDogModal} 
            style={{...styles.imageButtonOpacity, backgroundColor:'white',}}
          >
            <Text style={{fontSize: 13,}}>강아지</Text>
            <Text style={{fontSize: 13, marginRight: 3,}}>선택</Text>
          </TouchableOpacity>
        );
      }
    } else {
      return (
        <TouchableOpacity 
          style={styles.imageButtonOpacity}
          onPress={openCreateDogModal}
        >
          <AntDesign name="pluscircleo" size={50} color="black" />
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.matchContainer}>
      {/*노란 배경 부분*/}
      <View style={styles.matchTopView}>
        {/*프로필 사진, 토글 버튼*/}
        <View style={styles.matchTopViewTop}>
          {dogListView()}
        </View>
        {/*친구 찾기*/}
        <View style={styles.matchTopViewMiddle}>
          <Text style={styles.matchWinkText}>친구 찾기</Text>
        </View>
        {/*윙크 눈*/}
        <View style={styles.matchTopViewBottom}>
          <Image
            style={styles.matchWinkImage}
            source={imageWink}
          />
        </View>
      </View>

      {/*코 버튼(position:absolute)*/}
      <TouchableOpacity style={styles.matchNoseView} onPress={clickNose}>
        <Image 
          style={styles.matchNoseImage}
          source={imageNose}
        />
      </TouchableOpacity>

      {/*하얀 배경 부분*/}
      <View style={styles.matchBottomView}>
        <TouchableOpacity 
          style={styles.matchInfoEditIconView} 
          onPress={openEditModal}
        >
          <Image 
            style={styles.matchInfoEditIcon}
            source={iconInfoEdit}
          />
        </TouchableOpacity>
      </View>

      {/* 설정 변경 모달 */}
      <Modal
        transparent={true}
        visible={isEditModalOpen}
        onRequestClose={() => closeEditModal}
      >
        <View style={{...styles.modalContainer}}>
          <StatusBar backgroundColor="rgba(0, 0, 0, 0.5)" barStyle="dark-content" />
          <View 
            style={{
              ...styles.modalContent,
              position: "relative",
            }}
          >
            {/* 모달 내용 */}
            <TouchableOpacity 
              onPress={closeEditModal}
              style={{position: "absolute", top: 10, right: 10,}}
            >
              <AntDesign name="close" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={{
                width: SCREEN_WIDTH, 
                height: SCREEN_HEIGHT * 0.05, 
                justifyContent: "center", 
                alignItems: "center",
                marginTop: SCREEN_HEIGHT * 0.05,
              }} 
              onPress={openMySetting}
            >
              <Text style={styles.modalText} >내 강아지 설정 변경</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{
                width: SCREEN_WIDTH, 
                height: SCREEN_HEIGHT * 0.06, 
                justifyContent: "center", 
                alignItems: "center",
              }} 
              onPress={openWantSetting}
            >              
            <Text style={styles.modalText}>원하는 강아지 설정 변경</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 프로필 변경 모달 */}
      <Modal
        transparent={true}
        visible={isDogModalOpen}
        onRequestClose={() => closeDogModal}
      >
        <View style={styles.modalContainer}>
          <StatusBar backgroundColor="rgba(0, 0, 0, 0.5)" barStyle="dark-content" />
          <View 
            style={{
              ...styles.modalContent,
              position: "relative",
            }}
          >
            <TouchableOpacity 
              onPress={closeDogModal}
              style={{position: "absolute", top: 10, right: 10,}}
            >
              <AntDesign name="close" size={30} color="black" />
            </TouchableOpacity>

            <FlatList
              style={{
                marginTop: SCREEN_HEIGHT * 0.05,
              }}
              horizontal
              data={dogList}
              keyExtractor={(item) => item.dogId.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.imageContainer} 
                  onPress={() => {
                    setChooseMyDog(item);
                    closeDogModal();
                  }}
                >
                  <Image src={item.image} style={styles.image} />
                  <Text>{item.name}</Text>
                </TouchableOpacity>
            )}
          />
          </View>
        </View>
      </Modal>
      
      <Modal
        animationType="fade"
        transparent={true}
        visible={isCreateDogModalOpen}
        onRequestClose={() => closeCreateDogModal()}>
        <CreateDog getMyDogList={getMyDogList} closeCreateDogModal={closeCreateDogModal} />
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  matchContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.82,
    backgroundColor: "white",
    position: "relative",
  },
  matchTopView: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.50,
    backgroundColor: "rgb(253, 245, 169)",
    alignItems: "center",
  },

  //matchTopViewTop관련
  matchTopViewTop: {
    flexDirection: 'row',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.10,
    justifyContent: 'space-between',
    alignItems: "center",
    padding: 10,
  },
  imageButtonOpacity:{
    width: SCREEN_WIDTH * 0.2,
    height: SCREEN_WIDTH * 0.2,
    borderRadius: 10,
    alignItems:'center',
    justifyContent: 'center',
    marginTop: SCREEN_HEIGHT * 0.02,
  },
  imageButton: {
    width: SCREEN_WIDTH * 0.2,
    height: SCREEN_WIDTH * 0.2,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "lightgrey",
  },

  //matchTopViewMiddle관련
  matchTopViewMiddle: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.3,
    alignItems:'center',
    justifyContent: 'center',
  },
  matchWinkText: {
    fontSize: 40,
    fontWeight: "600",
  },

  //matchTopViewBottom관련
  matchTopViewBottom:{
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.3,
    alignItems:'center',
    justifyContent: 'center',
  },
  matchWinkImage: {
    marginTop: SCREEN_HEIGHT * 0.01,
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_WIDTH * 0.3,
    marginBottom: SCREEN_HEIGHT * 0.02,
  },

  //코 버튼 관련
  matchNoseView: {
    width: SCREEN_WIDTH * 0.55,
    height: SCREEN_WIDTH * 0.55,
    backgroundColor: "white",
    borderColor: "gainsboro",
    borderWidth: 1,
    borderRadius: 200,
    position: "absolute",
    left: SCREEN_WIDTH * 0.23,
    bottom: SCREEN_WIDTH * 0.32,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 2,
  },
  matchNoseImage: {
    width: SCREEN_WIDTH * 0.55,
    height: SCREEN_WIDTH * 0.55,
    borderRadius: 200, 
  },

  matchBottomView:{
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.7,
    alignItems:'flex-end',
    justifyContent: 'flex-end',
  },

  matchInfoEditIconView: {
    width: SCREEN_WIDTH * 0.16,
    height: SCREEN_WIDTH * 0.16,
    marginBottom: SCREEN_HEIGHT * 0.1,
    marginRight: SCREEN_WIDTH * 0.1,
  },
  matchInfoEditIcon: {
    width: SCREEN_WIDTH * 0.16,
    height: SCREEN_WIDTH * 0.16,
  },
  modalContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    marginTop: SCREEN_HEIGHT * 0.75,
    height: SCREEN_HEIGHT * 0.25,
    width: SCREEN_WIDTH,
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: "center",
  },

  modalText:{
    fontSize: 20,
    fontWeight:'bold',
    borderBottomWidth: 2,
    borderBottomColor: "lightgrey",
    paddingBottom: SCREEN_HEIGHT * 0.006,
  },

  imageContainer: {
    marginRight: 10,
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_WIDTH * 0.15,
    alignItems:'center',
    margin:10
    
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
});