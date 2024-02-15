import React, { useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Modal } from "react-native";
import { Shadow } from "react-native-shadow-2";

import PostDetail from "../../../components/modal/postDetail";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

export default function ProfilePost (props) {
  const postList = props.postList;

  const [detailPost, setDetailPost] = useState(false);

  const [isDetailModal, setIsDetailModal] = useState(false);

  const changeDetailPost = (postId) => {
    setDetailPost(postId);
  };

  const openDetailModal = (postId) => {
    changeDetailPost(postId);
    setIsDetailModal(true);
  };

  const closeDetailModal = () => {
    setIsDetailModal(false);
  };

  const posts = () => {
    return (
      <View style={styles.profilePostListView}>
        {postList && postList.map((post, index) => {
          return(
            <Shadow
              key={index}
              offset={[13, 13]}
              startColor="rgba(0, 0, 0, 0.2)"
            >
              <TouchableOpacity 
                style={styles.profilePostView}
                onPress={() => openDetailModal(post.postId)}
              >
                <Image
                  style={styles.profilePostDetailImage}
                  src={post.imageURL}
                />
                <Text style={styles.profilePostDetailTitle}>{post.postTitle}</Text>
              </TouchableOpacity>
              
            </Shadow>
          );
        })}
      </View>
    );
  };

  return (
    <View style={{
      ...styles.profilePostContainer,
      height: postList.length > 6 ? "" : SCREEN_HEIGHT  
    }}>
      {posts()}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isDetailModal}
        onRequestClose={() => closeDetailModal()}>
        <PostDetail closeDetailModal={closeDetailModal} postId={detailPost} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  profilePostContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    alignItems: "center",
    backgroundColor: "rgb(255, 255, 245)"
  },
  profilePostListView: {
    width: SCREEN_WIDTH,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  profilePostView: {
    width: SCREEN_WIDTH * 0.284,
    height: SCREEN_HEIGHT * 0.15,
    margin: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  profilePostDetailImage: {
    width: SCREEN_WIDTH * 0.24,
    height: SCREEN_HEIGHT * 0.115,
    marginBottom: 4,
  },
  profilePostDetailTitle: {
    fontSize: 10,
    fontWeight: "500",
  }
});