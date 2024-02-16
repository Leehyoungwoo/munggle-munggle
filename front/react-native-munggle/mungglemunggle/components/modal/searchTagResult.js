import React, {useState} from "react";
import {
  View, TouchableOpacity, Image,
  ScrollView, Text, StyleSheet,
  Dimensions, Modal,
} from "react-native";

import iconClose from "../../assets/icons/close1.png";
import iconBornWhite from "../../assets/icons/bornWhite.png";

import PostDetail from "./postDetail";
import ProfileCircle from "../profileCircle";
import FollowButton from "../followButton";
import DirectMessageButton from "../directMessageButton";
import { ActivityIndicator } from "react-native-paper";

import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

export default function SearchTagResult (props) {
  const searchTag = props.searchTag;
  const tagSearchPosts = props.tagSearchPosts;

  const formatDate = (date) => {
    const day = new Date(date);

    const now = Date.now();

    const diff = (now - day.getTime()) / 1000;

    if (diff < 60 * 1) {
      return "방금 전";
    } else if (diff < 60 * 60 * 24 * 3) {
      return formatDistanceToNow(day, {addSuffix: true, locale: ko});
    } else {
      return format(day, "yyyy-MM-dd  HH:mm", {locale: ko});
    }
  }

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
          
  const [detailPost, setDetailPost] = useState(false);

  const openDetailModal = () => { setIsDetailModalOpen(true) };

  const handleDetailModal = (post) => {
    setDetailPost(post);
    openDetailModal();
  }
  
  const closeDetailModal = () => { setIsDetailModalOpen(false) };

  const postContent = () => {
    if (tagSearchPosts) {
      return (
        <View style={styles.searchTagResultPostBottomView}>
        {tagSearchPosts && tagSearchPosts.map((post, index) => {
          return(
            <View key={index} style={styles.searchTagResultPostListView}>
              <View style={styles.searchTagResultPostListViewLeftView}>
                <ProfileCircle 
                  imageProfile={post.profileImage}
                  nameProfile={post.nickname}
                />
                <View style={styles.searchTagResultPostListProfileButtonView}>
                  <FollowButton />
                  <DirectMessageButton />
                </View>
              </View>
              
              <View style={styles.searchTagResultPostListViewRightView}>
                <TouchableOpacity 
                  style={styles.searchTagResultPostListImageView}
                  onPress={() => handleDetailModal(post)}
                >
                  <Image 
                    style={styles.searchTagResultPostListImage}
                    src={post.imageURLs[0]} 
                    />
                </TouchableOpacity>
  
                <View style={styles.searchTagResultPostListBottomView}>
                  <View style={styles.searchTagResultPostListTextView}>
                    <Text style={styles.searchTagResultPostListTitle}>{post.postTitle}</Text>
                    <Text style={styles.searchTagResultPostListDate}>{formatDate(post.createdAt)}</Text>
                  </View>
                  <View style={styles.searchTagResultPostListIconView}>
                    <View style={styles.searchTagResultPostLikeCountView}>
                      <Text style={styles.searchTagResultPostLikeCountText}>{post.likeCount ? post.likeCount : 0}</Text>
                    </View>
                    <TouchableOpacity style={styles.searchTagResultPostLikeIcon}>
                      <Image 
                        style={styles.searchTagResultPostLikeIcon}
                        source={iconBornWhite}
                        />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isDetailModalOpen}
          onRequestClose={() => closeDetailModal()}>
          <PostDetail closeDetailModal={closeDetailModal} post={detailPost} />
        </Modal>
      </View>
    );
  } else {
    return (
      <View style={{width: SCREEN_WIDTH * 0.6, height: SCREEN_HEIGHT * 0.4, justifyContent: "center"}}>
        <ActivityIndicator size={100} />
      </View>
    );
  }
   };
   
   return (
      <View style={styles.searchTagResultModalBackGround}>
        <View style={styles.searchTagResultModalContainer}>
          <TouchableOpacity
            style={styles.tagResultCloseView}
            onPress={props.closeTagSearchModal}>
            <Image
              style={styles.tagResultCloseImage}
              source={iconClose}
              />
          </TouchableOpacity>

          <View style={styles.searchTagResultTopView}>
            <Text style={styles.searchTagResultTopText}># {searchTag}를 포함하는 게시물</Text>
          </View>

          <ScrollView>
            <View
              style={styles.tagResultContents}
            >
              {postContent()}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };

const styles = StyleSheet.create({
  searchTagResultModalBackGround: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  searchTagResultModalContainer: {
    alignItems: "center",
    width: SCREEN_WIDTH * 0.88,
    height: SCREEN_HEIGHT * 0.80,
    marginBottom: SCREEN_HEIGHT * 0.02,
    position: "relative",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "lightgrey",
    backgroundColor: "white",
  },
  tagResultCloseView: {
    width: SCREEN_WIDTH * 0.06,
    height: SCREEN_WIDTH * 0.06,
    position: "absolute",
    top: 10,
    right: 10,
  },
  tagResultCloseImage: {
    width: SCREEN_WIDTH * 0.06,
    height: SCREEN_WIDTH * 0.06,
  },

  tagResultContents: {
    width: SCREEN_WIDTH * 0.9,
    alignItems: 'center',
  },

  searchTagResultTopView: {
    width: SCREEN_WIDTH * 0.88,
    height: SCREEN_HEIGHT * 0.05,
    marginVertical: SCREEN_HEIGHT * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  searchTagResultTopText: {
    marginLeft: SCREEN_WIDTH * 0.1,
    fontSize: 16,
    fontWeight: "500",
  },

// post content
  searchTagResultPostBottomView: {
    width: SCREEN_WIDTH * 0.88,
    alignItems: "center",
  },
  searchTagResultPostListView: {
    marginVertical: 10,
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT * 0.32,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-around",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "lightgrey",
    elevation: 10,
    paddingVertical: SCREEN_HEIGHT * 0.01,
    marginRight: SCREEN_WIDTH * 0.02,
  },
  searchTagResultPostListViewLeftView: {
    width: SCREEN_WIDTH * 0.24,
    height: SCREEN_HEIGHT * 0.2,
    alignItems: "center",
    justifyContent: "space-around",
  },
  searchTagResultPostListProfileButtonView: {
    flexDirection: "row",
    width: SCREEN_WIDTH * 0.225,
    justifyContent: "space-between",
  },
  searchTagResultPostListViewRightView: {
    width: SCREEN_WIDTH * 0.57,
    height: SCREEN_HEIGHT * 0.3,
    alignItems: "center",
    justifyContent: "space-around",
  },
  searchTagResultPostListImageView: {
    width: SCREEN_WIDTH * 0.57,
    height: SCREEN_HEIGHT * 0.23,
    alignItems: "center",
    justifyContent: "center",
  },
  searchTagResultPostListImage: {
    width: SCREEN_WIDTH * 0.53,
    height: SCREEN_HEIGHT * 0.20,
  },
  searchTagResultPostListBottomView: {
    width: SCREEN_WIDTH * 0.57,
    height: SCREEN_HEIGHT * 0.07,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
  },
  searchTagResultPostListTextView: {
    width: SCREEN_WIDTH * 0.42,
    height: SCREEN_HEIGHT * 0.06,
    justifyContent: "space-between",
  },
  searchTagResultPostListTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  searchTagResultPostListDate: {
    fontSize: 13,
    color: "grey",
    marginLeft: SCREEN_WIDTH * 0.02,
  },

  searchTagResultPostListIconView: {
    width: SCREEN_WIDTH * 0.11,
    height: SCREEN_HEIGHT * 0.17,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchTagResultPostLikeIcon: {
    width: SCREEN_WIDTH * 0.053,
    height: SCREEN_WIDTH * 0.053,
    
  },
  searchTagResultPostLikeCountView: {
    width: SCREEN_WIDTH * 0.053,
    height: SCREEN_WIDTH * 0.053,
    justifyContent: "flex-end",
  },
  searchTagResultPostLikeCountText: {
    fontSize: 16,
    color: "rgb(146, 146, 0)",
  },
});