import React, { useEffect, useState } from 'react';
import { Modal, Dimensions, StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import back from '../../../assets/icons/back.png';
import change from '../../../assets/icons/change.png';
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import dm from '../../../assets/icons/directMessage.png';
import { useNavigation } from '@react-navigation/native';
import ModalComponent from '../../../components/modal/directMessage';

import { RadioButton } from "react-native-paper";

import Checkbox from 'expo-checkbox';

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

const dog =  {
  "dogId": 1,
  "characterId": ["말썽꾸러기", "모험을 좋아함", "사냥꾼", "상냥함"],
  "isNeutering": false}

export default function MatchWantSetting(props) {
  const apiUrl = "http://i10a410.p.ssafy.io:8080";

  const [authToken, setAuthToken] = useState("");

  const navigation = useNavigation();

  const [isNeutering, setIsNeutering] = useState();

  const [isChecked1, setIsChecked1] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [isChecked3, setIsChecked3] = useState(false);
  const [isChecked4, setIsChecked4] = useState(false);
  const [isChecked5, setIsChecked5] = useState(false);
  const [isChecked6, setIsChecked6] = useState(false);
  const [isChecked7, setIsChecked7] = useState(false);
  const [isChecked8, setIsChecked8] = useState(false);
  const [isChecked9, setIsChecked9] = useState(false);
  const [isChecked10, setIsChecked10] = useState(false);
  const [isChecked11, setIsChecked11] = useState(false);
  const [isChecked12, setIsChecked12] = useState(false);
  const [isChecked13, setIsChecked13] = useState(false);
  const [isChecked14, setIsChecked14] = useState(false);
  const [isChecked15, setIsChecked15] = useState(false);
  const [isChecked16, setIsChecked16] = useState(false);
  const [isChecked17, setIsChecked17] = useState(false);

  const character1 = "고집셈";
  const character2 = "공격적임";
  const character3 = "놀기 좋아함";
  const character4 = "독립적임";
  const character5 = "말썽꾸러기";
  const character6 = "먹보";
  const character7 = "모험을 좋아함";
  const character8 = "방구석 게으름뱅이";
  const character9 = "사냥꾼";
  const character10 = "상냥함";
  const character11 = "시끄러움";
  const character12 = "영리함";
  const character13 = "잘 놀람";
  const character14 = "충성스러움";
  const character15 = "털이 많음";
  const character16 = "호기심 많음";
  const character17 = "활동적임";
  
  const [characters, setCharacters] = useState([]);

  const checkCharacter = async () => {
    if (isChecked1) {
      setCharacters([...characters, character1])
    };
    if (isChecked2) {
      setCharacters([...characters, character2])
    };
    if (isChecked3) {
      setCharacters([...characters, character3])
    };
    if (isChecked4) {
      setCharacters([...characters, character4])
    };
    if (isChecked5) {
      setCharacters([...characters, character5])
    };
    if (isChecked6) {
      setCharacters([...characters, character6])
    };
    if (isChecked7) {
      setCharacters([...characters, character7])
    };
    if (isChecked8) {
      setCharacters([...characters, character8])
    };
    if (isChecked9) {
      setCharacters([...characters, character9])
    };
    if (isChecked10) {
      setCharacters([...characters, character10])
    };
    if (isChecked11) {
      setCharacters([...characters, character11])
    };
    if (isChecked12) {
      setCharacters([...characters, character12])
    };
    if (isChecked13) {
      setCharacters([...characters, character13])
    };
    if (isChecked14) {
      setCharacters([...characters, character14])
    };
    if (isChecked15) {
      setCharacters([...characters, character15])
    };
    if (isChecked16) {
      setCharacters([...characters, character16])
    };
    if (isChecked17) {
      setCharacters([...characters, character17])
    };
  };

  const saveMySetting = async () => {
    if (!authToken) {
      setAuthToken(await AsyncStorage.getItem("accessToken"));
    };
    
    await checkCharacter();

    const payLoad = {
      characterId: characters, 
      isNeutering: isNeutering,
    }

    console.log(payLoad);

    await axios.post(
      `${apiUrl}/dog-match`,
      payLoad,
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

  // useEffect(() => {
  // }, [authToken]);


  const characterContent = () => {
    return (
      <View style={{marginVertical: SCREEN_HEIGHT * 0.04,}}>
        <View style={styles.characterListView}>
          <Checkbox color="black" style={styles.checkbox} value={isChecked1} onValueChange={() => setIsChecked1(!isChecked1)} />
          <Text style={styles.characterListText}>{character1}</Text>
        </View>
        <View style={styles.characterListView}>
          <Checkbox color="black" style={styles.checkbox} value={isChecked2} onValueChange={() => setIsChecked2(!isChecked2)} />
          <Text style={styles.characterListText}>{character2}</Text>
        </View>
        <View style={styles.characterListView}>
          <Checkbox color="black" style={styles.checkbox} value={isChecked3} onValueChange={() => setIsChecked3(!isChecked3)} />
          <Text style={styles.characterListText}>{character3}</Text>
        </View>
        <View style={styles.characterListView}>
          <Checkbox color="black" style={styles.checkbox} value={isChecked4} onValueChange={() => setIsChecked4(!isChecked4)} />
          <Text style={styles.characterListText}>{character4}</Text>
        </View>
        <View style={styles.characterListView}>
          <Checkbox color="black" style={styles.checkbox} value={isChecked5} onValueChange={() => setIsChecked5(!isChecked5)} />  
          <Text style={styles.characterListText}>{character5}</Text>
        </View>
        <View style={styles.characterListView}>
          <Checkbox color="black" style={styles.checkbox} value={isChecked6} onValueChange={() => setIsChecked6(!isChecked6)} />  
          <Text style={styles.characterListText}>{character6}</Text>
        </View>
        <View style={styles.characterListView}>
          <Checkbox color="black" style={styles.checkbox} value={isChecked7} onValueChange={() => setIsChecked7(!isChecked7)} />  
          <Text style={styles.characterListText}>{character7}</Text>
        </View>
        <View style={styles.characterListView}>
          <Checkbox color="black" style={styles.checkbox} value={isChecked8} onValueChange={() => setIsChecked8(!isChecked8)} />  
          <Text style={styles.characterListText}>{character8}</Text>
        </View>
        <View style={styles.characterListView}>
          <Checkbox color="black" style={styles.checkbox} value={isChecked9} onValueChange={() => setIsChecked9(!isChecked9)} />  
          <Text style={styles.characterListText}>{character9}</Text>
        </View>
        <View style={styles.characterListView}>
          <Checkbox color="black" style={styles.checkbox} value={isChecked10} onValueChange={() => setIsChecked10(!isChecked10)} />  
          <Text style={styles.characterListText}>{character10}</Text>
        </View>
        <View style={styles.characterListView}>
          <Checkbox color="black" style={styles.checkbox} value={isChecked11} onValueChange={() => setIsChecked11(!isChecked11)} />  
          <Text style={styles.characterListText}>{character11}</Text>
        </View>
        <View style={styles.characterListView}>
          <Checkbox color="black" style={styles.checkbox} value={isChecked12} onValueChange={() => setIsChecked12(!isChecked12)} />  
          <Text style={styles.characterListText}>{character12}</Text>
        </View>
        <View style={styles.characterListView}>
          <Checkbox color="black" style={styles.checkbox} value={isChecked13} onValueChange={() => setIsChecked13(!isChecked13)} />  
          <Text style={styles.characterListText}>{character13}</Text>
        </View>
        <View style={styles.characterListView}>
          <Checkbox color="black" style={styles.checkbox} value={isChecked14} onValueChange={() => setIsChecked14(!isChecked14)} />  
          <Text style={styles.characterListText}>{character14}</Text>
        </View>
        <View style={styles.characterListView}>
          <Checkbox color="black" style={styles.checkbox} value={isChecked15} onValueChange={() => setIsChecked15(!isChecked15)} />  
          <Text style={styles.characterListText}>{character15}</Text>
        </View>
        <View style={styles.characterListView}>
          <Checkbox color="black" style={styles.checkbox} value={isChecked16} onValueChange={() => setIsChecked16(!isChecked16)} />  
          <Text style={styles.characterListText}>{character16}</Text>
        </View>
        <View style={styles.characterListView}>
          <Checkbox color="black" style={styles.checkbox} value={isChecked17} onValueChange={() => setIsChecked17(!isChecked17)} />  
          <Text style={styles.characterListText}>{character17}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.matchContainer}>
      <ScrollView>
        <View style={styles.TopView}>
          <View style={styles.TopViewTextBox}>
            <Text style={styles.detailText}>원하는 강아지 특징 등록</Text>
          </View>

          <View style={styles.TopViewEndButton}>
            <TouchableOpacity 
              style={styles.matchInfoEditIconViewCenter} 
              onPress={() => {
                navigation.navigate('MatchMain')
              }}
            >
              <Image 
                style={styles.matchInfoEditIcon}
                source={back}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.submitView}>
            <TouchableOpacity onPress={() => saveMySetting()} style={styles.submitTouch}>
              <Text style={styles.submitText}>등록</Text>
            </TouchableOpacity>
        </View>

        <View style={{...styles.Box, height: SCREEN_HEIGHT * 0.1,}}>
          <View style={styles.isNeuteringView}>
            <View style={styles.isNeuteringLeftView}>
              <Text style={styles.isNeuteringText}>중성화 여부</Text>
            </View>

            <View style={styles.isNeuteringMiddleView}>
              <RadioButton 
                value={true}
                status={ isNeutering ? "checked" : "unchecked" }
                onPress={() => setIsNeutering(true)}
                color="black"
              />
              <Text style={{fontSize: 21, fontWeight: "600",}}>O</Text>
            </View>

            <View style={styles.isNeuteringRightView}>
              <RadioButton 
                value={false}
                status={ !isNeutering ? "checked" : "unchecked" }
                onPress={() => setIsNeutering(false)}
                color="black"
              />
              <Text style={{fontSize: 17, fontWeight: "600",}}>X</Text>
            </View>
          </View>
        </View>

        <View style={styles.Box}>
          <View style={styles.characterView}>
            <View style={styles.characterTextView}>
              <Text style={styles.isNeuteringText}>강아지 성격</Text>
            </View>
            
            {characterContent()}
          </View>
        </View>
      </ScrollView>
    </View>
    )
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
  },
  TopView:{
    marginTop: SCREEN_HEIGHT * 0.1,
    marginBottom: SCREEN_HEIGHT * 0.01,
    height: SCREEN_HEIGHT *  0.07,
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
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  submitView: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.05,
    justifyContent: "center",
    alignItems: "center",
  },
  submitTouch: {
    width: SCREEN_WIDTH * 0.25,
    height: SCREEN_HEIGHT * 0.05,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0275d8",
    borderWidth: 2,
    borderColor: "lightgrey",
  },
  submitText: {
    fontSize: 17,
    fontWeight: "600",
    color: "white",
  },

  detailText:{
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
    borderBottomColor: "gray",
    borderBottomWidth: 2,
  },

  Box: {
    marginVertical: SCREEN_HEIGHT * 0.01,
    width: SCREEN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: SCREEN_HEIGHT * 0.02,
  },
  isNeuteringView: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor:'lightgrey',
    elevation: 2.5,
    backgroundColor: 'white',
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  isNeuteringLeftView: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_HEIGHT * 0.1,
    justifyContent: "center",
    alignItems: "center",
  },
  isNeuteringMiddleView: {
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_HEIGHT * 0.1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  isNeuteringRightView: {
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_HEIGHT * 0.1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  isNeuteringText: {
    fontSize: 20,
    fontWeight: "600",
  },

  characterView: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor:'lightgrey',
    elevation: 2.5,
    backgroundColor: 'white',
    width: SCREEN_WIDTH * 0.8,
    flexDirection: "row",
  },
  characterTextView: {
    width: SCREEN_WIDTH * 0.4,
    height: SCREEN_HEIGHT * 0.1,
    justifyContent: "center",
    alignItems: "center",
  },
  characterListView: {
    width: SCREEN_WIDTH * 0.4,
    height: SCREEN_HEIGHT * 0.05,
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  characterListText: {
    fontSize: 17,
    marginLeft: SCREEN_WIDTH * 0.02,
  },
  checkbox: {
    padding: 10,
  },
});
