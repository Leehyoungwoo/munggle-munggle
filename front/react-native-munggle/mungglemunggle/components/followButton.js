import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";

import axios from "axios";

const { height: SCREEN_HEIGHT } = Dimensions.get("window")

export default function FollowButton (props) {  
  const [isFollowed, setIsFollowed] = useState(props.isFollowed);

  const apiUrl = "http://i10a410.p.ssafy.io:8080";
  
  const getIsFollowed = async () => {
    await axios.get(
      `${apiUrl}/follows/follow-check/${props.userId}`,
      {headers: {
        "Authorization": props.authToken ,
      }}
    ).then(async (res) => {
      console.log(res.data);
      setIsFollowed(res.data);
      await changeIsFollowed(res.data);
    }).catch((err) => {
      console.log(err);
    })
  };

  const changeIsFollowed = async (isFollow) => {
    if (!isFollow) {
      await axios.post(
        `${apiUrl}/follows/${props.userId}`,
        {headers: {
          "Authorization": props.authToken ,
        }}
      ).then((res) => {
        console.log(res.status);
        setIsFollowed(!isFollow);
      }).catch((err) => {
        console.log(err);
      })
    } else {
      await axios.delete(
        `${apiUrl}/follows/${props.userId}`,
        {headers: {
          "Authorization": props.authToken ,
        }}
      ).then((res) => {
        console.log(res.status);
        setIsFollowed(!isFollow);
      }).catch((err) => {
        console.log(err);
      })
    }
  }

  const handleFollow = async () => {   
    await getIsFollowed();
  };
  
  return (
    <TouchableOpacity 
      style={styles.followButtonView}
      onPress={() => handleFollow()}
    >
      <Text style={styles.followButtonText}>{!isFollowed ? "팔로우" : "팔로잉" }</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  followButtonView: {
    width: SCREEN_HEIGHT * 0.07,
    height: SCREEN_HEIGHT * 0.04,
    backgroundColor: "rgb(253, 245, 169)",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: "gainsboro",
  },
  followButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
