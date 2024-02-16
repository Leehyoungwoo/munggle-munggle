import React, { useEffect, useState } from 'react';
import { Modal, Dimensions, StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import back from '../../../assets/icons/back.png';
import change from '../../../assets/icons/change.png';
import dm from '../../../assets/icons/directMessage.png';
import { useNavigation } from '@react-navigation/native';
import ModalComponent from '../../../components/modal/directMessage';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

const owners =
[
{
"id":1,
"backgroundImgUrl":null,
"profileImgUrl":"https://upload.wikimedia.org/wikipedia/commons/8/81/Woman_at_work%2C_Gujarat.jpg",
"nickname":"철수",
"desc":"안녕",
},
{
  "id":2,
  "backgroundImgUrl":null,
  "profileImgUrl":"https://upload.wikimedia.org/wikipedia/commons/8/81/Woman_at_work%2C_Gujarat.jpg",
  "nickname":"영희",
  "desc":"안녕",
  },
  {
    "id":1,
    "backgroundImgUrl":null,
    "profileImgUrl":"https://upload.wikimedia.org/wikipedia/commons/8/81/Woman_at_work%2C_Gujarat.jpg",
    "nickname":"철수",
    "desc":"안녕",
    },
    {
      "id":2,
      "backgroundImgUrl":null,
      "profileImgUrl":"https://upload.wikimedia.org/wikipedia/commons/8/81/Woman_at_work%2C_Gujarat.jpg",
      "nickname":"영희",
      "desc":"안녕",
      },
      {
        "id":1,
        "backgroundImgUrl":null,
        "profileImgUrl":"https://upload.wikimedia.org/wikipedia/commons/8/81/Woman_at_work%2C_Gujarat.jpg",
        "nickname":"철수",
        "desc":"안녕",
        },
        {
          "id":2,
          "backgroundImgUrl":null,
          "profileImgUrl":"https://upload.wikimedia.org/wikipedia/commons/8/81/Woman_at_work%2C_Gujarat.jpg",
          "nickname":"영희",
          "desc":"안녕",
          },
]

const dogs =
[ {
      "dogId": 43,
      "kindId": 55,
      "birthDate": "2023-07-07T23:25:22",
      "size": "",
      "weight": 0.0,
      "gender": "M",
      "isNeutering": true,
      "name": "푸푸",
      "image": "https://t2.gstatic.com/licensed-image?q=tbn:ANd9GcQOO0X7mMnoYz-e9Zdc6Pe6Wz7Ow1DcvhEiaex5aSv6QJDoCtcooqA7UUbjrphvjlIc",
      "description": "스윗 리를 도그"
  },
 {
      "dogId": 43,
      "kindId": 55,
      "birthDate": "2023-07-07T23:25:22",
      "size": "",
      "weight": 0.0,
      "gender": "F",
      "isNeutering": true,
      "name": "푸푸2",
      "image": "https://t2.gstatic.com/licensed-image?q=tbn:ANd9GcQOO0X7mMnoYz-e9Zdc6Pe6Wz7Ow1DcvhEiaex5aSv6QJDoCtcooqA7UUbjrphvjlIc",
      "description": "스윗 리를 도그"
  },
  {
    "dogId": 43,
    "kindId": 55,
    "birthDate": "2023-07-07T23:25:22",
    "size": "",
    "weight": 0.0,
    "gender": "M",
    "isNeutering": true,
    "name": "푸푸",
    "image": "https://t2.gstatic.com/licensed-image?q=tbn:ANd9GcQOO0X7mMnoYz-e9Zdc6Pe6Wz7Ow1DcvhEiaex5aSv6QJDoCtcooqA7UUbjrphvjlIc",
    "description": "스윗 리를 도그"
},
{
    "dogId": 43,
    "kindId": 55,
    "birthDate": "2023-07-07T23:25:22",
    "size": "",
    "weight": 0.0,
    "gender": "F",
    "isNeutering": true,
    "name": "푸푸2",
    "image": "https://t2.gstatic.com/licensed-image?q=tbn:ANd9GcQOO0X7mMnoYz-e9Zdc6Pe6Wz7Ow1DcvhEiaex5aSv6QJDoCtcooqA7UUbjrphvjlIc",
    "description": "스윗 리를 도그"
},
{
  "dogId": 43,
  "kindId": 55,
  "birthDate": "2023-07-07T23:25:22",
  "size": "",
  "weight": 0.0,
  "gender": "M",
  "isNeutering": true,
  "name": "푸푸",
  "image": "https://t2.gstatic.com/licensed-image?q=tbn:ANd9GcQOO0X7mMnoYz-e9Zdc6Pe6Wz7Ow1DcvhEiaex5aSv6QJDoCtcooqA7UUbjrphvjlIc",
  "description": "스윗 리를 도그"
},
{
  "dogId": 43,
  "kindId": 55,
  "birthDate": "2023-07-07T23:25:22",
  "size": "",
  "weight": 0.0,
  "gender": "F",
  "isNeutering": true,
  "name": "푸푸2",
  "image": "https://t2.gstatic.com/licensed-image?q=tbn:ANd9GcQOO0X7mMnoYz-e9Zdc6Pe6Wz7Ow1DcvhEiaex5aSv6QJDoCtcooqA7UUbjrphvjlIc",
  "description": "스윗 리를 도그"
},
]

export default function MatchResult() {
  const apiUrl = "http://i10a410.p.ssafy.io:8080";

  const [authToken, setAuthToken] = useState("");

  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [modalIndex, setModalIndex] = useState(null); // 선택한 아이템의 인덱스

  const getMatchResult = async () => {
    if (!authToken) {
      setAuthToken(await AsyncStorage.getItem("accessToken"));
    };

    await axios.get(
      `${apiUrl}/dog-match/list`,
      {headers: {
        "Authorization": authToken ,
        "Content-Type": "application/json"
      }}
    ).then((res) => {
      console.log(res.status);
    }).catch((err) => {
      console.log(err);
    })

  };

  useEffect(() => { 
    if (!authToken) {
      setAuthToken(AsyncStorage.getItem("accessToken"));
    };
  }, []);

  useEffect(() => {
    getMatchResult();
  }, [authToken]);

  const openDMModal = (index) => {
    setModalIndex(index);
    setShowModal(true);
  };

  const closeDMModal = () => {
    setModalIndex(null);
    setShowModal(false);
  };

  const [showOwnerInfo, setShowOwnerInfo] = useState(Array(owners.length).fill(false));

  const changeInfo = (index) => {
    const newShowOwnerInfo = [...showOwnerInfo];
    newShowOwnerInfo[index] = !newShowOwnerInfo[index];
    setShowOwnerInfo(newShowOwnerInfo);
  };

  return (
    <View style={styles.matchContainer}>
      <View style={styles.TopView}>
        <View style={styles.TopViewTextBox}>
        <Text style={styles.detailText}>매칭 결과</Text>
        </View>
        <View style={styles.TopViewEndButton}>
        <TouchableOpacity style={styles.matchInfoEditIconViewCenter} onPress={() => {
          navigation.navigate('MatchMain')
        }}>
          <Image 
            style={styles.matchInfoEditIcon}
            source={back}
          />
        </TouchableOpacity>
        </View>
      </View>
    <ScrollView>
      {owners.map((owner, index) => (
        <View key={index} style={styles.resultBox}>
          {showOwnerInfo[index] ? (
                  <Image source={{ uri: owners[index].profileImgUrl }} style={styles.resultBoxImage} />
                ) : (
                  <Image source={{ uri: dogs[index].image }} style={styles.resultBoxImage} />
                )}
            <View style={styles.resultBoxText}>
              <View style={{ flexDirection: 'row' }}>
                {showOwnerInfo[index] ? (
                  <Text style={styles.resultText}>{owners[index].nickname}</Text>
                ) : (
                  <>
                  <Text style={styles.resultText}>{dogs[index].name}</Text>
                <Text style={styles.resultText}>{dogs[index].gender}</Text>
                  </>
                )}
              </View>
              {showOwnerInfo[index] ? (
                <>
                </>

              ) : (
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.resultText}>{dogs[index].birthDate.slice(2,10)}</Text>
                </View>
              )
              }
            </View>

          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <TouchableOpacity onPress={() => changeInfo(index)}>
              <Image source={change} style={styles.buttonImage} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openDMModal(index)}>
              <Image source={dm} style={styles.buttonImage} />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* DM 모달 */}
      <Modal
        visible={showModal}
        transparent={true}
        onRequestClose={closeDMModal}
      >
        <ModalComponent data={modalIndex} closeDirectMessageModal={closeDMModal} />
      </Modal>
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  matchContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.82,
    backgroundColor: 'rgb(253, 245, 169)',
    position: "relative",
  },
  matchTopView: {
    height: SCREEN_HEIGHT * 0.05,
    backgroundColor: 'red'
  },
  TopView:{
    height: SCREEN_HEIGHT*0.07,
    width: SCREEN_WIDTH,
    alignItems: 'center',
    zIndex: -1,
    flexDirection:'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  TopViewTextBox: {
    flex:1,
    alignItems: 'center',
  },

  TopViewEndButton: {
    position: 'absolute',
    right: SCREEN_WIDTH * 0.85,
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: 'black',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },

  matchInfoEditIconViewCenter: {
    width: 28,
    height: 28,
  },
  matchInfoEditIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  detailText:{
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
  },

  resultBox: {
    padding: 20,
    marginHorizontal: SCREEN_WIDTH * 0.02,
    marginVertical: SCREEN_HEIGHT * 0.01,
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2.5,
    backgroundColor: 'white',
    borderTopWidth: 0.2,
    borderColor:'gray'

  },
  resultText:{
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
    paddingHorizontal: 7
  },
  buttonImage:{
    width: 50,
    height: 50,
    marginRight: 15
  },
  resultBoxImage:{
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_WIDTH * 0.15,
    marginRight: 10,
    borderRadius:100
  },
  resultBoxText:{
    width: SCREEN_WIDTH * 0.4,
    alignItems: 'center'
  }
});
