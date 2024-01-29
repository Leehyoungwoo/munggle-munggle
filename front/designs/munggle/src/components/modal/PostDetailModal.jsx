import React from "react";
import "./PostDetailModal.css";
import Modal from "react-modal";
import PostDetailContent from "../Post/PostDetailContent";

import imgClose from "../../assets/icons/close1.png";
import imgClose2 from "../../assets/icons/close2.png";

const customStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: " rgba(0, 0, 0, 0.4)",
    width: "400px",
    height: "800px",
    borderRadius: "40px",
    zIndex: "10",
  },
  content: {
    width: "360px",
    height: "630px",
    zIndex: "150",
    position: "absolute",
    top: "385px",
    left: "200px",
    transform: "translate(-50%, -50%)",
    borderRadius: "10px",
    boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
    backgroundColor: "white",
    justifyContent: "center",
    overflow: "auto",
  },
};

Modal.setAppElement('#root');

export default function PostDetailModal(props) {
  const post = props.postData

  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.closeModal}
      shouldCloseOnOverlayClick={false}
      style={customStyles}
      contentLabel="Post Detail Modal"
    >
      <div className="post-detail-modal-container">
        <div className="post-detail-modal-top-div">
          <span className="post-detail-modal-top-span">{ post.id } 번 게시물</span>
        </div>
        
        <div onClick={props.closeModal} className="post-detail-modal-close-button-div">
          <img className="post-detail-modal-close-button" src={imgClose2} />
        </div>
        
        <PostDetailContent
          imgPost={post.imgPost}
          title={post.title}
          content={post.content}
          createdAt={post.createdAt}
          tagList={post.tagList}
        />

        <button className="post-detail-modal-submit-button btn btn-secondary" onClick={props.closeModal}>닫기</button>
      </div>
    </Modal>
  );
}