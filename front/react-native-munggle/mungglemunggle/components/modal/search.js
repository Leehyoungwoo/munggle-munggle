import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, ScrollView, Text, View, Dimensions,
TouchableOpacity, Image, TextInput, Modal, ActivityIndicator
} from 'react-native';

import iconClose from "../../assets/icons/close1.png";
import iconSearch from "../../assets/icons/search.png";
import iconBornWhite from "../../assets/icons/bornWhite.png";

import SearchTagResult from './searchTagResult';
import PostDetail from './postDetail';
import FollowButton from '../followButton';
import DirectMessageButton from '../directMessageButton';
import ProfileCircle from '../profileCircle';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

export default function Search(props) {
  const apiUrl = "http://i10a410.p.ssafy.io:8080";
  const [authToken, setAuthToken] = useState("");

  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const scrollViewRef = useRef(null);

  const [searchPosts, setSearchPosts] = useState(false);
  const [searchUsers, setSearchUsers] = useState(false);
  const [searchTags, setSearchTags] = useState(false);
  const [tagSearchPosts, setTagSearchPosts] = useState(false);

  const [detailPost, setDetailPost] = useState(false);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
          
  
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

  const changeDetailPost = (postId) => {
    setDetailPost(postId);
  }

  const openDetailModal = (postId) => { 
    changeDetailPost(postId); 
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => { setIsDetailModalOpen(false) };
  
  useEffect(() => {
    if (!authToken) {
      setAuthToken(AsyncStorage.getItem("accessToken"));
    };
  }, []);

  const getPostSearchData = async (searchWord) => {
    if (!authToken) {
      setAuthToken(await AsyncStorage.getItem("accessToken"));
    };

    await axios.get(
      `${apiUrl}/search/post?type=title&word=${searchWord}&page=${0}`,
      {headers: {
        "Authorization": authToken._j,
      }}
    ).then((res) => {
      console.log(res.data);
      setSearchPosts(res.data.posts);
    }).catch((err) => {
      console.log(err);
    })
  };
  
  const getUserSearchData = async (searchWord) => {
    if (!authToken) {
      setAuthToken(await AsyncStorage.getItem("accessToken"));
    };
    
    await axios.get(
      `${apiUrl}/search/user?keyword=${searchWord}`,
      {headers: {
        "Authorization": authToken._j ,
      }}
    ).then((res) => {
      console.log(res.data);
      setSearchUsers(res.data);
    }).catch((err) => {
      console.log(err);
    })
  };
  
  const getTagSearchData = async (searchWord) => {
    if (!authToken) {
      setAuthToken(await AsyncStorage.getItem("accessToken"));
    };
  
    await axios.get(
      `${apiUrl}/search/tag/${searchWord}`,
      {headers: {
        "Authorization": authToken._j ,
      }}
    ).then((res) => {
      console.log(res.data);
      setSearchTags(res.data);
    }).catch((err) => {
      console.log(err);
    })
  };

  const getTagPostSearchData = async (tagName) => {
    if (!authToken) {
      setAuthToken(await AsyncStorage.getItem("accessToken"));
    };

    console.log(authToken._j)

    await axios.get(
      `${apiUrl}/search/post?type=tag&word=${tagName}&page=${0}`,
      {headers: {
        "Authorization": authToken._j ,
      }}
    ).then((res) => {
      console.log(res.data);
      setTagSearchPosts(res.data.posts);
    }).catch((err) => {
      console.log(err);
    })
  };

//게시물 결과에서의 이벤트
  const handleUserPress = () => {
    //유저 상세 정보 모달(이용자 결과에서도 사용)
    console.log("handleUserPress");
  };

  const handlePostPress = () => {
    //게시물 상세 정보 모달
    console.log("handlePostPress");
  };

  const handleLikePress = () => {
    //좋아요, 좋아요 취소 전송
    console.log("handleLikePress");
  };


  //탭바 눌렀을때 해당 내용으로 이동
  const handleTabPress = async (index) => {
    setActiveTab(index);
    scrollViewRef.current.scrollTo({ x: SCREEN_WIDTH * index * 0.9, animated: true });
  };

  //검색버튼 눌렀을때 contentData 변경
  const handleSearch = async () => {
    //api를 통해 tagDada, userData, postData 또는 modalData 변경
    //GET : /search/post에서 type(title, tag)에 따른 데이터를 받는다
    await getPostSearchData(searchText);
    await getUserSearchData(searchText);
    await getTagSearchData(searchText);
  };

  const searchView = () => {
    return (
      <View style={styles.searchTopView}>
        <TextInput
          style={styles.searchInput}
          placeholder="검색어를 입력하세요"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
        <TouchableOpacity 
          style={styles.searchIconView}
          onPress={() => handleSearch()}
        >
          <Image
            style={styles.searchIcon}
            source={iconSearch}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const tabView = () => {
    return (
      <View style={styles.searchMiddleView}>
        {['게시물', '이용자', '태그'].map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tabButton,
              activeTab === index && styles.activeTabButton,
              index != 2 && {borderRightWidth: 1, borderRightColor: "gray"},
              index == 0 && {borderLeftWidth: 1, borderLeftColor: "lightgrey"},
              index == 2 && {borderRightWidth: 1, borderRightColor: "lightgrey"},
            ]}
            onPress={() => handleTabPress(index)}>
            <Text style={styles.tabButtonText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

 const postContent = () => {
  if (searchPosts && searchPosts.length == 0) {
    return (
      <View style={{marginTop: SCREEN_HEIGHT * 0.05,}}>
        <Text style={{fontSize: 20,}}>검색 결과가 없습니다.</Text>
      </View>
    );
  } else if (searchPosts && searchText) {
    return (
      <View style={styles.searchPostBottomView}>
        {searchPosts.map((post, index) => {  
          return(
            <View key={index} style={styles.searchPostListView}>
              <View style={styles.searchPostListViewLeftView}>
                <ProfileCircle 
                  imageProfile={post.profileImage}
                  nameProfile={post.nickname}
                />
                <View style={styles.searchPostListProfileButtonView}>
                  <FollowButton />
                  <DirectMessageButton />
                </View>
              </View>
              
              <View style={styles.searchPostListViewRightView}>
                <TouchableOpacity 
                  style={styles.searchPostListImageView}
                  onPress={() => openDetailModal(post.postId)}
                >
                  <Image 
                    style={styles.searchPostListImage}
                    src={post.imageURLs[0]} 
                  />
                </TouchableOpacity>
  
                <View style={styles.searchPostListBottomView}>
                  <View style={styles.searchPostListTextView}>
                    <Text style={styles.searchPostListTitle}>{post.postTitle}</Text>
                    <Text style={styles.searchPostListDate}>{formatDate(post.createdAt)}</Text>
                  </View>
                  <View style={styles.searchPostListIconView}>
                    <View style={styles.searchPostLikeCountView}>
                      <Text style={styles.searchPostLikeCountText}>12</Text>
                    </View>
                    <TouchableOpacity style={styles.searchPostLikeIcon}>
                      <Image 
                        style={styles.searchPostLikeIcon}
                        source={iconBornWhite}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  } else if (!searchPosts && !searchText) {
    return (
      <View style={{marginTop: SCREEN_HEIGHT * 0.05,}}>
        <Text style={{fontSize: 20,}}>검색어를 입력하세요.</Text>
      </View>
    );
  } else if (!searchPosts && searchText) {
    return (
      <View style={{marginTop: SCREEN_HEIGHT * 0.05,}}>
        <Text style={{fontSize: 20,}}>검색 결과가 없습니다.</Text>
      </View>
    );
  }
 };

 const userContent = () => {
  if (searchUsers && searchUsers.length == 0) {
    return (
      <View style={{marginTop: SCREEN_HEIGHT * 0.05,}}>
        <Text style={{fontSize: 20,}}>검색 결과가 없습니다.</Text>
      </View>
    );
  } else if (searchUsers) {
    return (
      searchUsers.map((user, index) => (
        <TouchableOpacity 
        style={styles.userContentView} 
        onPress={handleUserPress} 
        key={index}
        >
        <View style={styles.userContentImageView}>
          <Image 
            style={styles.userContentImage} 
            src={user.profileImgUrl } 
            />
        </View>

        <View style={styles.userContentRightView}>
          <View style={styles.userContentNicknameView}>
            <Text style={styles.userContentNickname}>{user.nickname}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ))
    );
  } else if (!searchUsers && !searchText) {
    return (
      <View style={{marginTop: SCREEN_HEIGHT * 0.05,}}>
        <Text style={{fontSize: 20,}}>검색어를 입력하세요.</Text>
      </View>
    );
  } else if (!searchUsers && searchText) {
    return (
      <View style={{marginTop: SCREEN_HEIGHT * 0.05,}}>
        <Text style={{fontSize: 20,}}>검색 결과가 없습니다.</Text>
      </View>
    );
  };
};

  const [isTagSearchModal, setIsTagSearchModal] = useState(false);

  const [searchTag, setSearchTag] = useState(false);

  const openTagSearchModal = () => {
    setIsTagSearchModal(true);
  };

  const closeTagSearchModal = () => {
    setIsTagSearchModal(false);
  };

  const handleTagPress = async (tagName) => {
    await getTagPostSearchData(tagName);
    setSearchTag(tagName);
    openTagSearchModal();
  };

 const tagContent = () => {
  if (searchTags && searchTags.length == 0) {
    return (
      <View style={{marginTop: SCREEN_HEIGHT * 0.05,}}>
        <Text style={{fontSize: 20,}}>검색 결과가 없습니다.</Text>
      </View>
    );
  } else if (searchTags) {
    return (
      <View style={styles.tagContentContainer}>
        {searchTags.map((tag, index) => {
          return (
            <View key={index}>
              <TouchableOpacity style={styles.tagContainer}
                onPress={() => {
                  handleTagPress(tag.tagNm);
                }}
              >
                <View style={styles.tagContent}>
                  <Text style={styles.tagName}># {tag.tagNm}</Text>
                </View>
              </TouchableOpacity>
            </View>
            );
          }
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isTagSearchModal}
          onRequestClose={closeTagSearchModal}
        >
          <SearchTagResult searchTag={searchTag} tagSearchPosts={tagSearchPosts} closeTagSearchModal={closeTagSearchModal} />
        </Modal>
      </View>
    );
  } else if (!searchTags && !searchText) {
    return (
      <View style={{marginTop: SCREEN_HEIGHT * 0.05,}}>
        <Text style={{fontSize: 20,}}>검색어를 입력하세요.</Text>
      </View>
    );
  } else if (!searchTags && searchText) {
    return (
      <View style={{marginTop: SCREEN_HEIGHT * 0.05,}}>
        <Text style={{fontSize: 20,}}>검색 결과가 없습니다.</Text>
      </View>
    );
  };
};

  return (
    <View style={styles.searchModalBackGround}>
      <View style={styles.searchModalContainer}>
        <TouchableOpacity
          style={styles.closeView}
          onPress={props.closeSearchModal}>
          <Image
            style={styles.closeImage}
            source={iconClose}
          />
        </TouchableOpacity>

        {searchView()}

        {tabView()}
        <ScrollView>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            ref={scrollViewRef}
          >
            {[0, 1, 2].map((idx) => (
              <View
                key={idx}
                style={styles.contents}
              >

                {idx === 0 && 
                  postContent()
                }
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={isDetailModalOpen}
                  onRequestClose={() => closeDetailModal()}>
                  <PostDetail closeDetailModal={closeDetailModal} postId={detailPost} />
                </Modal>

                {/*이용자 결과 컨테이너 구조*/}
                {idx === 1 && (
                  userContent()
                )}


                {/*태그 결과 컨테이너 구조*/}
                {idx === 2 && (
                  tagContent()
                )}
              </View>
            ))}
          </ScrollView>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchModalBackGround: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  searchModalContainer: {
    alignItems: "center",
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.88,
    marginBottom: SCREEN_HEIGHT * 0.1,
    position: "relative",
    borderWidth: 1,
    borderColor: "gainsboro",
    backgroundColor: "white",
    elevation: 5,
    borderRadius: 10,
  },
  closeView: {
    width: SCREEN_WIDTH * 0.06,
    height: SCREEN_WIDTH * 0.06,
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeImage: {
    width: SCREEN_WIDTH * 0.06,
    height: SCREEN_WIDTH * 0.06,
  },

// searchView
  searchTopView: {
    marginTop: SCREEN_HEIGHT * 0.05,
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.05,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginVertical: SCREEN_HEIGHT * 0.02,
  },
  searchInput: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_HEIGHT * 0.06,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    paddingLeft: SCREEN_WIDTH * 0.03,
    fontSize: 18,
  },
  searchIconView: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.07,
    height: SCREEN_WIDTH * 0.07,
    right: SCREEN_WIDTH * 0.12,
  },
  searchIcon: {
    width: SCREEN_WIDTH * 0.07,
    height: SCREEN_WIDTH * 0.07,
  },

 
  searchMiddleView: {
    marginTop: SCREEN_HEIGHT * 0.005,
    marginBottom: SCREEN_HEIGHT * 0.01,
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.062,
    flexDirection: "row",
    borderColor: "gainsboro",
  },

// tab view
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_HEIGHT * 0.06,
    backgroundColor: "rgb(249, 250, 208)",
  },
  activeTabButton: {
    backgroundColor: "rgb(235, 233, 152)",
  },

  tabButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },

  contents: {
    width: SCREEN_WIDTH * 0.9,
    alignItems: 'center',
  },

// post content
  searchPostBottomView: {
    width: SCREEN_WIDTH * 0.9,
    alignItems: "center",
  },
  searchPostListView: {
    marginVertical: 10,
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT * 0.32,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingVertical: SCREEN_HEIGHT * 0.01,
    borderWidth: 1,
    elevation: 5,
    borderColor: "gainsboro",
    paddingRight: 5,
  },
  searchPostListViewLeftView: {
    width: SCREEN_WIDTH * 0.24,
    height: SCREEN_HEIGHT * 0.2,
    backgroundColor: "white",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "space-around",
  },
  searchPostListProfileButtonView: {
    flexDirection: "row",
    width: SCREEN_WIDTH * 0.235,
    // justifyContent: "space-between",
    marginLeft: 3,
  },
  searchPostListViewRightView: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_HEIGHT * 0.3,
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "space-around",
  },
  searchPostListImageView: {
    width: SCREEN_WIDTH * 0.60,
    height: SCREEN_HEIGHT * 0.23,
  },
  searchPostListImage: {
    width: SCREEN_WIDTH * 0.60,
    height: SCREEN_HEIGHT * 0.22,
  },
  searchPostListBottomView: {
    width: SCREEN_WIDTH * 0.60,
    height: SCREEN_HEIGHT * 0.07,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  searchPostListTextView: {
    width: SCREEN_WIDTH * 0.48,
    height: SCREEN_HEIGHT * 0.06,
    justifyContent: "space-between",
  },
  searchPostListTitle: {
    fontSize: 19,
    fontWeight: "600",
  },
  searchPostListDate: {
    fontSize: 13,
    color: "grey",
  },

  searchPostListIconView: {
    width: SCREEN_WIDTH * 0.12,
    height: SCREEN_HEIGHT * 0.17,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchPostLikeIcon: {
    width: SCREEN_WIDTH * 0.055,
    height: SCREEN_WIDTH * 0.055,
  },
  searchPostLikeCountView: {
    width: SCREEN_WIDTH * 0.055,
    height: SCREEN_WIDTH * 0.055,
    justifyContent: "flex-end",
  },
  searchPostLikeCountText: {
    fontSize: 16,
    color: "rgb(146, 146, 0)",
  },

//프로필 컨테이너 관련
  userContentView: {
    backgroundColor: 'white',
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT * 0.1,
    flexDirection: 'row',
    justifyContent: "space-around",
    marginVertical: SCREEN_HEIGHT * 0.01,
    borderWidth: 1,
    borderColor: "gainsboro",
    elevation: 10,
    borderRadius: 10,
  },
  userContentImageView: {
    width: SCREEN_WIDTH * 0.2,
    height: SCREEN_HEIGHT * 0.1,
    justifyContent: "center",
    alignItems: "center",
  },
  userContentImage: {
    width: SCREEN_WIDTH * 0.17,
    height: SCREEN_WIDTH * 0.17,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "lightgrey",
  },
  userContentRightView: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_HEIGHT * 0.1,
    justifyContent: "center",
  },
  userContentNicknameView: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_HEIGHT * 0.05,
    justifyContent: "center",
  },
  userContentNickname: {
    fontSize: 18, 
    fontWeight: "600",
  },


  //태그 컨테이너 관련
  tagContentContainer : {
    flexDirection: "row",
    flexWrap: "wrap",
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT * 0.06,
    justifyContent: "space-between",
  },
  tagContainer: {
    width: SCREEN_WIDTH * 0.41,
    height: SCREEN_HEIGHT * 0.06,
    justifyContent: "flex-start",
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
    flexDirection: 'row',
    marginVertical: SCREEN_HEIGHT * 0.01,
    borderRadius: 25,

  },
  tagContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: SCREEN_WIDTH * 0.05,
  },
  tagName: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  searchBottomView: {
    marginBottom: SCREEN_HEIGHT * 0.01,
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.215,
    alignItems: "center"
  },

  //이용자 컨테이너 관련
  userContainer: {
    width: SCREEN_WIDTH*0.9,
    margin: 10,
    padding: 10,
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
  },
  userInfo: {
    marginLeft: SCREEN_WIDTH*0.1,
  },
  nickname: {
    fontWeight: 'bold',
  },


  //태그 눌렀을 때 나오는 모달 관련
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: SCREEN_HEIGHT * 0.12,
    height: SCREEN_HEIGHT * 0.95,
    width: SCREEN_WIDTH * 0.9,
    marginLeft: SCREEN_WIDTH * 0.05,
  },
  modalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeModalText: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.06,
    height: SCREEN_WIDTH * 0.06,
    top: SCREEN_WIDTH * 0.21,
    right: SCREEN_WIDTH * 0.05,
  },
});