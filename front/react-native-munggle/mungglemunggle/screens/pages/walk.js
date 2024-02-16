import React, { useEffect, useRef, useState } from "react";
import { View, Text, Modal, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";
import WalkCreate from "./walk/walkCreate";
import WalkCalendar from "./walk/walkCalendar";
import ViewShot from 'react-native-view-shot';
import { ActivityIndicator } from "react-native-paper";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

export default function WalkScreen () {
  const apiUrl = "http://i10a410.p.ssafy.io:8080";
  const location = useRef(null);
  const pause = useRef(false);
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

  const handleCapture = async () => {
    try {
      const uri = await ref.current.capture();
      setModalImage(uri);
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
  
    const fetchData = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      location.current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
        if (!pause.current) {
          webViewRef.current.postMessage(JSON.stringify({
            type: 'location',
            data: location.current.coords
          }));
      }
    };
  
    const timer = setInterval(fetchData, 2000);
  
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);
  


  const onMessage = (event) => {
    const { type, data } = JSON.parse(event.nativeEvent.data);
    if (type === "locations") {
      setModalLocations(data);
    } else if (type === "timer") {
      setModalDuration(data);
      setIsRecord(true);
    } else if (type === "start") {
      pause.current = false;
      setIsRecord(false);
    } else if (type === 'pause') {
      pause.current = true;
    } else if (type === 'distance') {
      setModalDistance(data);
    } else if (type === "change") {
      setIsMap(false);
    } else if (type === "back") {
      setIsRecord(false);
      setIsMap(true);
      pause.current = false;
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