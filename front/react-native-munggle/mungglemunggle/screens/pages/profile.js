import React from "react";
import { View, Text, Button, Image, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from "react-native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import ProfileDog from "./profile/profileDog";
import ProfilePost from "./profile/profilePost";
import ProfileScrap from "./profile/profileScrap";

import iconDog from "../../assets/icons/profileDog.png";
import iconPost from "../../assets/icons/profilePost.png";
import iconScrap from "../../assets/icons/profileScrap.png";
import iconDirectMessage from "../../assets/icons/directMessage.png";

import imgProfile1 from "../../assets/sample/profile1.jpg";
import imgProfile2 from "../../assets/sample/profile2.jpg";
import imgProfile3 from "../../assets/sample/profile3.jpg";
import imgProfile4 from "../../assets/sample/profile4.jpg";
import imgProfile5 from "../../assets/sample/profile5.jpg";
import imgProfile6 from "../../assets/sample/profile6.jpg";

import imgPost1 from "../../assets/sample/dog1.jpg";
import imgPost2 from "../../assets/sample/dog2.jpg";
import imgPost3 from "../../assets/sample/dog3.jpg";
import imgPost4 from "../../assets/sample/dog4.jpg";
import imgPost5 from "../../assets/sample/dog5.jpg";
import imgPost6 from "../../assets/sample/dog6.jpg";
import imgPost7 from "../../assets/sample/dog7.jpg";
import imgPost8 from "../../assets/sample/dog8.jpg";
import imgPost9 from "../../assets/sample/dog9.jpg";
import imgPost10 from "../../assets/sample/dog10.jpg";

import FollowButton from "../../components/followButton";
import DirectMessageButton from "../../components/directMessageButton";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

const Tab = createMaterialTopTabNavigator();

export default function ProfileScreen ( {navigation} ) {
  const userProfile = {
    backGroundImg: imgPost1,
    profileImg: imgProfile1,
    name: "행복이아빠",
    isFollow: false,
    description: "소소하게 자주 즐겁게 행복하기. 행복이 행복이 행복이 행복이 행복이 행복이 행복이 행복이",
    follower: 2,
    following: 3,
    dogs: [
      {
        img: imgPost1,
        name: "김행복",
        kind: "웰시코기",
        weight: 2.8,
        birthDate: "22.02.08",
        gender: "남자",
      },
      {
        img: imgPost2,
        name: "댕댕이",
        kind: "리트리버",
        weight: 12.3,
        birthDate: "22.02.08",
        gender: "여자",
      },
    ]
  } 

  const postList = [
    {
      id: 1,
      user : {
        imgProfile: imgProfile1,
        name: 'user1',
        isFollow: false,
      },
      imgPost: imgPost1,
      title: "산책하는 댕댕이",
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
      createdAt: "2024-01-17",
      tagList: [
        "산책", "코기", "신났네",
      ],
    },
    {
      id: 2,
      user : {
        imgProfile: imgProfile2,
        name: 'user2',
        isFollow: false,
      },
      imgPost: imgPost2,
      title: "애기랑 오랜만에 공원",
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
      createdAt: "2024-01-17",
      tagList: [
        "산책", "아구", "힘들어?",
      ],
    },
    {
      id: 3,
      user : {
        imgProfile: imgProfile3,
        name: 'user3',
        isFollow: false,
      },
      imgPost: imgPost3,
      title: "귀여워라",
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
      createdAt: "2024-01-17",
      tagList: [
        "신남", "댕글댕글",
      ],
    },
    {
      id: 4,
      user : {
        imgProfile: imgProfile4,
        name: 'user4',
        isFollow: false,
      },
      imgPost: imgPost4,
      title: "산책하는 댕댕이",
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
      createdAt: "2024-01-17",
      tagList: [
        "산책", "댕댕이", "신났네",
      ],
    },
    {
      id: 5,
      user : {
        imgProfile: imgProfile5,
        name: 'user5',
        isFollow: false,
      },
      imgPost: imgPost5,
      title: "산책하는 댕댕이",
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
      createdAt: "2024-01-17",
      tagList: [
        "산책", "댕댕이", "신났네",
      ],
    },
    {
      id: 6,
      user : {
        imgProfile: imgProfile6,
        name: 'user6',
        isFollow: false,
      },
      imgPost: imgPost6,
      title: "산책하는 댕댕이",
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
      createdAt: "2024-01-17",
      tagList: [
        "산책", "댕댕이", "신났네",
      ],
    },
    {
      id: 7,
      user : {
        imgProfile: imgProfile1,
        name: 'user7',
        isFollow: false,
      },
      imgPost: imgPost7,
      title: "산책하는 댕댕이",
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
      createdAt: "2024-01-17",
      tagList: [
        "산책", "댕댕이", "신났네",
      ],
    },
    {
      id: 8,
      user : {
        imgProfile: imgProfile2,
        name: 'user8',
        isFollow: false,
      },
      imgPost: imgPost8,
      title: "산책하는 댕댕이",
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
      createdAt: "2024-01-17",
      tagList: [
        "산책", "댕댕이", "신났네",
      ],
    },
    {
      id: 9,
      user : {
        imgProfile: imgProfile3,
        name: 'user9',
        isFollow: false,
      },
      imgPost: imgPost9,
      title: "산책하는 댕댕이",
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
      createdAt: "2024-01-17",
      tagList: [
        "산책", "댕댕이", "신났네",
      ],
    },
    {
      id: 10,
      user : {
        imgProfile: imgProfile4,
        name: 'user10',
        isFollow: false,
      },
      imgPost: imgPost10,
      title: "산책하는 댕댕이",
      content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
      createdAt: "2024-01-17",
      tagList: [
        "산책", "댕댕이", "신났네",
      ],
    },
  ]
  
  return (
    <ScrollView style={styles.profileContainer}>
      <View style={styles.profileTopView}>
        <View style={styles.profileTopViewTopView}>
          <Image 
            style={styles.profileTopViewTopView}
            source={imgPost1}
          />
        </View>
        <View style={styles.profileTopViewMiddleView}>
          <Image 
            style={styles.profileTopViewMiddleViewImage}
            source={imgProfile1}
          />
        </View>
        <View style={styles.profileTopViewBottomView}>
          <View style={styles.profileTopViewBottomViewTopView}>
            <Text style={styles.profileTopViewBottomViewName}>{ userProfile.name }</Text>
            <View style={styles.profileTopViewBottomViewButtonView}>
              <FollowButton />
              <DirectMessageButton />
            </View>
          </View>
          <View style={styles.profileTopViewBottomViewBottomView}>
            <Text style={styles.textFollow}>팔로워 {userProfile.follower}</Text>
            <Text style={{...styles.textFollow, marginLeft:SCREEN_HEIGHT * 0.02}}>팔로잉 {userProfile.following}</Text>
          </View>
          <Text style={styles.textDescription}>{userProfile.description}</Text>
        </View>
      </View>
      <View style={styles.profileBottomView}>
        <Tab.Navigator
          initialRouteName="Dog"
          screenOptions={{
            tabBarShowLabel: false,
            tabBarStyle: {
              height: SCREEN_HEIGHT * 0.06,
            },
            tabBarItemStyle: {
              height: SCREEN_HEIGHT * 0.06,
            },
          }}
        >
          <Tab.Screen 
            name="Dog" 
            children={() => <ProfileDog dogList={userProfile.dogs} />}
            options={{
              tabBarIcon: () => (
                <Image
                  style={styles.profileTabBarIcon}
                  source={iconDog}
                />
              ),
            }}
          />
          <Tab.Screen 
            name="Post" 
            children={() => <ProfilePost postList={postList} />} 
            options={{
              tabBarIcon: () => (
                <Image
                  style={styles.profileTabBarIcon}
                  source={iconPost}
                />
              ),
            }}
          />
          <Tab.Screen 
            name="Scrap" 
            children={() => <ProfileScrap postList={postList} />} 
            options={{
              tabBarIcon: () => (
                <Image
                  style={styles.profileTabBarIcon}
                  source={iconScrap}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    width: SCREEN_WIDTH,
    flex: 1,
    height: SCREEN_HEIGHT * 0.82,
  },
  profileTopView: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.35,
    position: "relative",
  },
  profileBottomView: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 2,
  },
  profileTabBarIcon: {
    width: SCREEN_HEIGHT * 0.04,
    height: SCREEN_HEIGHT * 0.04,
    marginTop: -5,
    marginLeft: -5,
  },
  profileTopViewTopView: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.2,
  },
  profileTopViewMiddleView: {
    position: "absolute",
    borderRadius: 100,
    width: 100,
    height: 100,
    top: SCREEN_HEIGHT * 0.133,
    left: SCREEN_WIDTH * 0.07,
  },
  profileTopViewMiddleViewImage: {
    borderRadius: 100,
    width: 100,
    height: 100,
  },
  profileTopViewBottomView: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.15,
    paddingHorizontal: SCREEN_HEIGHT * 0.02,
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
    justifyContent: "space-between",
    position: "absolute",
    right: SCREEN_WIDTH * 0.01,
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
});