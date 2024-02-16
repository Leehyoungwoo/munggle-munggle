import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet,
  TouchableOpacity, Dimensions, FlatList,
  Modal
} from "react-native";

import NotificationSetting from "./notificationSetting";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")


export default function Notification (props) {

  const [isNotificationSettingModal, setIsNotificationSettingModal] = useState(false);

  const openNotificationSettingModal = () => {
    setIsNotificationSettingModal(true);
  };

  const closeNotificationSettingModal = () => {
    setIsNotificationSettingModal(false);
  };

  const [alarmSetting, setAlarmSetting] = useState([true, true, true]);

  const [alarms, setAlarms] = useState([
    {
      action: 1,
      profileurl: "https://cdn.newspenguin.com/news/photo/202103/4248_13477_1138.jpg",
      nickname: "aaaaaaaaaaaasdasdasdaaaaaaaaaaaaa",
      memberNo: 123,
      registDate: "2024-02-11T11:11:11",
      isRead: false,
    },
    {
      action: 1,
      profileurl: "https://cdn.newspenguin.com/news/photo/202103/4248_13477_1138.jpg",
      nickname: "aa",
      memberNo: 123,
      registDate: "2024-02-11T07:11:11",
      isRead: true,
    },
    {
      action: 1,
      profileurl: "https://cdn.newspenguin.com/news/photo/202103/4248_13477_1138.jpg",
      nickname: "aa",
      memberNo: 123,
      registDate: "2024-02-09T11:11:11",
      isRead: false,
    },
    {
      action: 1,
      profileurl: "https://cdn.newspenguin.com/news/photo/202103/4248_13477_1138.jpg",
      nickname: "aa",
      memberNo: 123,
      registDate: "2024-01-02T11:11:11",
      isRead: false,
    },
    {
      action: 1,
      profileurl: "https://cdn.newspenguin.com/news/photo/202103/4248_13477_1138.jpg",
      nickname: "aa",
      memberNo: 123,
      registDate: "2020-02-02T11:11:11",
      isRead: true,
    },
    {
      action: 1,
      profileurl: "https://cdn.newspenguin.com/news/photo/202103/4248_13477_1138.jpg",
      nickname: "aa",
      memberNo: 123,
      registDate: "2020-02-02T11:11:11",
      isRead: false,
    },
    {
      action: 1,
      profileurl: "https://cdn.newspenguin.com/news/photo/202103/4248_13477_1138.jpg",
      nickname: "aa",
      memberNo: 123,
      registDate: "2020-02-02T11:11:11",
      isRead: false,
    },
    {
      action: 1,
      profileurl: "https://cdn.newspenguin.com/news/photo/202103/4248_13477_1138.jpg",
      nickname: "aa",
      memberNo: 123,
      registDate: "2020-02-02T11:11:11",
      isRead: false,
    },
    {
      action: 1,
      profileurl: "https://cdn.newspenguin.com/news/photo/202103/4248_13477_1138.jpg",
      nickname: "aa",
      memberNo: 123,
      registDate: "2020-02-02T11:11:11",
      isRead: false,
    },
    {
      action: 1,
      profileurl: "https://cdn.newspenguin.com/news/photo/202103/4248_13477_1138.jpg",
      nickname: "aa",
      memberNo: 123,
      registDate: "2020-02-02T11:11:11",
      isRead: false,
    },
    {
      action: 1,
      profileurl: "https://cdn.newspenguin.com/news/photo/202103/4248_13477_1138.jpg",
      nickname: "aa",
      memberNo: 123,
      registDate: "2020-02-02T11:11:11",
      isRead: false,
    },
    {
      action: 2,
      profileurl: "https://cdn.newspenguin.com/news/photo/202103/4248_13477_1138.jpg",
      nickname: "bb",
      articleNo: 12,
      memberNo: 123,
      contents: "댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용댓글내용",
      registDate: "2020-02-02T11:11:11",
      isRead: false,
    },
    {
      action: 3,
      profileurl: "https://cdn.newspenguin.com/news/photo/202103/4248_13477_1138.jpg",
      nickname: "cc",
      articleNo: 12,
      memberNo: 123,
      registDate: "2020-02-02T11:11:11",
      isRead: false,
    }
  ]);

  const [filterItem, setFilterItem] = useState(alarms);//설정 기준으로 필터링

  useEffect(() => {
    const filteredAlarms = alarms.filter(item => alarmSetting[item.action - 1]);
    setFilterItem(filteredAlarms);
  }, [alarmSetting]);

  //각각의 알람 내용
  const renderAlarmItem = ({ item }) => {
    const formattedDate = getTimeDifference(item.registDate);
    const message = getMessageByAction(item);
    const readMessageStyle = {
      opacity: 0.5,
    };
    return (
      <View style={{alignItems:'center', flexDirection: 'row', marginVertical: 10, marginHorizontal: 10, ...(item.isRead ? readMessageStyle : {})}}>
        <Image source={{ uri: item.profileurl }} style={{ width: SCREEN_WIDTH*0.12, height: SCREEN_WIDTH*0.12, borderRadius: 25, marginRight: SCREEN_WIDTH*0.03 }} />
        <View style={{ flex: 1 }}>
          <Text>{message}</Text>
          <Text style={{ color: 'gray' }}>{formattedDate}</Text>
        </View>
        <TouchableOpacity>
          <Image source={require('../../assets/icons/next.png')} style={{ width: SCREEN_WIDTH*0.06, height: SCREEN_WIDTH*0.06 }} />
        </TouchableOpacity>
      </View>
    );
  };

  //현재시간, 알람시간 차이 계산
  function getTimeDifference(registDate) {
    const currentDate = new Date();
    const targetDate = new Date(registDate);
    const timeDifference = currentDate - targetDate;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (seconds < 60) {
      return `${seconds}초 전`;
    } else if (minutes < 60) {
      return `${minutes}분 전`;
    } else if (hours < 24) {
      return `${hours}시간 전`;
    } else if (days < 30) {
      return `${days}일 전`;
    } else if (months < 12) {
      return `${months}개월 전`;
    } else {
      return `${years}년 전`;
    }
  }

  const getMessageByAction = (item) => {
    switch (item.action) {
      case 1:
        return `${item.nickname}님이 회원님을 팔로우하기 시작했습니다.`;
      case 2:
        return `${item.nickname}님이 댓글을 남겼습니다: ${item.contents}`;
      case 3:
        return `${item.nickname}님이 회원님의 게시물을 좋아합니다.`;
      default:
        return '';
    }
  };

  return (
    <View style={styles.notificationModalBackGround}>
      <View style={styles.notificationModalContainer}>
          <View style={styles.notificationTopView}>
            {/* 최상단 */}
            {/* 톱니바퀴 이미지 버튼 */}
            <TouchableOpacity onPress={() => openNotificationSettingModal()}>
              <Image source={require('../../assets/icons/setting.png')} style={{ width: 24, height: 24 }} />
            </TouchableOpacity>
            {/* 알람이라는 글씨 */}
            <View>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>알림</Text>
            </View>
            {/* 뒤로가기 이미지 버튼 */}
            <TouchableOpacity onPress={props.closeNotificationModal}>
              <Image source={require('../../assets/icons/close1.png')} style={{ width: 24, height: 24 }} />
            </TouchableOpacity>
          </View>
          <View style={styles.notificationMiddleView}>
            <FlatList
              data={filterItem}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderAlarmItem}
              style={{ flex: 1 }}
            />
          </View>

      <Modal
        transparent={true}
        visible={isNotificationSettingModal}
        onRequestClose={closeNotificationSettingModal}
      >
        <NotificationSetting closeNotificationSettingModal={closeNotificationSettingModal} alarmSetting={alarmSetting} />
      </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  notificationModalBackGround: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  notificationModalContainer: {
    alignItems: "center",
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.8,
    marginBottom: SCREEN_HEIGHT * 0.015,
    position: "relative",
    borderWidth: 1,
    borderColor: "lightgrey",
    backgroundColor: "white",
    elevation: 5,
    borderRadius: 10,
  },

  notificationTopView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SCREEN_HEIGHT * 0.01,
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT * 0.04,
    paddingHorizontal: SCREEN_HEIGHT * 0.01,
    borderBottomWidth: 1,
    borderColor: "gainsboro",
  },

  notificationMiddleView: {
    marginTop: SCREEN_HEIGHT * 0.01,
    width: SCREEN_WIDTH * 0.9,
    height: '90%',
    justifyContent: "center",
    flexDirection: "row",
  },
});