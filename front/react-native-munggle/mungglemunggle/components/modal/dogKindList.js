import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet,
  TouchableOpacity, Dimensions,
  StatusBar, ScrollView, Alert
} from "react-native";

import iconClose from "../../assets/icons/close1.png";

import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";

import { ActivityIndicator, RadioButton } from "react-native-paper";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")
  
export default function DogKindList (props) {
  const apiUrl = "http://i10a410.p.ssafy.io:8080";

  const [authToken, setAuthToken] = useState("");

  const searchName = props.kindName;

  const [kindList, setKindList] = useState(false);
  
  const [chooseKindId, setChooseKindId] = useState(false);
  const [chooseKind, setChooseKind] = useState("");

  useEffect(() => {
    if (!authToken) {
      setAuthToken(AsyncStorage.getItem("accessToken"));
    };
  }, []);

  const getKindList = async () => {
    if (!authToken) {
      setAuthToken(await AsyncStorage.getItem("accessToken"));
    };

    if (!kindList) {
      axios.get(
        `${apiUrl}/openapi/kinds/${props.kindName}`,
        {headers: {
          "Authorization": authToken,
        }}
      ).then((res) => {
        setKindList(res.data);
      }).catch((err) => {
        console.log(err);
      })
    }
  };  

  const chooseDogKind = () => {
    if (chooseKindId) {
      props.setKindId(chooseKindId);
      props.setKindName(chooseKind);
      props.closeKindListModal();
    } else {
      Alert.alert("강아지 종류를 선택해주세요!");
    }
  };
 
  useEffect(() => {
    if (!kindList) {
      getKindList();
    } 
  }, [])

  const dogKindList = () => {
    if (kindList) {
      return (
        <ScrollView style={styles.dogKindBottomView}>
          {kindList.map((kind, index) => {
            return (
              <TouchableOpacity 
                key={index} 
                style={styles.dogKindListView}
                onPress={() => {
                  setChooseKindId(kind.kindId);
                  setChooseKind(kind.kindNm);
                }}
              >
                <View style={styles.dogKindView}>
                <RadioButton 
                  value={`${kind.kindNm}`}
                  status={ chooseKind === kind.kindNm ? "checked" : "unchecked" }
                  color="gray"
                  onPress={() => {
                    setChooseKindId(kind.kindId);
                    setChooseKind(kind.kindNm);
                  }}
                />
                  <Text style={styles.dogKindText}>{kind.kindNm}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      );
    } else {
      return (
        <View style={{...styles.dogKindBottomView, height: SCREEN_HEIGHT * 0.3, justifyContent: "center",}}>
          <ActivityIndicator size={100} />
        </View>
      );
    }
  }

  return (
    <View style={styles.dogKindBackground}>
      <StatusBar backgroundColor="rgba(0,0,0,0.5)" />
      <View style={styles.dogKindContainer}>
        <TouchableOpacity 
          style={styles.dogKindCloseView} 
          onPress={props.closeKindListModal}
        >
          <Image source={iconClose} style={styles.dogKindCloseImage} />
        </TouchableOpacity>
        <View style={styles.dogKindTopView}>
          <Text style={styles.dogKindTopText}>{searchName} 검색 결과</Text>
        </View>
 
        <View style={styles.dogListView}>
          {dogKindList()}
        </View>

        <TouchableOpacity 
          style={styles.dogKindSubmitView}
          onPress={() => chooseDogKind()}
        > 
          <Text style={styles.dogKindSubmitText}>선택</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dogKindBackground: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  dogKindContainer: {
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingVertical: SCREEN_HEIGHT * 0.05, 
    borderRadius: 20, 
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.5,
    marginBottom: SCREEN_HEIGHT * 0.015,
    alignItems: "center",
    position: "relative",
    backgroundColor: "white",
  },

  dogKindCloseView: {
    width: SCREEN_WIDTH * 0.07,
    height: SCREEN_WIDTH * 0.07,
    position: "absolute",
    right: SCREEN_WIDTH * 0.05,
    top: SCREEN_WIDTH * 0.05,
  },
  dogKindCloseImage: {
    width: SCREEN_WIDTH * 0.07,
    height: SCREEN_WIDTH * 0.07,
  },

  dogKindTopView: {
    justifyContent: "center", 
    alignItems: "center",
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_HEIGHT * 0.05,
    marginBottom: SCREEN_HEIGHT * 0.015,
  },
  dogKindTopText: {
    fontSize: 22, 
    fontWeight: "600",
    borderBottomWidth: 2,
    borderBottomColor: "gray",
  },

  dogListView: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_HEIGHT * 0.31,
  },

  dogKindBottomView: {
    width: SCREEN_WIDTH * 0.7,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingVertical: SCREEN_HEIGHT * 0.02,
  },
  dogKindListView: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_HEIGHT * 0.06,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  dogKindView: {
    width: SCREEN_WIDTH * 0.5,
    height: SCREEN_HEIGHT * 0.05,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "lightgrey",
    marginRight: SCREEN_WIDTH * 0.11,
  },
  dogKindText: {
    fontSize: 17,
    fontWeight: "600",
    paddingBottom: SCREEN_HEIGHT * 0.004,
  },

  dogKindSubmitView: {
    width: SCREEN_WIDTH * 0.2,
    height: SCREEN_HEIGHT * 0.05,
    backgroundColor: "rgb(255, 255, 200)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SCREEN_HEIGHT * 0.015,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "lightgrey",
  },
  dogKindSubmitText: {
    fontSize: 17,
    fontWeight: "600",
  },
});