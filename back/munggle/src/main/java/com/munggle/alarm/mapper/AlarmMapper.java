package com.munggle.alarm.mapper;

import com.munggle.alarm.dto.AlarmCreateDto;
import com.munggle.alarm.dto.AlarmDetailDto;
import com.munggle.domain.model.entity.Alarm;
import com.munggle.domain.model.entity.User;
import com.munggle.domain.model.entity.type.AlarmType;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class AlarmMapper {

    public static Alarm toEntity(AlarmCreateDto alarm, User from, User to, AlarmType type) {

        return Alarm.builder()
                .alarmType(type)
                .fromUser(from)
                .toUser(to)
                .targetId(alarm.getTarget())
                .isChecked(false)
                .build();
    }

    public static AlarmDetailDto toAlarmDetailDto(Alarm alarm) {
        return AlarmDetailDto.builder()
                .alarmId(alarm.getId())
                .alarmType(alarm.getAlarmType().toString())
                .fromUserId(alarm.getFromUser().getId())
                .targetId(alarm.getTargetId())
                .isChecked(alarm.getIsChecked())
                .build();
    }

}
