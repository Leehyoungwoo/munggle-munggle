import React, { useState, useEffect } from 'react';
import { View, Text, Image, Switch, 
  Button, ScrollView, StyleSheet,
  Dimensions, TouchableOpacity
} from "react-native";
import { createStackNavigator } from '@react-navigation/stack';
import MatchLoading from './match/matchLoading';
import MatchMain from './match/matchMain';
import MatchResult from './match/matchResult';
import MatchStart from './match/matchStart';
import MatchMySetting from './match/matchMySetting';
import MatchWantSetting from './match/matchWantSetting';

const Stack = createStackNavigator();

export default function MatchScreen () {
  
  return (
      <Stack.Navigator 
        initialRouteName="MatchMain" 
        screenOptions={{
          headerShown:false
        }}
      >
        {/*매칭시작, 정보 수정 등등 있는 페이지*/}
        <Stack.Screen name="MatchMain" component={MatchMain} />
        {/*start페이지 로드 전 3.5초 동안 등장*/}
        <Stack.Screen name="MatchLoading" component={MatchLoading} />
        {/*카드들 보이는 페이지*/}
        <Stack.Screen name="MatchStart" component={MatchStart} />
        {/*수락한 카드들 나열, dm버튼 누르면 모달로 생성*/}
        <Stack.Screen name="MatchResult" component={MatchResult} />
        <Stack.Screen name="MatchMySetting" component={MatchMySetting} />
        <Stack.Screen name="MatchWantSetting" component={MatchWantSetting} />
      </Stack.Navigator>
  );
};
