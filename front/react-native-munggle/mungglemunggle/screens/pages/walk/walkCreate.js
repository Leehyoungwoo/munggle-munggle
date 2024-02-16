import React, { useState } from "react";
import { 
  View, Text, ScrollView, StyleSheet, 
  Dimensions, TouchableOpacity, Platform, 
  KeyboardAvoidingView, TextInput, Image 
} from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import Checkbox from "expo-checkbox";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

export default function WalkCreate ({ duration, locations, distance, image }) {
  const apiUrl = "http://i10a410.p.ssafy.io:8080";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [isPrivate, setIsPrivate] = useState(false);

  const [rating, setRating] = useState(0);

  const handleRatingChange = (selectedRating) => {
    setRating(selectedRating);
  };

  const StarRating = ({ rating, onRatingChange }) => {
    const [selectedRating, setSelectedRating] = useState(rating);
  
    const handleRating = (selectedStar) => {
      setSelectedRating(selectedStar);
      onRatingChange(selectedStar);
    };
  
    return (
      <View style={styles.walkCreateRating}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleRating(star)}
          >
            <FontAwesome
              name={star <= rating ? 'star' : 'star-o'}
              size={32}
              color={star <= rating ? 'gold' : 'gray'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };


  
  const createWalkData = async () => {
    const payLoad = {
      walkName: title, 
      duration: duration, 
      distance: distance,
      rating: rating,
      description: description,
      location: locations.map(location => ({
        lat: location.Ma,
        lng: location.La,
      }))
    };

    const formData = new FormData();

    await axios.post(
      `${apiUrl}/walks`,
      formData,
    ).then((res) => {
      console.log(res.status);
    }).catch((err) => {
      console.log(err)
    })
  };

  const createWalk = async () => {
    await createWalkData();
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
      style={styles.createModalBackGround}
    >
      <View style={styles.createModalBackGround}>
        <View style={styles.createModalContainer}>
          <ScrollView style={styles.createModalScrollView}>
            <View style={styles.walkCreateTitle}>
              <Text style={styles.walkCreateTitleText}>오늘의 산책 기록</Text>
            </View>

            <View style={styles.walkCreateImageContainer}>
              {image && <Image src={ image } style={styles.walkCreateImage} />}
            </View>

            <View style={styles.walkCreateRatingContainer}>
              {StarRating({ rating, onRatingChange: handleRatingChange })}
            </View>

            <View style={styles.walkCreateNumbers}>
              <Text style={styles.walkCreateRatingText}>평점: {rating}</Text>
              <Text style={styles.walkCreateDurationText}>시간: {duration}초</Text>
              <Text style={styles.walkCreateDistanceText}>거리: {distance}m</Text>
            </View>

            <View style={styles.walkCreateBottomView}>
              <View style={styles.walkCreateTextInputView}>
                <TextInput
                  placeholder="제목을 입력하세요"
                  value={title}
                  onChangeText={(e) => setTitle(e)}
                  style={styles.walkCreateTextInput}
                />
              </View>

              <View style={styles.walkCreateTextAreaView}>
                <TextInput
                  placeholder="리뷰를 입력하세요"
                  textAlignVertical="top"
                  value={content}
                  onChangeText={(e) => setContent(e)}
                  style={styles.walkCreateTextArea}
                  multiline
                />
              </View>
              <View style={styles.checkBoxContainer}>
                <Checkbox
                  style={styles.checkBox}
                  value={isPrivate}
                  onValueChange={setIsPrivate}
                  color={isPrivate ? '#4630EB' : undefined}
                />
                <Text>비공개</Text>
              </View>
            </View>

            <View style={styles.walkCreateSubmitView}>
              <TouchableOpacity
              style={styles.walkCreateSubmitTouchView}
              onPress={createWalk}
              >
                <Text style={styles.walkCreateSubmitText}>기록</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  createModalBackGround: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  createModalContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.8,
    borderRadius: 30,
    position: "relative",
    backgroundColor: "white",
    borderWidth: 1,
    paddingBottom: 6,
    paddingTop: 17,
  },

  closeView: {
    width: SCREEN_WIDTH * 0.05,
    height: SCREEN_WIDTH * 0.05,
    position: "absolute",
    top: 5,
    right: 5,
  },

  postCreateTopView: {
    width: SCREEN_WIDTH * 1.3,
    height: SCREEN_HEIGHT * 0.28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  postCreateMiddleView: {
    marginVertical: SCREEN_HEIGHT * 0.01,
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 0.13,
    alignItems: "center",
  },
  buttonContainer: {
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_WIDTH * 0.13,
    flexDirection: "row", 
    justifyContent: "center", 
  },
  
  walkCreateBottomView: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.31,
    alignItems: "center",
  },
  walkCreateTextInputView: {
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT * 0.07,
  },
  walkCreateTextInput: {
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT * 0.06,
    borderRadius: 10, 
    borderColor: 'gray',
    borderWidth: 1, 
    paddingLeft: SCREEN_WIDTH * 0.02,
    fontSize: 16,
  },
  walkCreateTextAreaView: {
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT * 0.2,
  },
  walkCreateTextArea: {
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT * 0.2,
    paddingTop: SCREEN_HEIGHT * 0.01,
    paddingLeft: SCREEN_WIDTH * 0.02,
    fontSize: 16,    
    borderRadius: 10,
    borderColor: 'gray', 
    borderWidth: 1, 
  },
  
  walkCreateSubmitView: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.05,
    alignItems: "center",
    marginBottom: 10,
  },
  walkCreateSubmitTouchView: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_HEIGHT * 0.05,
    backgroundColor: "rgb(13, 110, 253)",
    borderWidth: 1,
    borderRadius: 50,
    borderColor: "rgb(13, 110, 253)",
    justifyContent: "center",
    alignItems: "center",
  },
  walkCreateSubmitText: {
    color: "white",
    fontSize: 20,
  },
  walkCreateImageContainer: {
    zIndex: 6,
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.41,
    borderRadius: 15,
  },
  walkCreateImage: {
    zIndex: 6,
    width: SCREEN_WIDTH * 0.88,
    height: SCREEN_HEIGHT * 0.40,
    marginTop: 3,
    marginLeft: 2,
    borderRadius: 15,
    borderWidth: 1,
  },
  walkCreateTitle: {
    zIndex: 8,
    width: SCREEN_WIDTH * 0.9,
    height: 30,
  },
  walkCreateTitleText: {
    zIndex: 8,
    fontSize: 20,
    color: "black",
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.1,
    fontWeight: "bold",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  walkCreateRatingContainer: {
    width: SCREEN_WIDTH * 0.9,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginTop: 5,
  },
  walkCreateRating: {
    flexDirection: 'row',
    width: SCREEN_WIDTH * 0.9,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  walkCreateNumbers: {
    width: SCREEN_WIDTH * 0.85,
    paddingTop: SCREEN_HEIGHT * 0.01,
    paddingLeft: SCREEN_WIDTH * 0.02,
    paddingBottom: SCREEN_HEIGHT * 0.01,
    fontSize: 16,    
    borderRadius: 10,
    borderColor: 'gray', 
    borderWidth: 1, 
    marginLeft: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  walkCreateRatingText: {
    flex: 1,
  },
  walkCreateDurationText: {
    flex: 1,
  },
  walkCreateDistanceText: {
    flex: 1,
  },
  checkBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
});