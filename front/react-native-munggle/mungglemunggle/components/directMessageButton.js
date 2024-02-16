import React from "react";
import { TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import iconDirectMessage from "../assets/icons/directMessage.png";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

export default function DirectMessageButton () {
  return (
    <TouchableOpacity style={styles.iconDirectMessageView}>
      <Image 
        style={styles.iconDirectMessage}
        source={iconDirectMessage}
        />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconDirectMessageView: {
    width: SCREEN_HEIGHT * 0.04,
    height: SCREEN_HEIGHT * 0.04,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(253, 245, 169)",
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderWidth: 1,
    borderColor: "gainsboro",
  },
  iconDirectMessage: {
    width: SCREEN_HEIGHT * 0.028,
    height: SCREEN_HEIGHT * 0.027,
    borderRadius: 8,
  },
});
