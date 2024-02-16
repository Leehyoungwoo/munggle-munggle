import React, { useEffect } from "react";
import { Dimensions, Image, StyleSheet } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useNavigation } from '@react-navigation/native';

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


const TabBarIcon = ({ image }) => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', (e) => {
      console.log("Current Screen:", e.data.state.routes[e.data.state.index].name);
    });

    return unsubscribe;
  }, [navigation]);

  return <Image style={styles.tabBarIcon} source={image} />;
};

export default function Body () {
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
          tabBarIcon: () => <TabBarIcon image={iconPost} />,
        }}
      />
      <Tab.Screen
        name="Walk"
        style={{flex: 1,}}
        component={WalkScreen}
        options={{
          tabBarIcon: () => <TabBarIcon image={iconWalk} />,
        }}
      />
      <Tab.Screen
        name="Match"
        style={{flex: 1,}}
        component={MatchScreen}
        options={{
          tabBarIcon: () => <TabBarIcon image={iconMatch} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        style={{flex: 1,}}
        component={ProfileScreen}
        options={{
          tabBarIcon: () => <TabBarIcon image={iconProfile} />,
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