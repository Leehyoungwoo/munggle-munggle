import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

export default function ProfileCircle (props) {
  return (
    <View style={styles.profileCircleContainer}>
      <TouchableOpacity style={styles.profileCircleImageView}>
        <Image 
          style={styles.profileCircleImage}
          src={props.imageProfile}
        />
        <View style={styles.profileCircleNameView}>
          <Text style={styles.profileCircleName}>{ props.nameProfile }</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create ({
  profileCircleContainer: {
    width: 100,
    height: 115,
    justifyContent: "center",
    alignItems: "center",
  },
  profileCircleImageView: {
    borderRadius: 100,
  },
  profileCircleImage: {
    borderRadius: 100,
    borderColor: "lightgrey",
    borderWidth: 1,
    width: 90,
    height: 90,
  },
  profileCircleNameView: {
    width: 90,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  profileCircleName: {
    fontSize: 15,
    fontWeight: "500",
  },
}); 