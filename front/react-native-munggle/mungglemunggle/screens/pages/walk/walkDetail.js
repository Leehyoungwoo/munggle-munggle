import React, { useState } from "react";
import { View, Text, Modal, StyleSheet, Dimensions, TouchableOpacity, Alert } from "react-native";
import axios from "axios";

export default function WalkDetail({ details }) {

  return (
    <View>
      {details.map((detail, index) => (
        <View key={index}>
          <Text>산책 거리: {detail.distance} km</Text>
          <Text>산책 시간: {detail.duration} 분</Text>
          <Text> </Text>
        </View>
      ))}
    </View>
  )
}
