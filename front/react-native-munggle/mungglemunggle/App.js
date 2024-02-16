import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Dimensions, Modal } from 'react-native';
import * as Font from "expo-font";

import AsyncStorage from '@react-native-async-storage/async-storage';

import Body from './screens/layout/body';
import Nav from './screens/layout/nav';

import LoginScreen from './screens/pages/login';

import Search from './components/modal/search';
import Notification from './components/modal/notification';
import DirectMessage from './components/modal/directMessage';

// nav : 10 %
// body : 82 %
// footer : 8 %

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

const getFonts = () => Font.loadAsync({
  "pretendard": require("./assets/fonts/Pretendard-Regular.ttf"),
});

export default function App() {
  console.log(AsyncStorage.getItem("isLogin"));
  
  const [isLogin, setIsLogin] = useState(false);
  
  const logIn =  () => {
    setIsLogin(true);
    AsyncStorage.setItem("isLogin", "true")
    .then(AsyncStorage.getItem("isLogin")
    .then((value) => console.log(value)));
  };

  const logOut = () => {
    AsyncStorage.setItem("isLogin", "false")
    .then(setIsLogin(false));
  };

  useEffect(() => {
    getFonts;
    AsyncStorage.setItem("API_URL", "http://i10a410.p.ssafy.io:8080");
  }, []);

  useEffect(() => {
    if (!isLogin) {
      AsyncStorage.getItem("isLogin")
      .then((value) => setIsLogin(value === "true"));
    }
  }, [isLogin])

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const openSearchModal = () => { setIsSearchModalOpen(true) }; 
  const closeSearchModal = () => { setIsSearchModalOpen(false) }; 
  

  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const openNotificationModal = () => { setIsNotificationModalOpen(true) }; 
  const closeNotificationModal = () => { setIsNotificationModalOpen(false) }; 
  
  const [isDirectMessageModalOpen, setIsDirectMessageModalOpen] = useState(false);

  const openDirectMessageModal = () => { setIsDirectMessageModalOpen(true) }; 
  const closeDirectMessageModal = () => { setIsDirectMessageModalOpen(false) }; 

  if (isLogin) {
    return (
      <View style={styles.container}>
        <View style={{ width: SCREEN_WIDTH, flex: 1}}>
          <Nav
            logOut={logOut}
            openSearchModal={openSearchModal} 
            openNotificationModal={openNotificationModal}
            openDirectMessageModal={openDirectMessageModal} 
            style={{ width: SCREEN_WIDTH, flex: 1}}
          />
        </View>
        
        <View style={{ width: SCREEN_WIDTH, flex: 9}}>
          <Body style={{ width: SCREEN_WIDTH, flex: 1}}/>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={isSearchModalOpen}
          onRequestClose={() => closeSearchModal()}>
          <Search closeSearchModal={closeSearchModal} />
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={isNotificationModalOpen}
          onRequestClose={() => closeNotificationModal()}>
          <Notification closeNotificationModal={closeNotificationModal} />
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={isDirectMessageModalOpen}
          onRequestClose={() => closeDirectMessageModal()}>
          <DirectMessage closeDirectMessageModal={closeDirectMessageModal} />
        </Modal>
      </View>
    );
  } else {
    return (
      // <PostCreate logIn={logIn} setIsLogin={setIsLogin} />
      <LoginScreen logIn={logIn} setIsLogin={setIsLogin} />
    );
  }

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    flex: 1,
  },
});