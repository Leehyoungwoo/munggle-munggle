import React from "react";
import { Dimensions, Image, StyleSheet } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from '@react-navigation/native';

import PostScreen from "../pages/post";
import MatchScreen from "../pages/match";
import WalkScreen from "../pages/walk";
import ProfileScreen from "../pages/profile";

import iconPost from "../../assets/icons/post.png";
import iconWalk from "../../assets/icons/walk.png";
import iconMatch from "../../assets/icons/match.png";
import iconProfile from "../../assets/icons/profile.png";

const Tab = createBottomTabNavigator();
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

export default function Body (navigation) {
  return (
    <NavigationContainer style={{flex: 1,}}>
      <Tab.Navigator
      style={{flex: 1,}}
      initialRouteName="Post"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#e91e63',
        tabBarStyle: {
          height: SCREEN_HEIGHT * 0.08,
        },
        tabBarItemStyle: {
          width: SCREEN_HEIGHT * 0.08,
          height: SCREEN_HEIGHT * 0.08,
        },
      }}
    >

      <Tab.Screen
        name="Post"
        style={{flex: 1,}}
        component={PostScreen}
        options={{
          tabBarIcon: () => (
            <Image
              style={styles.tabBarIcon}
              source={iconPost}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Walk"
        style={{flex: 1,}}
        component={WalkScreen}
        options={{
          tabBarIcon: () => (
            <Image
              style={styles.tabBarIcon}
              source={iconWalk}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Match"
        style={{flex: 1,}}
        component={MatchScreen}
        options={{
          tabBarIcon: () => (
            <Image
              style={styles.tabBarIcon}
              source={iconMatch}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        style={{flex: 1,}}
        component={ProfileScreen}
        options={{
          tabBarIcon: () => (
            <Image
              style={styles.tabBarIcon}
              source={iconProfile}
            />
          ),
        }}
      />
    </Tab.Navigator>
  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBarIcon: {
    width: SCREEN_HEIGHT * 0.06,
    height: SCREEN_HEIGHT * 0.06,
  }
})