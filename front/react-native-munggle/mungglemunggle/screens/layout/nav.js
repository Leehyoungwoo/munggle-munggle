import React from "react";
import { View, Text, StyleSheet, 
  Image, Dimensions, TouchableOpacity,
} from "react-native";

import imageLogo from "../../assets/icons/logo.png"
import iconSearch from "../../assets/icons/search.png"
import iconNotification from "../../assets/icons/notification.png"
import iconDirectMessage from "../../assets/icons/directMessage.png"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

export default function Nav (props) {
  return (
    <View style={styles.navContainer}>
      <TouchableOpacity style={styles.navLogoView}>
        <Image 
          style={styles.navLogoImage}
          source={imageLogo}
        />
      </TouchableOpacity>
      <TouchableOpacity
       onPress={props.logOut}
       style={styles.navLogout}
      >
        <Text style={styles.navLogoutText}>로그아웃</Text>
      </TouchableOpacity>
      <View style={styles.navIconView}>
        <TouchableOpacity 
          style={styles.navIconSearchView}
          onPress={props.openSearchModal}  
        >
          <Image 
            style={styles.navIconSearch}
            source={iconSearch}
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navIconNotificationView}
          onPress={props.openNotificationModal}
        >
          <Image 
            style={styles.navIconNotification}
            source={iconNotification}
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navIconDirectMessageView}
          onPress={props.openDirectMessageModal}
        >
          <Image 
            style={styles.navIconDirectMessage}
            source={iconDirectMessage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create ({
  navContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.08,
    paddingTop: SCREEN_HEIGHT * 0.03,
    borderBottomWidth: 1,
    borderBottomColor: "gainsboro",
  },
  navLogoView: {
    flex: 1,
    height: SCREEN_HEIGHT * 0.06,
    alignItems: "start",
    justifyContent: "center",
  },
  navLogoImage: {
    marginLeft: SCREEN_WIDTH * 0.05,
    width: SCREEN_WIDTH * 0.2,
    height: SCREEN_HEIGHT * 0.05,
  },
  navIconView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_HEIGHT * 0.06,
  },
  navIconSearchView: {
    width: SCREEN_WIDTH * 0.065,
    height: SCREEN_HEIGHT * 0.031,
    marginHorizontal: SCREEN_WIDTH * 0.015,
    marginTop: SCREEN_HEIGHT * 0.017,
  },
  navIconSearch: {
    width: SCREEN_WIDTH * 0.065,
    height: SCREEN_HEIGHT * 0.031,
  },
  navIconNotificationView: {
    width: SCREEN_WIDTH * 0.075,
    height: SCREEN_HEIGHT * 0.037,
    marginHorizontal: SCREEN_WIDTH * 0.015,
    marginTop: SCREEN_HEIGHT * 0.015,
  },
  navIconNotification: {
    width: SCREEN_WIDTH * 0.075,
    height: SCREEN_HEIGHT * 0.037,
  },
  navIconDirectMessageView: {
    width: SCREEN_WIDTH * 0.075,
    height: SCREEN_HEIGHT * 0.037,
    marginHorizontal: SCREEN_WIDTH * 0.015,
    marginTop: SCREEN_HEIGHT * 0.017,
  },
  navIconDirectMessage: {
    width: SCREEN_WIDTH * 0.075,
    height: SCREEN_HEIGHT * 0.037,
  },
  navLogout: {
    borderWidth: 1,
    borderColor: "gainsboro",
    borderRadius: 5,
    padding: 5,
    marginTop: 10,
  },
  navLogoutText: {
    color: "gainsboro",
  },
});