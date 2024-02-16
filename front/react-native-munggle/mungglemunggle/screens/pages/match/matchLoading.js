import React, { useState , useEffect } from 'react';
import { Image, View, StyleSheet, Dimensions, Text } from 'react-native';
import dog from '../../../assets/gifs/dog.gif';
import { useNavigation } from "@react-navigation/native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function MatchLoading() {

  const navigation = useNavigation();
  const [matchingText, setMatchingText] = useState('매칭중.');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMatchingText((prevText) => {
        if (prevText === '매칭중.') {
          return '매칭중..';
        } else if (prevText === '매칭중..') {
          return '매칭중...';
        } else {
          return '매칭중.';
        }
      });
    }, 1000);

    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      navigation.navigate('MatchStart');
    }, 3500);

    return () => {clearInterval(intervalId);
    clearTimeout(timeoutId);}
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <Image source={dog} style={{ width: SCREEN_WIDTH * 0.7, height: SCREEN_WIDTH * 0.7, }} />
      </View>
      <View style={styles.middleView}>
        <Text style={styles.text}>{matchingText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(253, 245, 169)',
  },
  topView:{
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.2,
    backgroundColor: "rgb(253, 245, 169)",
    alignItems: "center",
    justifyContent: "center",
  },
  middleView:{
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SCREEN_HEIGHT * 0.18,
  },
  text:{
    fontSize:35
  }
});
