import React, { startTransition, useEffect, useState } from "react";
import { View, Image, StyleSheet,
  ScrollView, TouchableOpacity, Button,
  Dimensions, Text,
  TextInput,
  KeyboardAvoidingView,
  Platform   
} from "react-native";

import * as ImagePicker from 'expo-image-picker';

import iconClose from "../../assets/icons/close1.png";
import iconCamera from "../../assets/icons/camera.png";
import iconSend from "../../assets/icons/send.png";

import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";
import { Header } from "react-native/Libraries/NewAppScreen";

import * as ImageManipulator from 'expo-image-manipulator';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

export default function PostCreate (props) {
  const apiUrl = "http://i10a410.p.ssafy.io:8080";

  const [authToken, setAuthToken] = useState("");

  const [postId, setPostId] = useState(false);

  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");

  const [isPrivate, setIsPrivate] = useState(false);

  const createPostData = async () => {
    if (!authToken) {
      setAuthToken(await AsyncStorage.getItem("accessToken"));
    };

    const payLoad = {
      postTitle: title, 
      postContent: content, 
      isPrivate: isPrivate,
      hashtags: tags,
    };

    console.log(payLoad)

    await axios.post(
      `${apiUrl}/posts`,
      payLoad,
      {headers: {
        "Authorization": authToken,
        "Content-Type": "application/json",
      }}
    ).then((res) => {
      setPostId(res.data);
      console.log(res.data);
    }).catch((err) => {
      console.log(err);
    });
  };

  const resizeImage = async (imageUri) => {
    try {
        const resizedImage = await ImageManipulator.manipulateAsync(
          imageUri, // 이미지 URI
            [{ resize: { width: 400, height: 300 } }], // 조절 옵션 배열
            { compress: 1, format: "jpeg" } // 압축 및 형식 설정
        );

        // 조절된 이미지 데이터를 얻습니다.
        console.log('Resized image:', resizedImage.uri);
        return resizedImage;
    } catch (err) {
        console.error('Failed to resize image:', err);
    }
  };

  const createPostImages = async () => {
    if (!authToken) {
      setAuthToken(await AsyncStorage.getItem("accessToken"));
    };

    images.forEach(async (image) => {
      const resizedImageUrl = await resizeImage(image.uri);
      
      const formData = new FormData();
      const localUri = resizedImageUrl.uri;
      const fileName = localUri.split('/').pop();
      const match = /\.(\w+)$/.exec(fileName ?? '');
      const type = match ? `image/${match[1]}` : `image`;

      formData.append("file", { uri: localUri, name: fileName, type});
      console.log(postId);
      await axios.post(
        `${apiUrl}/posts/${postId}/image`,
        formData,
        {headers: {
          "Authorization": authToken,
          "Content-type": "multipart/form-data",
        }}
      ).then((res) => {
        console.log(res.status);
      }).then(() => {
        props.closeCreateModal();
        props.openDetailModal(postId);
      }).catch((err) => {
        console.log(err)
      })
    })
  };

  const createPost = async () => {
    await createPostData();
  };

  useEffect(() => {
    createPostImages();
  }, [postId]);

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

    await setImages([...images, response.assets[0]]);
  };

  const createTag = () => {
    setTags([...tags, tag]);
    setTag("");
  }

  const preViewImages = () => {
    return (
      <ScrollView
        horizontal={true}
        showHorizontalScrollIndicator={false}
      >
        {images && images.map((image, index) => {
          const uri = image.uri;

          return (
            <View key={index} style={styles.previewImageView}>
              <Image 
                source={{uri}} 
                style={styles.previewImage} 
              />
            </View>
          );
        })}
      </ScrollView>
    );
  };
  
  const tagList = () => {
    return (
      <ScrollView
        horizontal={true}
        showHorizontalScrollIndicator={false}
        style={styles.tagListScroll}
      >
        {tags && tags.map((tag, index) => {
          return (
            <View key={index} style={styles.tagListView}>
              <Text style={styles.tagListText}>{tag}</Text>
            </View>
          );
        })}
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
      style={styles.createModalBackGround}
    >

    <View style={styles.createModalBackGround}>
      <View style={styles.createModalContainer}>
        <TouchableOpacity
          style={styles.closeView}
          onPress={props.closeCreateModal}
          >
          <Image 
            style={styles.closeImage}
            source={iconClose}
          />
        </TouchableOpacity>
        <View style={styles.createPostTopView}>
          <Text style={styles.createPostTopText}>게시물 등록</Text>
        </View>
        <ScrollView style={styles.createModalScrollView}>

          <View style={styles.postCreateTopView}>
            {preViewImages()}
          </View>

          <View style={styles.postCreateMiddleView}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cameraButtonView}
                onPress={() => pickImage()}
              >
                <Image
                  source={iconCamera}
                  style={styles.cameraButton}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.postCreateBottomView}>
            <View style={styles.postCreateTextInputView}>
              <TextInput
                placeholder="제목을 입력하세요"
                value={title}
                onChangeText={(e) => setTitle(e)}
                style={styles.postCreateTextInput}
              />
            </View>

            <View style={styles.postCreateTagInputView}>
              <View style={styles.postCreateTagListView}>
                {tagList()}
              </View>
              <View style={styles.postCreateTagCreateView}>
                <TextInput
                  placeholder="ex) 태그이름"
                  value={tag}
                  onChangeText={(e) => setTag(e)}
                  style={styles.postCreateTagInput}
                />
                <TouchableOpacity 
                  style={styles.postCreateTagSubmitView}
                  onPress={() => createTag()}
                >
                  <AntDesign name="pluscircleo" size={SCREEN_WIDTH * 0.08} color="rgb(13, 110, 253)" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.postCreateTextAreaView}>
              <TextInput
                placeholder="내용을 입력하세요"
                textAlignVertical="top"
                value={content}
                onChangeText={(e) => setContent(e)}
                style={styles.postCreateTextArea}
                multiline
              />
            </View>
          </View>

          <View style={styles.postCreateSubmitView}>
            <TouchableOpacity
             style={styles.postCreateSubmitTouchView}
             onPress={createPost}
            >
              <Text style={styles.postCreateSubmitText}>게시물 등록</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>
    </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  createModalBackGround: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  createModalContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.8,
    borderRadius: 10,
    backgroundColor: "white",
    marginBottom: SCREEN_HEIGHT * 0.03,
    position: "relative",
    borderWidth: 1,
    borderColor: "gainsboro",
  },
  createModalScrollView: {
  },

  closeView: {
    width: SCREEN_WIDTH * 0.05,
    height: SCREEN_WIDTH * 0.05,
    position: "absolute",
    top: 5,
    right: 5,
  },
  closeImage: {
    width: SCREEN_WIDTH * 0.05,
    height: SCREEN_WIDTH * 0.05,
  },

  postCreateTopView: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "gray",
    marginLeft: SCREEN_WIDTH * 0.05,
  },
  previewImageView: {
    width: SCREEN_WIDTH * 0.7, 
    height: SCREEN_HEIGHT * 0.25, 
    marginRight: SCREEN_WIDTH * 0.01, 
  },
  previewImage: {
    width: SCREEN_WIDTH * 0.7, 
    height: SCREEN_HEIGHT * 0.25, 
  },
  
  postCreateMiddleView: {
    marginVertical: SCREEN_HEIGHT * 0.01,
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 0.13,
    alignItems: "center",
  },
  buttonContainer: {
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_WIDTH * 0.13,
    flexDirection: "row", 
    justifyContent: "center", 
  },
  cameraButtonView: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_WIDTH * 0.12,
    borderWidth: 1,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraButton: {
    width: SCREEN_WIDTH * 0.1,
    height: SCREEN_WIDTH * 0.1,
  },
  
  postCreateBottomView: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.35,
    alignItems: "center",
  },
  postCreateTextInputView: {
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT * 0.07,
  },
  postCreateTextInput: {
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT * 0.06,
    borderRadius: 10, 
    borderColor: 'gray',
    borderWidth: 1, 
    paddingLeft: SCREEN_WIDTH * 0.02,
    fontSize: 16,
  },
  
  postCreateTagInputView: {
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT * 0.07,
    flexDirection: "row",
    position: "relative",
  },
  postCreateTagListView: {
    width: SCREEN_WIDTH * 0.43,
    height: SCREEN_HEIGHT * 0.06,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
  },
  tagListScroll: {
    height: SCREEN_HEIGHT * 0.06,
  },
  tagListView: {
    backgroundColor: "rgb(180, 180, 180)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    height: SCREEN_HEIGHT * 0.036,
    paddingHorizontal: SCREEN_WIDTH * 0.025,
    paddingVertical: SCREEN_HEIGHT * 0.0015,
    marginTop: SCREEN_HEIGHT * 0.012,
    marginLeft: SCREEN_WIDTH * 0.01,
  },
  tagListText: {
    color: "white",
    fontSize: 17,
  },
  postCreateTagCreateView: {
    width: SCREEN_WIDTH * 0.40,
    height: SCREEN_HEIGHT * 0.06,
    position: "absolute",
    right: 0,
    flexDirection: "row"
  },
  postCreateTagInput: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_HEIGHT * 0.06,
    paddingLeft: SCREEN_WIDTH * 0.02,
    fontSize: 16,
    borderRadius: 10, 
    borderColor: 'gray',
    borderWidth: 1, 
  },
  postCreateTagSubmitView: {
    width: SCREEN_WIDTH * 0.10,
    height: SCREEN_HEIGHT * 0.06,
    justifyContent: "center",
    alignItems: "center",
  },
  postCreateTextAreaView: {
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT * 0.2,
  },
  postCreateTextArea: {
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT * 0.2,
    paddingTop: SCREEN_HEIGHT * 0.01,
    paddingLeft: SCREEN_WIDTH * 0.02,
    fontSize: 16,    
    borderRadius: 10,
    borderColor: 'gray', 
    borderWidth: 1, 
  },
  
  postCreateSubmitView: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.05,
    alignItems: "center",
  },
  postCreateSubmitTouchView: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_HEIGHT * 0.05,
    backgroundColor: "rgb(253, 245, 169)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gainsboro",
  },
  postCreateSubmitText: {
    color: "black",
    fontSize: 20,
  },
  createPostTopView: {
    justifyContent: "center", 
    alignItems: "center",
    width: SCREEN_WIDTH * 0.75,
    height: SCREEN_HEIGHT * 0.05,
    marginBottom: SCREEN_HEIGHT * 0.005,
  },
  createPostTopText: {
    fontSize: 22, 
    fontWeight: "600",
    borderBottomWidth: 2,
    borderBottomColor: "gray",
  },
});