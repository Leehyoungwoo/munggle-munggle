import React, { useState } from "react";
import { View, Text, Modal, StyleSheet, Dimensions, TouchableOpacity, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import WalkDetail from "./walkDetail";
import axios, { Axios } from "axios";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

export default function WalkCalendar() {
  const apiUrl = "http://i10a410.p.ssafy.io:8080";
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filteredDetails, setFilteredDetails] = useState([]);

  const handleDatePress = (date) => {
    setSelectedDate(date);
    const filtered = details.filter(detail => isSameDate(detail.createdAt, date));
    setFilteredDetails(filtered);
    setModalVisible(true);
  };

  const generateMarkedDates = () => {
    const markedDates = {};
    details.forEach(detail => {
      const date = detail.createdAt.split('T')[0];
      markedDates[date] = { marked: true, dotColor: 'red' };
    });
    return markedDates;
  };

  const details = [
    {
      walkId: 2,
      walkName: "산책222",
      dogId: 1,
      description: "2222좋아요",
      duration: 31,
      distance: 600,
      rating: 4,
      isPrivate: false,
      createdAt: "2024-02-08T23:23:22",
      user: {
          id: 1,
          backgroundImgUrl: null,
          profileImgUrl: null,
          nickname: "닉네임을적습니다",
          desc: null
      },
      location: [
          {
              walkId: 2,
              lat: 1.123,
              lng: 2.222,
          },
          {
              walkId: 2,
              lat: 1.133,
              lng: 2.232,
          },
          {
              walkId: 2,
              lat: 1.143,
              lng: 2.242,
          }
      ],
      deleted: false
    },
    {
      walkId: 3,
      walkName: "산책444",
      dogId: 1,
      description: "좋아싫어좋아싫어",
      duration: 45,
      distance: 1200,
      rating: 4,
      isPrivate: false,
      createdAt: "2024-02-09T19:23:22",
      user: {
        id: 1,
        backgroundImgUrl: null,
        profileImgUrl: null,
        nickname: "닉네임을적습니다",
        desc: null
      },
      location: [
        {
          lat: 1.123,
          lng: 2.222,
        },
        {
          lat: 1.133,
          lng: 2.232,
        },
        {
          lat: 1.143,
          lng: 2.242,
        },
      ],
      deleted: false
    },
    {
      walkId: 3,
      walkName: "오늘은무슨날인가",
      dogId: 1,
      description: "산책하는 날이다",
      duration: 20,
      distance: 900,
      rating: 4,
      isPrivate: false,
      createdAt: "2024-02-10T03:23:22",
      user: {
        id: 1,
        backgroundImgUrl: null,
        profileImgUrl: null,
        nickname: "닉네임을적습니다",
        desc: null
      },
      location: [
        {
          lat: 1.123,
          lng: 2.222,
        },
        {
          lat: 1.133,
          lng: 2.232,
        },
        {
          lat: 1.143,
          lng: 2.242,
        },
      ],
      deleted: false
    }
  ];

  const isSameDate = (date1, date2) => {
    const d1 = new Date(date1);
    console.log(d1);
    const d2 = new Date(date2);
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  return (
    <View style={styles.calendarModalBackGround}>
      <View style={styles.calendarModalContainer}>

        <View style={styles.calendarModalTitleContainer}>
          <Text style={styles.calendarModalTitle}>김행복의 2월 산책 기록</Text>
        </View>

        <View style={styles.calendarModalStatistics}>
          <Text style={{marginVertical: SCREEN_HEIGHT * 0.01, marginLeft: SCREEN_WIDTH * 0.2, fontSize: 20, fontWeight: "600",}}>산  책  횟  수 :    3 회</Text>
          <Text style={{marginVertical: SCREEN_HEIGHT * 0.01, marginLeft: SCREEN_WIDTH * 0.2, fontSize: 20, fontWeight: "600",}}>산책 총 거리 :    3.2 km</Text>
          <Text style={{marginVertical: SCREEN_HEIGHT * 0.01, marginLeft: SCREEN_WIDTH * 0.2, fontSize: 20, fontWeight: "600",}}>산책 총 시간 :    1 시간 32 분</Text>
        </View>

        <View style={styles.calendarModalCalendarContainer}>
          <Calendar
            style={styles.calendarModalCalendar}
            onDayPress={(day) => handleDatePress(day.dateString)}
            markedDates={generateMarkedDates()}
          />
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>Selected Date: {selectedDate}</Text>
              <Text> </Text>
              <WalkDetail details={filteredDetails} />
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.close}>
                <Text style={styles.closeText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  calendarModalBackGround: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  calendarModalContainer: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.8,
    borderWidth: 1,
    backgroundColor: "white",
  },
  calendarModalTitleContainer: {
  },
  calendarModalTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  calendarModalStatistics: {
    borderWidth: 1,
    width: SCREEN_WIDTH * 0.895,
    height: SCREEN_HEIGHT * 0.3,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  calendarModalCalendar: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    width: SCREEN_WIDTH * 0.895,
    height: SCREEN_HEIGHT * 0.12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  close: {
  },
  closeText: {
    color: 'blue',
    marginTop: 10
  },
});