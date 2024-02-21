package com.munggle.webSocket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.munggle.alarm.service.AlarmService;
import com.munggle.dm.dto.DMDto;
import com.munggle.dm.service.ChatMessageService;
import com.munggle.dm.service.DMRoomService;
import com.munggle.domain.model.entity.User;
import com.munggle.jwt.InvalidTokenException;
import com.munggle.jwt.JwtProvider;
import com.munggle.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.*;

import static com.munggle.domain.exception.ExceptionMessage.TOKEN_NOT_AVAILABLE;

@Component
@Slf4j
@RequiredArgsConstructor
public class SocketHandler extends TextWebSocketHandler {

    private Map<String, WebSocketSession> sessions = new HashMap<>();
    private Map<String, Queue<TextMessage>> messages = new HashMap<>();
    private final ObjectMapper objectMapper;
    private final ChatMessageService chatMessageService;
    private final AlarmService alarmService;
    private final UserService userService;
    private final JwtProvider jwtProvider;

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        log.info("payload: " + payload);
        DMDto dmDto = objectMapper.readValue(payload, DMDto.class);
        Long roomId = chatMessageService.findRoomByUsers(dmDto.getSenderId(), dmDto.getReceiver());
        log.info("여기까지 왔다");
        dmDto.setRoomId(roomId);
        chatMessageService.saveMessage(dmDto);
        // 특정 세션에 메시지를 보내는 로직을 추가
        sendMessageToUser(dmDto, message);
    }

    private void sendMessageToUser(DMDto dmDto, TextMessage message) throws JsonProcessingException {
        WebSocketSession receiverSession = findUserSession(dmDto.getReceiver().toString());
        if (receiverSession != null && receiverSession.isOpen()) {
            try {
                receiverSession.sendMessage(message);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        } else {
            addToMessageQueue(dmDto, message);
        }
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.info(session + " 클라이언트가 접속했습니다.");
        String token = session.getHandshakeHeaders()
                .getFirst("Authorization")
                .replace("Bearer", "");

        if (!jwtProvider.validateToken(token)) {
            log.debug("유효하지 않은 토큰입니다.");
            throw new InvalidTokenException(TOKEN_NOT_AVAILABLE);
        }

        Authentication authentication = jwtProvider.getAuthentication(token);
        User principal = (User) authentication.getPrincipal();
        Long id = principal.getId();
        log.debug("senderId : " + id.toString());

        session.getAttributes().put("userId", id);
        saveUserSession(id.toString(), session);

        // 세션이 다시 연결되면 큐에 저장된 메시지를 전송
        sendQueuedMessagesToUser(id, session);
    }

    private WebSocketSession findUserSession(String userId) throws JsonProcessingException {
        // userId를 기반으로 사용자 세션을 찾아 반환하는 로직 구현
        return sessions.get(userId);
    }

    private void addToMessageQueue(DMDto dmDto, TextMessage message) throws JsonProcessingException {
        // 메시지를 큐에 추가하는 로직 구현
        String receiverId = dmDto.getReceiver().toString();
        Queue<TextMessage> messageQueue = messages.get(receiverId);
        if (messageQueue == null) {
            messageQueue = new LinkedList<>();
        }

        messageQueue.offer(new TextMessage(objectMapper.writeValueAsString(dmDto)));
        messages.put(receiverId, messageQueue);
    }

    private void sendQueuedMessagesToUser(Long userId, WebSocketSession session) throws JsonProcessingException {
        // 큐에 저장된 메시지를 사용자에게 전송하는 로직 구현
        String userIdStr = userId.toString();
        Queue<TextMessage> messageQueue = messages.get(userIdStr);

        if (messageQueue == null || messageQueue.isEmpty()) {
            return;
        }

        while (!messageQueue.isEmpty()) {
            TextMessage message = messageQueue.poll();
            String payload = message.getPayload();
            DMDto dmDto = objectMapper.readValue(payload, DMDto.class);
            try {
                session.sendMessage(message);

                User sender = userService.findMemberById(dmDto.getSenderId());
                User receiver = userService.findMemberById(dmDto.getReceiver());

                // dm 알림 생성
                alarmService.insertAlarm("DM", sender, receiver, dmDto.getRoomId());
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        log.info(session + " 클라이언트 접속이 해제되었습니다.");
        String userId = session.getAttributes().get("userId").toString();
        sessions.remove(userId);
    }

    private void saveUserSession(String userId, WebSocketSession session) throws JsonProcessingException {
        // 사용자 세션을 저장하는 로직 구현
        sessions.put(userId, session);
    }
}
