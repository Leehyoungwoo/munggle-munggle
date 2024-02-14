import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet,
  TouchableOpacity, Dimensions, FlatList,
  Modal, Switch, StatusBar, TextInput
} from "react-native";

import iconClose from "../../assets/icons/close1.png";
import iconSearch from "../../assets/icons/search.png";

import * as ImagePicker from 'expo-image-picker';

import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";

import { AntDesign } from '@expo/vector-icons';

import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

import { RadioButton } from "react-native-paper";

import DogKindList from "./dogKindList";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

export default function CreateDog (props) {
  const apiUrl = "http://i10a410.p.ssafy.io:8080";

  const [authToken, setAuthToken] = useState("");

  const [imageUrl, setImageUrl] = useState(false);
  
  const formatDate = (date) => {
    const day = new Date(date);
    return format(day, "yyyy.MM.dd");
  }

  const todayDate = new Date();

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState(todayDate);
  const [gender, setGender] = useState("수컷");
  const [weight, setWeight] = useState(0);
  const [kindId, setKindId] = useState("");
  const [kindName, setKindName] = useState("푸들");
  const [description, setDescription] = useState("");

  const [isKindListModalOpen, setIsKindListModalOpen] = useState(false);

  const openKindListModal = () => { setIsKindListModalOpen(true) }; 
  const closeKindListModal = () => { setIsKindListModalOpen(false) }; 

  const preViewImage = () => {
    if (imageUrl) {
      return (
        <Image 
          src={imageUrl.uri} 
          style={styles.createDogPreviewImage} 
        />
      );
    } else {
      return (
        <AntDesign name="pluscircleo" size={100} color="black" style={{opacity: 0.4,}} />
      );
    }
  };
  
  const pickImage = async () => {
    const response = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3], //비율 변경 가능
      quality: 1,
    });

    if (response.canceled) {
      return null;
    }
    console.log(response.assets[0].uri);

    setImageUrl(response.assets[0]);
  };

  const createDogImage = async (dogId) => {
    if (!authToken) {
      setAuthToken(await AsyncStorage.getItem("accessToken"));
    };

    const formData = new FormData();
    const localUri = imageUrl.uri;
    const fileName = localUri.split('/').pop();
    const match = /\.(\w+)$/.exec(fileName ?? '');
    const type = match ? `image/${match[1]}` : `image`;

    formData.append("file", { uri: localUri, name: fileName, type});


    await axios.put(
      `${apiUrl}/dogs/${dogId}/image`,
      formData,
      {headers: {
        "Authorization": authToken,
        "Content-type": "multipart/form-data",
      }}
    ).then((res) => {
      console.log(res.status);
    }).then(async() => {
      await props.getMyDogList();
    }).then(() => {
      props.closeCreateDogModal();
    }).catch((err) => {
      console.log(err)
    })
  };

  const createDogData = async () => {
    if (!authToken) {
      setAuthToken(await AsyncStorage.getItem("accessToken"));
    };

    console.log(authToken);

    const payLoad = {
      kindId: kindId,
      birthDate: birthDate,
      weight: weight,
      gender: gender,
      name: name,
      description: description,
    };

    console.log(payLoad);

    await axios.post(
      `${apiUrl}/dogs`,
      payLoad,
      {headers: {
        "Authorization": authToken,
        "Content-Type": "application/json",
      }}
    ).then(async (res) => {
      console.log(res.data);
      await createDogImage(res.data);
    }).catch((err) => {
      console.log(err)
    })
  };

  const genderButton = () => {
    return (
      <View style={styles.createDogGenderInputView}>
        <View style={styles.createDogGenderInputLeftView}>
          <RadioButton 
            value="수컷"
            status={ gender === "수컷" ? "checked" : "unchecked" }
            onPress={() => setGender("수컷")}
            color="lightblue"
            />
          <Text style={styles.createDogGenderInputText}>남자</Text>
        </View>

        <View style={styles.createDogGenderInputRightView}>
          <RadioButton 
            value="암컷"
            status={ gender === "암컷" ? "checked" : "unchecked" }
            onPress={() => setGender("암컷")}
            color="pink"
          />
          <Text style={styles.createDogGenderInputText}>여자</Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    if (!authToken) {
      setAuthToken(AsyncStorage.getItem("accessToken"));
    };
  }, []);

  return (
    <View style={styles.createDogBackground}>
      <StatusBar backgroundColor="rgba(0,0,0,0.5)" />
      <View style={styles.createDogContainer}>
        <TouchableOpacity 
          style={styles.createDogCloseView} 
          onPress={props.closeCreateDogModal}
        >
          <Image source={iconClose} style={styles.createDogCloseImage} />
        </TouchableOpacity>

        <View style={styles.createDogTopView}>
          <Text style={styles.createDogTopText}>강아지 등록</Text>
        </View>

        <View style={styles.createDogBottomView}>
          <TouchableOpacity 
            style={styles.createDogPreviewImageView}
            onPress={pickImage}
          >
            {preViewImage()}
          </TouchableOpacity>

          <View style={styles.createDogInputView}>
            <View style={styles.createDogInputViewInView}>
              <TextInput 
                style={styles.createDogLeftInput}
                textContentType="name"
                keyboardType="name-phone-pad"
                placeholder="이름"
                value={name}
                onChangeText={(e) => setName(e)}
              />
              <TextInput 
                style={styles.createDogRightInput}
                textContentType="birthdate"
                keyboardType="decimal-pad"
                placeholder="강아지 생일"
                value={formatDate(birthDate)}
                onChangeText={(e) => setBirthDate(e)}
              />
            </View>

            <View style={styles.createDogInputViewInView}>
              {genderButton()}
              <View style={styles.createDogWeightInputView}>
                <TextInput 
                  style={styles.createDogWeightInput}
                  keyboardType="decimal-pad"
                  placeholder="몸무게 (kg)"
                  value={weight}
                  onChangeText={(e) => setWeight(e)}
                />
                {weight > 0 &&
                  <View style={styles.createDogWeightUnitView}>
                    <Text style={styles.createDogWeightUnitText}>kg</Text>
                  </View>
                }
              </View>
            </View>

            <View style={styles.createDogKindInputView}>
              <TextInput 
                style={styles.createDogKindInput}
                textContentType="name"
                keyboardType="default"
                placeholder="강아지 종류"
                value={kindName}
                onChangeText={(e) => setKindName(e)}
              />
              <TouchableOpacity 
                style={styles.searchIconView}
                onPress={() => openKindListModal()}
              >
                <Image
                  style={styles.searchIcon}
                  source={iconSearch}
                />
              </TouchableOpacity>
              <Modal
                animationType="fade"
                transparent={true}
                visible={isKindListModalOpen}
                onRequestClose={() => closeKindListModal()}>
                <DogKindList setKindName={setKindName} setKindId={setKindId} kindName={kindName} closeKindListModal={closeKindListModal} />
              </Modal>
            </View>

            <View style={styles.createDogDescriptionInputView}>
              <TextInput 
                style={styles.createDogDescriptionInput}
                keyboardType="default"
                placeholder="강아지 소개"
                value={description}
                onChangeText={(e) => setDescription(e)}
              />
            </View>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.createDogSubmitView}
          onPress={() => createDogData()}
        >
          <Text style={styles.createDogSubmitText}>강아지 등록</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  createDogBackground: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  createDogContainer: {
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingVertical: SCREEN_HEIGHT * 0.05, 
    borderRadius: 20, 
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT * 0.78,
    marginBottom: SCREEN_HEIGHT * 0.015,
    alignItems: "center",
    position: "relative",
    backgroundColor: "white",
  },

  createDogCloseView: {
    width: SCREEN_WIDTH * 0.07,
    height: SCREEN_WIDTH * 0.07,
    position: "absolute",
    right: SCREEN_WIDTH * 0.05,
    top: SCREEN_WIDTH * 0.05,
  },
  createDogCloseImage: {
    width: SCREEN_WIDTH * 0.07,
    height: SCREEN_WIDTH * 0.07,
  },

  createDogTopView: {
    justifyContent: "center", 
    alignItems: "center",
    width: SCREEN_WIDTH * 0.75,
    height: SCREEN_HEIGHT * 0.05,
    marginBottom: SCREEN_HEIGHT * 0.025,
  },
  createDogTopText: {
    fontSize: 22, 
    fontWeight: "600",
    borderBottomWidth: 2,
    borderBottomColor: "gray",
  },

  createDogBottomView: {
    width: SCREEN_WIDTH * 0.75,
    height: SCREEN_HEIGHT * 0.56,
    alignItems: "center",
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingVertical: SCREEN_HEIGHT * 0.02,
  },
  createDogPreviewImageView: {
    width: SCREEN_WIDTH * 0.65,
    height: SCREEN_HEIGHT * 0.22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgrey",
    marginBottom: SCREEN_HEIGHT * 0.005,
    borderRadius: 20,
    borderColor: "lightgrey",
    borderWidth: 1,
  },
  createDogPreviewImage: {
    width: SCREEN_WIDTH * 0.63,
    height: SCREEN_HEIGHT * 0.21,
    borderRadius: 20,
  },

  createDogInputView: {
    width: SCREEN_WIDTH * 0.65,
    height: SCREEN_HEIGHT * 0.3,
    alignItems: "center",
    justifyContent: "center",
  },
  createDogInputViewInView: {
    width: SCREEN_WIDTH * 0.62,
    height: SCREEN_HEIGHT * 0.05,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SCREEN_HEIGHT * 0.012,
  },
  createDogGenderInputView: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_HEIGHT * 0.05,
    borderRadius: 10,
    borderColor: "lightgrey",
    borderWidth: 1,  
    flexDirection: "row",
  },
  createDogGenderInputLeftView: {
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_HEIGHT * 0.05,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  createDogGenderInputRightView: {
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_HEIGHT * 0.05,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  createDogGenderInputText: {
    fontSize: 13,
    marginRight: SCREEN_WIDTH * 0.02,
  },
  createDogWeightInputView: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_HEIGHT * 0.05,
    position: "relative",
  },
  createDogWeightInput: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_HEIGHT * 0.05,
    fontSize: 15,
    paddingLeft: SCREEN_WIDTH * 0.05,
    textAlignVertical: "center",
    borderRadius: 10,
    borderColor: "lightgrey",
    borderWidth: 1,  
  },
  createDogWeightUnitView: {
    width: SCREEN_WIDTH * 0.05,
    height: SCREEN_HEIGHT * 0.05,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: SCREEN_WIDTH * 0.08,
  },
  createDogWeightUnitText: {
    fontSize: 16,
  },
  createDogLeftInput: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_HEIGHT * 0.05,
    fontSize: 15,
    paddingLeft: SCREEN_WIDTH * 0.03,
    textAlignVertical: "center",
    borderRadius: 10,
    borderColor: "lightgrey",
    borderWidth: 1,  
  },
  createDogRightInput: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_HEIGHT * 0.05,
    borderColor: "lightgrey",
    borderWidth: 1,    
    fontSize: 15,
    paddingLeft: SCREEN_WIDTH * 0.03,
    textAlignVertical: "center",
    borderRadius: 10,
  },
  createDogKindInputView: {
    width: SCREEN_WIDTH * 0.62,
    height: SCREEN_HEIGHT * 0.05,
    marginBottom: SCREEN_HEIGHT * 0.012,
    position: "relative",
  },
  createDogKindInput: {
    width: SCREEN_WIDTH * 0.62,
    height: SCREEN_HEIGHT * 0.05,
    borderColor: "lightgrey",
    borderWidth: 1,
    fontSize: 15,
    paddingLeft: SCREEN_WIDTH * 0.03,
    textAlignVertical: "center",
    borderRadius: 10,
  },
  searchIconView: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.1,
    height: SCREEN_HEIGHT * 0.05,
    right: SCREEN_WIDTH * 0.02,
    top: SCREEN_HEIGHT * 0.008,
    alignItems: "flex-end",
  },
  searchIcon: {
    width: SCREEN_WIDTH * 0.07,
    height: SCREEN_WIDTH * 0.07,
  },
  createDogDescriptionInputView: {
    width: SCREEN_WIDTH * 0.62,
    height: SCREEN_HEIGHT * 0.1,
    flexDirection: "row",
  },
  createDogDescriptionInput: {
    width: SCREEN_WIDTH * 0.62,
    height: SCREEN_HEIGHT * 0.1,
    borderColor: "lightgrey",
    borderWidth: 1,
    fontSize: 15,
    paddingLeft: SCREEN_WIDTH * 0.03,
    textAlignVertical: "center",
    borderRadius: 15,
  },

  createDogSubmitView: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_HEIGHT * 0.06,
    marginTop: SCREEN_HEIGHT * 0.004,
    backgroundColor: "rgb(255, 255, 200)",
    borderWidth: 1,
    borderColor: "lightgrey",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
  },
  createDogSubmitText: {
    fontSize: 17,
    fontWeight: "600",
  },
});