import React, { useEffect, useRef, useState } from "react";
import { Button, View, Text, Modal, StyleSheet, Dimensions, TouchableOpacity, Alert } from "react-native";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";
import WalkCreate from "./walk/walkCreate";
import WalkCalendar from "./walk/walkCalendar";
import axios, { Axios } from "axios";
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import RenderHtml from 'react-native-render-html';
import { ActivityIndicator } from "react-native-paper";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

const htmlContainer = `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      .dot {overflow:hidden;float:left;width:12px;height:12px;background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/mini_circle.png');}    
      .dotOverlay {position:relative;bottom:10px;border-radius:6px;border: 1px solid #ccc;border-bottom:2px solid #ddd;float:left;font-size:12px;padding:5px;background:#fff;}
      .dotOverlay:nth-of-type(n) {border:0; box-shadow:0px 1px 2px #888;}    
      .number {font-weight:bold;color:#ee6152;}
      .dotOverlay:after {content:'';position:absolute;margin-left:-6px;left:50%;bottom:-8px;width:11px;height:8px;background:url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white_small.png')}
      .distanceInfo {position:relative;top:5px;left:5px;list-style:none;margin:0;}
      .distanceInfo .label {display:inline-block;width:50px;}
      .distanceInfo:after {content:none;}
      
      #map {
        width: 397px;
        height: 682px;
      }
      #startButton {
        width: 100px;
        height: 100px;
        background-color: rgb(253, 245, 169);
        border: none;
        border-radius: 100%;
        z-index: 5;
        position: absolute;
        bottom: 0%;
        left: 50%;
        display: none;
        transform: translate(-50%, -50%);
        box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.2);
      }
      #startText {
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: center;
        font-size: 20px;
        font-weight: bold;
      }
      #pauseButton {
        width: 100px;
        height: 100px;
        background-color: rgb(255, 230, 0);
        border: none;
        border-radius: 100%;
        z-index: 5;
        position: absolute;
        bottom: 0%;
        left: 50%;
        display: none;
        transform: translate(-50%, -50%);
        box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.2);
      }
      #pauseText {
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: center;
        font-size: 20px;
        font-weight: bold;
      }
      #stopButton {
        width: 80px;
        height: 80px;
        background-color: rgb(255, 0, 0);
        border: none;
        border-radius: 100%;
        z-index: 5;
        position: absolute;
        bottom: 3%;
        right: 0%;
        display: none;
        transform: translate(-50%, -50%);
        box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.2);
      }
      #stopText {
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: center;
        font-size: 20px;
        font-weight: bold;
      }
      #changeButton {
        width: 100px;
        height: 100px;
        background-color: rgb(255, 230, 0);
        border: none;
        border-radius: 100%;
        z-index: 5;
        position: absolute;
        bottom: 0%;
        left: 50%;
        display: none;
        transform: translate(-50%, -50%);
        box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.2);
      }
      #changeText {
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: center;
        font-size: 20px;
        font-weight: bold;
      }
      #backButton {
        width: 80px;
        height: 80px;
        background-color: rgb(200, 230, 0);
        border: none;
        border-radius: 100%;
        z-index: 5;
        position: absolute;
        bottom: 3%;
        left: 20%;
        display: none;
        transform: translate(-50%, -50%);
        box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.2);
      }
      #backText {
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: center;
        font-size: 20px;
        font-weight: bold;
      }
      #mapIsNullMessage {
        display: flex;
        font-size: 30px;
        position: absolute;
        top: 50%;
        text-align: center;
        justify-content: center;
        align-items: center;
        left: 50%;
        font-weight: bold;
        transform: translate(-50%, -50%);
      }
      #timer {
        display: none;
        position: absolute;
        z-index: 6;
        top: 5%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 36px;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); /* 텍스트 그림자 효과 */
      }
      #startButton:active,
      #pauseButton:active,
      #stopButton:active,
      #changeButton:active,
      #backButton:active {
          opacity: 0.5; /* 버튼 투명도를 줄임 */
      }
    </style>
    <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=c688164e37f35d82c0237627a526de76&libraries=services,clusterer,drawing"></script> 
  </head>
  <body>
    <div id="map"></div>
    <button id="changeButton">
      <div id="changeText">
        산책갈까?
      </div>
    </button>
    <button id="startButton">
      <div id="startText">
        Start
      </div>
    </button>
    <button id="pauseButton">
      <div id="pauseText">
        Pause
      </div>
    </button>
    <button id="stopButton">
      <div id="stopText">
        Stop
      </div>
    </button>
    <button id="backButton">
      <div id="backText">
        Back
      </div>
    </button>
    <div id="mapIsNullMessage">
      Loading...
    </div>
    <h1 id="timer">00 : 00 : 00</h1>
    <script>
      let seconds = 0;
      let hours = Math.floor(seconds / 3600);
      let minutes = Math.floor((seconds % 3600) / 60);
      let secs = seconds % 60;
      let intervalId;
      let isActive = false;

      function startTimer() {
        if (isActive) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: "start", 
            data: '',
          }));
          hours = Math.floor(seconds / 3600);
          minutes = Math.floor((seconds % 3600) / 60);
          secs = seconds % 60;
          var formattedHours = ('0' + hours).slice(-2);
          var formattedMinutes = ('0' + minutes).slice(-2);
          var formattedSecs = ('0' + secs).slice(-2);
          document.getElementById('timer').innerText = formattedHours + ' : ' + formattedMinutes + ' : ' + formattedSecs;
          intervalId = setInterval(updateTimer, 1000);
        } else {
          isActive = true;
          startTimer();
        }
      }

      function stopTimer() {
        isActive = false;
        clearInterval(intervalId);
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: "timer", 
          data: seconds,
        }));
      }

      function updateTimer() {
        seconds++;
        hours = Math.floor(seconds / 3600);
        minutes = Math.floor((seconds % 3600) / 60);
        secs = seconds % 60;
        var formattedHours = ('0' + hours).slice(-2);
        var formattedMinutes = ('0' + minutes).slice(-2);
        var formattedSecs = ('0' + secs).slice(-2);
        // 타이머를 HTML 요소에 업데이트합니다.
        document.getElementById('timer').innerText = formattedHours + ' : ' + formattedMinutes + ' : ' + formattedSecs;
      }

      function resetTimer() {
        clearInterval(intervalId);
        seconds = 0;
        hours = 0;
        minutes = 0;
        secs = 0;
        document.getElementById('timer').textContent = "00 : 00 : 00";
      }

      function change() {
        startButton.style.display = 'block';
        changeButton.style.display = 'none';
        backButton.style.display = 'block';
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: "change", 
          data: '',
        }));
      }

      function back() {
        startButton.style.display = 'none';
        stopButton.style.display = 'none';
        changeButton.style.display = 'block';
        backButton.style.display = 'none';
        pauseButton.style.display = 'none';
        timer.style.display = 'none';
        stopTimer();
        stopDrawing();
        deleteClickLine();
        deleteDistnce();
        deleteCircleDot();
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: "back", 
          data: '',
        }));

        panTo(currentLocation.latitude, -currentLocation.longitude)
      }

      function pauseTimer() {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: "pause", 
          data: '',
        }));
        clearInterval(intervalId);
        startButton.style.display = 'block';
        pauseButton.style.display = 'none';
      }

      document.getElementById('changeButton').addEventListener('click', change);
      document.getElementById('backButton').addEventListener('click', back);
      document.getElementById('startButton').addEventListener('click', startTimer);
      document.getElementById('pauseButton').addEventListener('click', pauseTimer);
      document.getElementById('stopButton').addEventListener('click', stopTimer);

      var startButton = document.getElementById('startButton');
      var pauseButton = document.getElementById('pauseButton');
      var map = null;
      var currentLocation = null;
      var marker = null;
      var markerPosition = null;
      var mapIsNullMessage = document.getElementById('mapIsNullMessage');
      var timer = document.getElementById('timer');

      var drawingFlag = false; // 선이 그려지고 있는 상태를 가지고 있을 변수입니다
      var moveLine; // 선이 그려지고 있을때 마우스 움직임에 따라 그려질 선 객체 입니다
      var clickLine // 마우스로 클릭한 좌표로 그려질 선 객체입니다
      var distanceOverlay; // 선의 거리정보를 표시할 커스텀오버레이 입니다
      var dots = {}; // 선이 그려지고 있을때 클릭할 때마다 클릭 지점과 거리를 표시하는 커스텀 오버레이 배열입니다.

      var staticMap = null;
      
      document.addEventListener('message', async (e) => {
        const { type, data } = JSON.parse(e.data);
        currentLocation = data;
        if (!map) {
          createMap(currentLocation.latitude, -currentLocation.longitude);  
          mapIsNullMessage.style.display = 'none';
          changeButton.style.display = 'block';
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: "map", 
            data: '',
          }));
        } else {
          // alert('이미맵이생성됨')
          if (drawingFlag) {
            startDrawing(currentLocation.latitude, -currentLocation.longitude + 0.011);
          }
        }
      });
      
      function createMap(lat, lng) {
        var mapContainer = document.getElementById('map'); // 지도를 표시할 div 
        var mapOptions = { 
          center: new kakao.maps.LatLng(lat, lng), // 맵의 중심좌표를 현재 위치로 설정
          level: 3 // 맵의 확대 레벨
        };
        // 새로운 맵 객체 생성
        map = new kakao.maps.Map(mapContainer, mapOptions);

        // 마커가 표시될 위치입니다 
        markerPosition  = new kakao.maps.LatLng(lat, lng); 
        
        // 마커를 생성합니다
        marker = new kakao.maps.Marker({
          position: markerPosition
        });
        
        // 마커가 지도 위에 표시되도록 설정합니다
        marker.setMap(map);        
      };

      startButton.onclick = function() {
        startButton.style.display = 'none';
        stopButton.style.display = 'block';
        pauseButton.style.display = 'block';
        timer.style.display = 'block';
        startDrawing(currentLocation.latitude, -currentLocation.longitude);
      }

      pauseButton.onclick = function() {
        startButton.style.display = 'block';
        pauseButton.style.display = 'none';
      }
      
      stopButton.onclick = function() {
        startButton.style.display = 'block';
        pauseButton.style.display = 'none';
        stopDrawing();
        backButton.style.display = 'block';
        stopButton.style.display = 'none';
      }

      function panTo(lat, lng) {
        // 이동할 위도 경도 위치를 생성합니다 
        var moveLatLon = new kakao.maps.LatLng(lat, lng);
        
        // 지도 중심을 부드럽게 이동시킵니다
        // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
        map.panTo(moveLatLon);

        // 마커가 표시될 위치입니다 
        markerPosition  = new kakao.maps.LatLng(lat, lng);
        
        marker.setMap(null);

        // 마커를 생성합니다
        marker = new kakao.maps.Marker({
          position: markerPosition
        });
        
        // 마커가 지도 위에 표시되도록 설정합니다
        marker.setMap(map);   
      }        
      
      // 지도에 클릭 이벤트를 등록합니다
      // 지도를 클릭하면 선 그리기가 시작됩니다 그려진 선이 있으면 지우고 다시 그립니다
      function startDrawing(lat, lng) {
        panTo(lat, lng);

        // 지도 클릭이벤트가 발생했는데 선을 그리고있는 상태가 아니면
        if (!drawingFlag) {
    
          // 상태를 true로, 선이 그리고있는 상태로 변경합니다
          drawingFlag = true;
          
          // 지도 위에 선이 표시되고 있다면 지도에서 제거합니다
          deleteClickLine();
          
          // 지도 위에 커스텀오버레이가 표시되고 있다면 지도에서 제거합니다
          deleteDistnce();

          // 지도 위에 선을 그리기 위해 클릭한 지점과 해당 지점의 거리정보가 표시되고 있다면 지도에서 제거합니다
          deleteCircleDot();
      
          // 클릭한 위치를 기준으로 선을 생성하고 지도위에 표시합니다
          clickLine = new kakao.maps.Polyline({
              map: map, // 선을 표시할 지도입니다 
              path: [new kakao.maps.LatLng(lat, lng)], // 선을 구성하는 좌표 배열입니다 클릭한 위치를 넣어줍니다
              strokeWeight: 3, // 선의 두께입니다 
              strokeColor: '#db4040', // 선의 색깔입니다
              strokeOpacity: 1, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
              strokeStyle: 'solid' // 선의 스타일입니다
          });
          
          // 선이 그려지고 있을 때 마우스 움직임에 따라 선이 그려질 위치를 표시할 선을 생성합니다
          moveLine = new kakao.maps.Polyline({
              strokeWeight: 3, // 선의 두께입니다 
              strokeColor: '#db4040', // 선의 색깔입니다
              strokeOpacity: 0.5, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
              strokeStyle: 'solid' // 선의 스타일입니다    
          });
      
          // 클릭한 지점에 대한 정보를 지도에 표시합니다
          displayCircleDot(new kakao.maps.LatLng(lat, lng), 0);
    
                
        } else { // 선이 그려지고 있는 상태이면
    
          // 그려지고 있는 선의 좌표 배열을 얻어옵니다
          var path = clickLine.getPath();

          // 좌표 배열에 클릭한 위치를 추가합니다
          path.push(new kakao.maps.LatLng(lat, lng));
          
          // 다시 선에 좌표 배열을 설정하여 클릭 위치까지 선을 그리도록 설정합니다
          clickLine.setPath(path);

          var distance = Math.round(clickLine.getLength());
          displayCircleDot(new kakao.maps.LatLng(lat, lng), distance);

          console.log(path);
        };
      };     
      
      // 지도에 마우스 오른쪽 클릭 이벤트를 등록합니다
      // 선을 그리고있는 상태에서 마우스 오른쪽 클릭 이벤트가 발생하면 선 그리기를 종료합니다
      function stopDrawing () {

        // 지도 오른쪽 클릭 이벤트가 발생했는데 선을 그리고있는 상태이면
        if (drawingFlag) {
            
          // 마우스무브로 그려진 선은 지도에서 제거합니다
          moveLine.setMap(null);
          moveLine = null;  
          
          // 마우스 클릭으로 그린 선의 좌표 배열을 얻어옵니다
          var path = clickLine.getPath();

          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: "locations", 
            data: path,
          }));

          // 선을 구성하는 좌표의 개수가 2개 이상이면
          if (path.length > 1) {
            // 마지막 클릭 지점에 대한 거리 정보 커스텀 오버레이를 지웁니다
            if (dots[dots.length-1].distance) {
                dots[dots.length-1].distance.setMap(null);
                dots[dots.length-1].distance = null;    
            }

            var distance = Math.round(clickLine.getLength()), // 선의 총 거리를 계산합니다
                content = getTimeHTML(distance, seconds); // 커스텀오버레이에 추가될 내용입니다
            
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: "distance", 
              data: distance,
            }));

            // 그려진 선의 거리정보를 지도에 표시합니다
            showDistance(content, path[path.length-1]);  
              
          } else {

            // 선을 구성하는 좌표의 개수가 1개 이하이면 
            // 지도에 표시되고 있는 선과 정보들을 지도에서 제거합니다.
            deleteClickLine();
            deleteCircleDot(); 
            deleteDistnce();

          }
          let maxMa = Math.max(...path.map(item => item.Ma));
          let minMa = Math.min(...path.map(item => item.Ma));
          let maxLa = Math.max(...path.map(item => item.La));
          let minLa = Math.min(...path.map(item => item.La));
          let ma = (maxMa + minMa) / 2
          let la = (maxLa + minLa) / 2
          panTo(ma, la);
          marker.setMap(null);
          
          // 상태를 false로, 그리지 않고 있는 상태로 변경합니다
          map.setLevel(5);
          drawingFlag = false;   
          seconds = 0;
          hours = 0;
          minutes = 0;
          secs = 0;       
        }  
      };   
      
      // 클릭으로 그려진 선을 지도에서 제거하는 함수입니다
      function deleteClickLine() {
        if (clickLine) {
          clickLine.setMap(null);    
          clickLine = null;        
        }
      }
      
      // 마우스 드래그로 그려지고 있는 선의 총거리 정보를 표시하거
      // 마우스 오른쪽 클릭으로 선 그리가 종료됐을 때 선의 정보를 표시하는 커스텀 오버레이를 생성하고 지도에 표시하는 함수입니다
      function showDistance(content, position) {
          
        if (distanceOverlay) { // 커스텀오버레이가 생성된 상태이면
            
          // 커스텀 오버레이의 위치와 표시할 내용을 설정합니다
          distanceOverlay.setPosition(position);
          distanceOverlay.setContent(content);
            
        } else { // 커스텀 오버레이가 생성되지 않은 상태이면
            
          // 커스텀 오버레이를 생성하고 지도에 표시합니다
          distanceOverlay = new kakao.maps.CustomOverlay({
            map: map, // 커스텀오버레이를 표시할 지도입니다
            content: content,  // 커스텀오버레이에 표시할 내용입니다
            position: position, // 커스텀오버레이를 표시할 위치입니다.
            xAnchor: 0,
            yAnchor: 0,
            zIndex: 3  
          });      
        }
      }
      
      // 그려지고 있는 선의 총거리 정보와 
      // 선 그리가 종료됐을 때 선의 정보를 표시하는 커스텀 오버레이를 삭제하는 함수입니다
      function deleteDistnce () {
        if (distanceOverlay) {
            distanceOverlay.setMap(null);
            distanceOverlay = null;
        }
      }
      
      // 선이 그려지고 있는 상태일 때 지도를 클릭하면 호출하여 
      // 클릭 지점에 대한 정보 (동그라미와 클릭 지점까지의 총거리)를 표출하는 함수입니다
      function displayCircleDot(position, distance) {
      
        // 클릭 지점을 표시할 빨간 동그라미 커스텀오버레이를 생성합니다
        var circleOverlay = new kakao.maps.CustomOverlay({
            content: '<span class="dot"></span>',
            position: position,
            zIndex: 1
        });
    
        // 지도에 표시합니다
        circleOverlay.setMap(map);
    
        if (distance > 0) {
            // 클릭한 지점까지의 그려진 선의 총 거리를 표시할 커스텀 오버레이를 생성합니다
            var distanceOverlay = new kakao.maps.CustomOverlay({
                content: '',
                position: position,
                yAnchor: 1,
                zIndex: 2
            });
    
            // 지도에 표시합니다
            distanceOverlay.setMap(map);
        }
    
        // 배열에 추가합니다
        dots.push({circle:circleOverlay, distance: distanceOverlay});
      }
      
      // 클릭 지점에 대한 정보 (동그라미와 클릭 지점까지의 총거리)를 지도에서 모두 제거하는 함수입니다
      function deleteCircleDot() {
        var i;
    
        for ( i = 0; i < dots.length; i++ ){
            if (dots[i].circle) { 
                dots[i].circle.setMap(null);
            }
    
            if (dots[i].distance) {
                dots[i].distance.setMap(null);
            }
        }
    
        dots = [];
      }
      
      // 마우스 우클릭 하여 선 그리기가 종료됐을 때 호출하여 
      // 그려진 선의 총거리 정보와 거리에 대한 도보, 자전거 시간을 계산하여
      // HTML Content를 만들어 리턴하는 함수입니다
      function getTimeHTML(distance, seconds) {
        hours = Math.floor(seconds / 3600);
        minutes = Math.floor((seconds % 3600) / 60);
        secs = seconds % 60;
    
        var totalHour = '<span class="number">' + hours + '</span>시간 '
        var totalMin = '<span class="number">' + minutes + '</span>분'
        var totalSecs = '<span class="number">' + secs + '</span>초'
    
        var content = '<ul class="dotOverlay distanceInfo">';
        content += '    <li>';
        content += '        <span class="label">총거리</span><span class="number">' + distance + '</span>m';
        content += '    </li>';
        content += '    <li>';
        content += '        <span class="label">총시간</span>' + totalHour + totalMin + totalSecs;
        content += '    </li>';
        content += '</ul>'
    
        return content;
      }
          
    </script>    
  </body>
</html>
`;

export default function WalkScreen ({ navigation }) {
  const apiUrl = "http://i10a410.p.ssafy.io:8080";
  const [location, setLocation] = useState(null);
  const [pause, setPause] = useState(false);
  const webViewRef = useRef(null);
  const ref = useRef(null);

  const [isRecord, setIsRecord] = useState(null);
  const [isMap, setIsMap] = useState(false);

  const [modalDuration, setModalDuration] = useState('0');
  const [modalImage, setModalImage] = useState(null);
  const [modalLocations, setModalLocations] = useState(null);
  const [modalDistance, setModalDistance] = useState(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMyModalOpen, setIsMyModalOpen] = useState(false);

  // // Record 버튼 클릭 시 실행되는 함수
  // const handleRecordButtonPress = async () => {
  //   try {
  //     // 웹뷰를 캡처하여 이미지로 저장
  //     const uri = await captureWebView();
  //     // 캡처된 이미지를 앨범에 저장
  //     setModalImage(uri);
  //     await saveCapturedImageToAlbum(uri);
  //     // 또는 원하는 방식으로 캡처된 이미지를 처리
  //   } catch (error) {
  //     console.error('캡처 오류:', error);
  //   }
  // };

  // // 웹뷰를 캡처하여 이미지로 반환하는 함수
  // const captureWebView = async () => {
  //   console.log(webViewRef.current);
  //   return await captureRef(webViewRef.current, {
  //     format: 'jpg',
  //     quality: 0.8,
  //   }).then(
  //     (uri) => console.log("캡쳐성공", uri),
  //     (error) => console.log("캡쳐실패", error),
  //   );
  // };

  // // 캡처된 이미지를 앨범에 저장하는 함수
  // const saveCapturedImageToAlbum = async (uri) => {
  //   const asset = await MediaLibrary.createAssetAsync(uri);
  //   await MediaLibrary.createAlbumAsync('MyAlbum', asset, false);
  // };

  const handleCapture = async () => {
    try {
      const uri = await ref.current.capture();
      // console.log(ref.current);
      setModalImage(uri);
      console.log(uri);
      // 웹뷰를 캡쳐하고 캡쳐된 이미지의 URI를 상태에 저장합니다.
    } catch (error) {
      console.error('캡처 오류:', error);
    }
  };
  


  const openModalWithData = () => {
    handleCapture();
    setIsCreateModalOpen(true);
  };
  
  const openModalWithMy = () => {
    setIsMyModalOpen(true);
  }

  const closeModal = () => {
    setIsCreateModalOpen(false);
  };

  const closeMyModal = () => {
    setIsMyModalOpen(false);
  };

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      webViewRef.current.postMessage(JSON.stringify({
        type: 'location',
        data: location.coords
      }));
      console.log(1, JSON.parse(JSON.stringify(location.coords)));
    })();
  }, []);

  useEffect(() => {
    const timer = setInterval(async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('현재 위치를 받아올 수 없습니다!');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }, 2000);

    return () => clearInterval(timer);
  }, [location]);

  useEffect(() => {
    if (location && !pause) {
      webViewRef.current.postMessage(JSON.stringify({
        type: 'location',
        data: location.coords
      }));
      console.log(2, JSON.parse(JSON.stringify(location.coords)));
    }
  }, [location]);


  const onMessage = (event) => {
    const { type, data } = JSON.parse(event.nativeEvent.data);
    if (type === "locations") {
      console.log(data);
      setModalLocations(data);
      // handleRecordButtonPress();
    } else if (type === "timer") {
      setModalDuration(data);
      setIsRecord(true);
    } else if (type === "start") {
      setPause(false);
      setIsRecord(false);
    } else if (type === 'pause') {
      setPause(true);
    } else if (type === 'distance') {
      setModalDistance(data);
      console.log(data);
    } else if (type === "change") {
      setIsMap(false);
    } else if (type === "back") {
      setIsRecord(false);
      setIsMap(true);
      setPause(false);
    } else if (type === "map") {
      setIsMap(true);
    }
  }

  const mapView = () => {
    if (location) {
      return (
        <ViewShot ref={ref} options={{ fileName: "capTureImage", format: "jpg", quality: 0.9 }} style={styles.walkMainShot}>
          <WebView
            ref={webViewRef}
            style={styles.walkMainMap}
            source={{ uri: "https://gongtong.netlify.app/" }}
            // source={{ html: htmlContainer }}
            onMessage={onMessage}
          />
        </ViewShot>
      );
    } else {
      return (
        <View style={styles.walkMainLoading}>
          <ActivityIndicator size={100} />
        </View>
      );
    }
  }

  const recordView = () => {
    if (isRecord) {
      return (
        <TouchableOpacity onPress={() => openModalWithData()}>
          <View style={styles.walkMainRecord}>
            <Text style={styles.walkMainRecordText}>Record</Text>
          </View>
        </TouchableOpacity>
      );
    }
  }

  const myView = () => {
    if (isMap) {
      return (
        <TouchableOpacity onPress={() => openModalWithMy()} style={styles.walkMainMy}>
          <Text style={styles.walkMainMyText}>My</Text>
        </TouchableOpacity>
      );
    }
  }

  return (
    <View style={styles.walkMainContainer}>
      {mapView()}

      {recordView()}

      <Modal
        visible={isCreateModalOpen}
        animationType="slide"
        onRequestClose={closeModal}
        transparent={true}
      >
        <WalkCreate 
          duration={modalDuration}
          locations={modalLocations}
          distance={modalDistance}
          image={modalImage}
          closeModal={closeModal} />
      </Modal>
  
      
      {myView()}
      
      <Modal
        visible={isMyModalOpen}
        animationType="slide"
        onRequestClose={closeMyModal}
        transparent={true}
      >
        <WalkCalendar 
          closeModal={closeMyModal} />
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  walkMainContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.82,
    position: "relative",
  },
  walkMainMap: {
    flex: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.82,
  },
  walkMainStart: {
    width: 100,
    height: 100,
    position: "absolute",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 100,
    bottom: 50,
    left: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "yellow",
  },
  walkMainStartText: {
    fontSize: 20,
  },
  walkMainLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  walkMainLoadingText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    justifyContent: "center",
  },
  walkMainCalendar: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  walkMainRecord: {
    width: 80,
    height: 80,
    position: "absolute",
    borderColor: "black",
    borderRadius: 100,
    bottom: 60.5,
    right: 39.5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "yellow",
    zIndex: 6,
    elevation: 6,
  },
  walkMainRecordText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  walkMainMy: {
    width: 55,
    height: 55,
    position: "absolute",
    borderRadius: 100,
    top: 30,
    right: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "yellow",
    zIndex: 7,
    elevation: 10,
  },
  walkMainMyText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  walkMainShot: {
    flex: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.82,
  },
})