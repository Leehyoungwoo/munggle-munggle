import React, {useEffect, useState} from "react";
import { View, Text, ScrollView, ActivityIndicator, 
  Dimensions, StyleSheet, Image, TouchableOpacity,
  Modal, 
} from "react-native";
import MasonryList from '@react-native-seoul/masonry-list';

import PostDetail from "../../../components/modal/postDetail";

// 이미지 사이즈를 react native crop 으로 조정할 것이기 때문에 지금은 사이즈 조절 x

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

// 이미지의 높이 200 ~ 400 사이의 랜덤 정수 값으로 설정
const getRandomHeight = () => {
  return Math.floor(Math.random() * 200) + 200;
}

export default function ProfileScrap (props) {
  const scrapList = props.scrapList;

  const [detailPost, setDetailPost] = useState(false);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const changeDetailPost = (postId) => {
    setDetailPost(postId);
  }

  const openDetailModal = (postId) => { 
    changeDetailPost(postId); 
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => { setIsDetailModalOpen(false) };

  const renderItem = ({ item, i }) => (
    <TouchableOpacity 
      key={i} 
      style={styles.scrapImageBox}
      onPress={() => openDetailModal(item.postId)}
    >
      <Image style={{...styles.scrapImage, height: getRandomHeight()}} src={item.imageURL} />
    </TouchableOpacity>
  );

  const scraps = () => {
    if (scrapList) {
      return (
        <MasonryList
          // loading={true}
          // LoadingView={<ActivityIndicator/>}
          data={scrapList}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3} // 원하는 열 수 설정
          columnWrapperStyle={styles.postScrapListContainer}
        />
      );
    } else {
      return (
        <View style={styles.indicatorView}>
          <ActivityIndicator size={100} />
        </View>
      );
    }
  }

return (
  <View style={{height: scrapList.length < 6 ? SCREEN_HEIGHT * 0.8 : ""}}>
    {scraps()}
    <Modal
      animationType="fade"
      transparent={true}
      visible={isDetailModalOpen}
      onRequestClose={() => closeDetailModal()}>
      <PostDetail closeDetailModal={closeDetailModal} postId={detailPost} />
    </Modal>
  </View>
);
};

const styles = StyleSheet.create({
  postScrapContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: "rgb(255, 255, 245)",
  },
  postScrapListContainer: {
  },
  scrapImageBox: {
    margin: SCREEN_WIDTH * 0.005,
    borderRadius: 8,
    resizeMode: "center",
  },
  scrapImage: {
    width: SCREEN_WIDTH * 0.32, 
    resizeMode: "cover",
  },
  indicatorView: {
    width: SCREEN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  }
});