import React, { useState } from "react";
import { View, Text, Image,
  TouchableOpacity,
  Switch, StatusBar
} from "react-native";

export default function NotificationSetting (props) {
  const [alarmSetting, setAlarmSetting] = useState(props.alarmSetting);

  const toggleSwitch = (index) => {
    const newSettings = [...alarmSetting];
    newSettings[index] = !newSettings[index];
    setAlarmSetting(newSettings);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' }}>
      <StatusBar backgroundColor="rgba(0,0,0,0.2)" />
      <View style={{ backgroundColor: 'white', padding: 16, width: 300, elevation: 5, borderRadius: 10, }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, paddingBottom: 10, borderColor: "gainsboro", }}>
          <View style={{ width: 24, height: 24 }} />
          <View>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>알림 설정</Text>
          </View>
          <TouchableOpacity onPress={props.closeNotificationSettingModal}>
            <Image source={require('../../assets/icons/close1.png')} style={{ width: 24, height: 24 }} />
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text>좋아요</Text>
            <Switch value={alarmSetting[0]} onValueChange={() => toggleSwitch(0)} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text>댓글</Text>
            <Switch value={alarmSetting[1]} onValueChange={() => toggleSwitch(1)} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>팔로우</Text>
            <Switch value={alarmSetting[2]} onValueChange={() => toggleSwitch(2)} />
          </View>
        </View>
      </View>
    </View>
  );
}