import React, { useEffect, useId, useState, useRef } from "react";
import { View, Text, Button, Image, 
  ScrollView, StyleSheet, Dimensions, 
  TouchableOpacity, Modal, TextInput,
  ActivityIndicator,
} from "react-native";

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import ProfileDog from "./profile/profileDog";
import ProfilePost from "./profile/profilePost";
import ProfileScrap from "./profile/profileScrap";

import iconDog from "../../assets/icons/profileDog.png";
import iconPost from "../../assets/icons/profilePost.png";
import iconScrap from "../../assets/icons/profileScrap.png";
import iconCreate from "../../assets/icons/create.png";

import iconEdit from "../../assets/icons/infoEdit.png";

import FollowButton from "../../components/followButton";
import DirectMessageButton from "../../components/directMessageButton";

import imgDefaultProfile from "../../assets/icons/defaultProfile.png";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import CreateDog from "../../components/modal/createDog";

import * as ImageManipulator from 'expo-image-manipulator';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")


export default function ProfileScreen () {
  const apiUrl = "http://i10a410.p.ssafy.io:8080";

  const [profile, setProfile] = useState(false);

  const [authToken, setAuthToken] = useState("");

  const [dogList, setDogList] = useState(false);
  const [postList, setPostList] = useState(false);
  const [scrapList, setScrapList] = useState(false);
  
  const [isEdit, setIsEdit] = useState(false);

  const [backgroundImgUrl, setBackgroundImgUrl] = useState("");
  const [profileImgUrl, setProfileImgUrl] = useState("");
  const [nickname, setNickname] = useState(profile.nickname);
  const [description, setDescription] = useState(profile.description);

  const iconList = [iconDog, iconPost, iconScrap];

  const [activeTab, setActiveTab] = useState(0);

  const scrollViewRef = useRef(null);

  const [isCreateDogModalOpen, setIsCreateDogModalOpen] = useState(false);

  const openCreateDogModal = () => { setIsCreateDogModalOpen(true) }; 
  const closeCreateDogModal = () => { setIsCreateDogModalOpen(false) }; 

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
    }).catch((err) => {
      console.log(err);
    })
  }

  const getMyPostList = async () => {
    if (!authToken) {
      setAuthToken(await AsyncStorage.getItem("accessToken"));
    };

    await axios.get(
      `${apiUrl}/userpages/${profile.id}/post`,
      {headers: {
        "Authorization": authToken ,
      }}
    ).then((res) => {
      setPostList(res.data);
    }) .catch((err) => {
      console.log(err);
    })
  }

  const getMyScrapList = async () => {
    if (!authToken) {
      setAuthToken(await AsyncStorage.getItem("accessToken"));
    };

    await axios.get(
      `${apiUrl}/userpages/${profile.id}/scrap`,
      {headers: {
        "Authorization": authToken ,
      }}
    ).then((res) => {
      setScrapList(res.data);
    }) .catch((err) => {
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
    getMyPostList();
    getMyScrapList();
  }, [profile]);
  
  const resizeImage = async (imageUri) => {
    try {
        const resizedImage = await ImageManipulator.manipulateAsync(
          imageUri, // 이미지 URI
            [{ resize: { width: 400, height: 300 } }], // 조절 옵션 배열
            { compress: 1, format: "jpeg" } // 압축 및 형식 설정
        );

        // 조절된 이미지 데이터를 얻습니다.
        return resizedImage;
    } catch (err) {
        console.error('Failed to resize image:', err);
    }
  };

  const changeBackgroundImg = async () => {
    const response = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3], //비율 변경 가능
      quality: 1,
    });

    if (response.canceled) {
      return null;
    }

    setBackgroundImgUrl(response.assets[0]);
  };

  const changeProfileImg = async () => {
    const response = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3], //비율 변경 가능
      quality: 1,
    });

    if (response.canceled) {
      return null;
    }
    setProfileImgUrl(response.assets[0]);
  };
  
  const editBackgroundImage = async () => {
    const resizedImageUrl = await resizeImage(backgroundImgUrl.uri);

    const localUri = resizedImageUrl.uri;
    const fileName = localUri.split('/').pop();
    const match = /\.(\w+)$/.exec(fileName ?? '');
    const type = match ? `image/${match[1]}` : `image`;
    const formData = new FormData();
    formData.append('backgroundImage', { uri: localUri, name: fileName, type});


    await axios.put(
      `${apiUrl}/users/background`,
      formData,
      {headers: {
        "Authorization": authToken ,
        "Content-Type": "multipart/form-data",
      }}
    ).then((res) => {
      console.log(res.status);
    }).catch((err) => {
      console.log(err);
    })
  };

  const editProfileImage = async () => {
    const resizedImageUrl = await resizeImage(profileImgUrl.uri);

    const localUri = resizedImageUrl.uri;
    const fileName = localUri.split('/').pop();
    const match = /\.(\w+)$/.exec(fileName ?? '');
    const type = match ? `image/${match[1]}` : `image`;

    const formData = new FormData();
    formData.append('profileImage', { uri: localUri, name: fileName, type});


    await axios.put(
      `${apiUrl}/users/profile-image`,
      formData,
      {headers: {
        "Authorization": authToken ,
        "Content-Type": "multipart/form-data",
      }}
    ).then((res) => {
      console.log(res.status);
    }).catch((err) => {
      console.log(err);
    })
  };

  const editProfileData = async () => {
    const payLoad = {
      newNickname: nickname,
      description: description,
    };

    await axios.put(
      `${apiUrl}/users`,
      payLoad,
      {headers: {
        "Authorization": authToken ,
        "Content-Type": "application/json",
      }}
    ).then((res) => {
      console.log(res.status);
    }).catch((err) => {
      console.log(err);
    })
  };

  const editProfile = async () => {
    if (profile.backgroundImgUrl != backgroundImgUrl.uri) {
      await editBackgroundImage();
    }

    if (profile.profileImgUrl != profileImgUrl.uri) {
      await editProfileImage();
    }
    
    if (profile.nickname != nickname || profile.description != description) {
      await editProfileData();
    }
    
    if (profile.backgroundImgUrl != backgroundImgUrl ||
        profile.profileImgUrl != profileImgUrl ||
        profile.nickname != nickname ||
        profile.description != description
      ) {
        await getMyProfile();
      }
    setIsEdit(false);
  };

  const myProfileImg = () => {
    if (!profile.profileImgUrl) {
      return (
        <View style={styles.profileDefaultTopView}>
          <View style={styles.profileDefaultImageView}>
            {profileImgUrl && 
              <Image 
                style={{
                  ...styles.profileDefaultImage, 
                  opacity: 0.8,
                }}
                source={profileImgUrl}
              /> 
            }
            {!profileImgUrl && 
              <Image 
                style={{
                  ...styles.profileDefaultImage, 
                  opacity: 0.8,
                }}
                source={imgDefaultProfile}
              /> 
            }
            <TouchableOpacity 
              style={styles.profileEditDefaultProfileImgButtonView}
              onPress={changeProfileImg}
            >
              <AntDesign 
                name="pluscircleo" 
                size={60} 
                color="black" 
                style={styles.profileEditDefaultProfileImgButtonIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.profileEditDefaultButtonView}
              onPress={editProfile}
            >
              <AntDesign 
                name="checksquareo" 
                size={33} 
                color="rgb(13, 110, 253)" 
                style={styles.profileEditButtonIcon}
              />
            </TouchableOpacity>
          </View>  
        </View>
      );
    } else {
      return (
        <View style={styles.profileTopViewMiddleView}>
          <View style={styles.profileImageView}>
            {profileImgUrl && 
              <Image 
                style={{
                  ...styles.profileImage, 
                  opacity: 0.8,
                }}
                src={profileImgUrl}
              />
            }
            {!profileImgUrl && 
              <Image 
                style={{
                  ...styles.profileImage, 
                  opacity: 0.8,
                }}
                src={profile.profileImgUrl}
              />
            }
            <TouchableOpacity 
              style={styles.profileEditProfileImgButtonView}
              onPress={changeProfileImg}
            >
              <AntDesign 
                name="pluscircleo" 
                size={60} 
                color="black" 
                style={styles.profileEditProfileImgButtonIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.profileEditButtonView}
              onPress={editProfile}
            >
              <AntDesign 
                name="checksquareo" 
                size={33} 
                color="rgb(13, 110, 253)" 
                style={styles.profileEditButtonIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    };
  };

  const myProfile = () => {
    if (isEdit) {
      return (
        <View style={styles.profileTopView}>
          <View style={styles.profileTopViewTopView}>
            {backgroundImgUrl && 
              <Image 
                style={{
                  ...styles.profileTopViewTopView, 
                  opacity:0.6, 
                  backgroundColor: "rgb(249, 250, 208)"
                }}
                source={
                  backgroundImgUrl 
                }
              />
            }
            {!backgroundImgUrl && 
              <Image 
                style={{
                  ...styles.profileTopViewTopView, 
                  opacity:0.6, 
                  backgroundColor: "rgb(249, 250, 208)"
                }}
                src={
                  profile.backgroundImgUrl
                }
              />
            }
            <TouchableOpacity 
              style={styles.profileEditBackgroundImgButtonView}
              onPress={changeBackgroundImg}
            >
              <AntDesign 
                name="pluscircleo" 
                size={80}
                color="black" 
                style={styles.profileEditBackgroundImgButtonIcon}
                />
            </TouchableOpacity>
          </View>
          {myProfileImg()}
          <View style={styles.profileTopViewBottomView}>
            <View style={styles.profileTopViewBottomViewTopView}>
              <View style={styles.profileEditTopView}></View>
              <TextInput 
                placeholder={profile.nickname}
                style={styles.profileEditUsername}
                value={nickname}
                onChangeText={(e) => setNickname(e)}
              />
              <View style={styles.profileTopViewBottomViewButtonView}>
                {/* <FollowButton authToken={authToken} isFollowed={profile.isFollowed} userId={profile.userId} /> */}
                {/* <DirectMessageButton /> */}
              </View>
            </View>
            <View style={styles.profileTopViewBottomViewBottomView}>
              <Text style={styles.textFollow}>팔로워 {profile.followerCount}</Text>
              <Text style={{...styles.textFollow, marginLeft:SCREEN_HEIGHT * 0.02}}>팔로잉 {profile.followingCount}</Text>
            </View>
            <TextInput 
              placeholder={profile.description}
              value={description}
              style={{...styles.textDescription, height: SCREEN_HEIGHT * 0.04, paddingBottom: SCREEN_HEIGHT * 0.005, backgroundColor: "white"}}
              multiline
              onChangeText={(e) => setDescription(e)}
            />
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.profileTopView}>
          <View style={styles.profileTopViewTopView}>
            <Image 
              style={styles.profileTopViewTopView}
              src={profile.backgroundImgUrl}
            />
          </View>
          <View style={styles.profileTopViewMiddleView}>
            <View style={styles.profileImageView}>
              <Image 
                style={styles.profileImage}
                src={profile.profileImgUrl}
              />
              <TouchableOpacity 
                style={styles.profileEditButtonView}
                onPress={() => setIsEdit(true)}
              >
                <Image 
                  style={styles.profileEditButtonIcon}
                  source={iconEdit}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.profileTopViewBottomView}>
            <View style={styles.profileTopViewBottomViewTopView}>
              <Text style={styles.profileTopViewBottomViewName}>{ profile.nickname }</Text>
              <View style={styles.profileTopViewBottomViewButtonView}>
                {/* <FollowButton /> */}
                {/* <DirectMessageButton /> */}
              </View>
            </View>
            <View style={styles.profileTopViewBottomViewBottomView}>
              <Text style={styles.textFollow}>팔로워 {profile.followerCount}</Text>
              <Text style={{...styles.textFollow, marginLeft:SCREEN_HEIGHT * 0.02}}>팔로잉 {profile.followingCount}</Text>
            </View>
            <Text style={styles.textDescription}>{profile.description}</Text>
          </View>
        </View>
      );
    };
  };
  
  const handleTabPress = async (index) => {
    setActiveTab(index);
    scrollViewRef.current.scrollTo({ x: SCREEN_WIDTH * index, animated: true });
  };

  const tabView = () => {
    return (
      <View style={styles.profileMiddleView}>
        {iconList.map((icon, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tabButton,
              activeTab === index && styles.activeTabButton,
              index != 2 && {borderRightWidth: 1, borderRightColor: "gray"},
            ]}
            onPress={() => handleTabPress(index)}>
            <Image
              style={styles.profileTabBarIcon}
              source={icon}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const profileDog = () => {
    if (dogList) {
      return (
        <View style={styles.profileBottomView}>
          <ProfileDog dogList={dogList} />
        </View>
      );
    } else {
      return (
        <View style={styles.indicatorView}>
          <ActivityIndicator 
            size={100}
          />
        </View>
      );
    }
  };

  const profilePost = () => {
    if (postList) {
      return (
        <View style={styles.profileBottomView}>
          <ProfilePost  postList={postList} />
        </View>
      );
    } else {
      return (
        <View style={styles.indicatorView}>
          <ActivityIndicator 
            size={100}
          />
        </View>
      );
    }
  };

  const profileScrap = () => {
    if (scrapList) {
      return (
        <View style={styles.profileBottomView}>
          <ProfileScrap  scrapList={scrapList} />
        </View>
      );
    } else {
      return (
        <View style={styles.indicatorView}>
          <ActivityIndicator 
            size={100}
          />
        </View>
      );
    }
  };

  const contentView = () => {
    if (activeTab === 0) {
      return (
        <View style={styles.tabView}>
          {profileDog()}
        </View>
      );
    } else if (activeTab === 1) {
      return (
        <View style={styles.tabView}>
          {profilePost()}
        </View>
      );
    } else if (activeTab === 2) {
      return (
        <View style={styles.tabView}>
          {profileScrap()}
        </View>
      );
    }
  };

  // dog delete logic

  // const deleteDog = () => {
  //   axios.delete(
  //     `${apiUrl}/dogs/1`,
  //     {headers: {
  //       "Authorization": authToken ,
  //       "Content-Type": "application/json",
  //     }}
  //   ).then((res) => {
  //     console.log("강아지 삭제==================");
  //     console.log(res.status);
  //   }).catch((err) => {
  //     console.log("프로필 데이터 변경==================");
  //     console.log(err);
  //   })
  // }

  return (
    <View style={styles.profileContainer}>
      <ScrollView style={styles.profileScrollView}>
        {myProfile()}

        {tabView()}

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          ref={scrollViewRef}
        >
          {contentView()}
        </ScrollView>
      </ScrollView>
      { activeTab === 0 &&
        <TouchableOpacity 
          onPress={() => openCreateDogModal()}
          style={styles.createDogView}
        >
          <Image 
            style={styles.createDogImage}
            source={iconCreate}
          />
        </TouchableOpacity>
      }
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
  profileContainer: {
    width: SCREEN_WIDTH,
    // backgroundColor: "rgb(206, 207, 184)",
    position: "relative",
  },
  profileScrollView: {
    width: SCREEN_WIDTH,
  },
  profileTopView: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.35,
    position: "relative",
  },
  profileBottomView: {
    width: SCREEN_WIDTH,
  },
  profileTabBarIcon: {
    width: SCREEN_HEIGHT * 0.05,
    height: SCREEN_HEIGHT * 0.05,
  },
  profileTopViewTopView: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.2,
    position: "relative",
    borderBottomWidth: 1,
    borderColor: "gainsboro",
  },
  profileTopViewTopImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.2,
  },
  profileTopViewMiddleView: {
    position: "absolute",
    borderRadius: 100,
    width: SCREEN_WIDTH * 0.26,
    height: SCREEN_WIDTH * 0.26,
    top: SCREEN_HEIGHT * 0.127,
    left: SCREEN_WIDTH * 0.07,
  },
  profileImageView: {
    borderRadius: 100,
    width: SCREEN_WIDTH * 0.26,
    height: SCREEN_WIDTH * 0.26,
    position: "relative",
  },
  profileDefaultTopView: {
    position: "absolute",
    borderRadius: 100,
    width: SCREEN_WIDTH * 0.26,
    height: SCREEN_WIDTH * 0.26,
    top: SCREEN_HEIGHT * 0.14,
    left: SCREEN_WIDTH * 0.09,
  },
  profileEditDefaultProfileImgButtonView: {
    position: "absolute",
    left: SCREEN_WIDTH * 0.043,
    top: SCREEN_WIDTH * 0.043,
  },
  profileDefaultImageView: {
    borderRadius: 100,
    width: SCREEN_WIDTH * 0.26,
    height: SCREEN_WIDTH * 0.26,
    position: "relative",
  },
  profileDefaultImage: {
    borderRadius: 100,
    width: SCREEN_WIDTH * 0.23,
    height: SCREEN_WIDTH * 0.23,
    borderWidth: 1,
    borderColor: "gray",
  },
  profileImage: {
    borderRadius: 100,
    width: SCREEN_WIDTH * 0.26,
    height: SCREEN_WIDTH * 0.26,
    borderWidth: 1,
    borderColor: "lightgrey",
  },
  
  profileEditDefaultButtonView: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: SCREEN_WIDTH * 0.09,
    height: SCREEN_WIDTH * 0.09,
  },
  profileEditButtonView: {
    position: "absolute",
    bottom: -5,
    right: -10,
    width: SCREEN_WIDTH * 0.09,
    height: SCREEN_WIDTH * 0.09,
  },
  profileEditButtonIcon: {
    width: SCREEN_WIDTH * 0.09,
    height: SCREEN_WIDTH * 0.09,
  },

  profileTopViewBottomView: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.15,
    paddingHorizontal: SCREEN_HEIGHT * 0.02,
    backgroundColor: "white",
    zIndex: -1,
  },
  profileTopViewBottomViewTopView: {
    marginVertical: SCREEN_HEIGHT * 0.01,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  profileTopViewBottomViewName: {
    fontSize: 20,
    fontWeight: "600",
  },
  profileTopViewBottomViewButtonView: {
    flexDirection: "row",
    width: SCREEN_WIDTH * 0.235,
    // justifyContent: "space-between",
    position: "absolute",
    right: SCREEN_WIDTH * 0.00,
    top: SCREEN_HEIGHT * 0.014,
  },
  profileTopViewBottomViewBottomView: {
    width: SCREEN_WIDTH,
    flexDirection: "row",
    marginTop: SCREEN_HEIGHT * 0.01,
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  textFollow: {
    fontSize: 16,
    fontWeight: "600",
  },
  textDescription: {
    fontSize: 14,
  },

  profileEditBackgroundImgButtonView: {
    position: "absolute",
    left: SCREEN_WIDTH * 0.41,
    top: SCREEN_HEIGHT * 0.06,
  },
  profileEditBackgroundImgButtonIcon: {
    opacity: 0.6,
  },
  profileEditProfileImgButtonView: {
    position: "absolute",
    left: SCREEN_WIDTH * 0.058,
    top: SCREEN_WIDTH * 0.058,
  },
  profileEditDefaultProfileImgButtonIcon: {
    opacity: 0.8,
  },
  profileEditProfileImgButtonIcon: {
    opacity: 0.5,
  },
  profileEditTopView: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_HEIGHT * 0.04,
  },
  profileEditUsername: {
    position: "absolute",
    backgroundColor: "white",
    fontSize: 20,
    fontWeight: "600",
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_HEIGHT * 0.04,
    textAlign: "center",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
  },
  
  profileMiddleView: {
    flexDirection: "row",
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.063,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "gainsboro",
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    width: SCREEN_WIDTH * 0.33,
    height: SCREEN_HEIGHT * 0.06,
    backgroundColor: "rgb(249, 250, 208)",
  },
  activeTabButton: {
    backgroundColor: "rgb(235, 233, 152)",
  },

  tabView: {
    width: SCREEN_WIDTH,
  },

  indicatorView: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.3,
    justifyContent: "center",
    alignItems: "center",
  },

  createDogView: {
    width: SCREEN_WIDTH * 0.18,
    height: SCREEN_WIDTH * 0.18,
    position: "absolute",
    bottom: SCREEN_WIDTH * 0.05,
    right: SCREEN_WIDTH * 0.05,
    elevation: 5,
    borderRadius: 100,
  },
  createDogImage: {
    width: SCREEN_WIDTH * 0.19,
    height: SCREEN_WIDTH * 0.19,
  },

});