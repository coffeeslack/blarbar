import React from "react";
import CommentBubble from "../components/commentBubble";
import { NavLink } from "react-router-dom";
import "../css/comment.css";
import firebase from "firebase/app";
import uuid from "uuid";
import ReactLoading from "react-loading";
import { MdSend } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
// import ContentLoader, { BulletList } from "react-content-loader";

class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props,
      dragProps: props.location.state,
      userIsReplying: false,
      userIsReplyingTo: "",
      userIsReplyingToUserName: "",
      profilePic: props.location.state.profilePic
    };
  }

  componentDidMount() {
    this.checkComments();
    // console.log(this.state.state)
  }

  onComment = e => {
    e.preventDefault();
    const { value, id } = e.target.comment;

    const newComment = {
      for: id,
      text: value,
      id: uuid(),
      userName: this.state.state.userName,
      profilePic: this.state.state.profilePic,
      createdAt: new Date()
    };
    firebase
      .firestore()
      .collection("comments")
      .doc(`${newComment.id}`)
      .set(newComment)
      .then()
      .catch(error => {
        console.log(error);
      });
    this.checkComments();
    e.target.comment.value = "";
  };

  checkComments = () => {
    firebase
      .firestore()
      .collection("comments")
      .get()
      .then(data => {
        let allComments = [];
        data.forEach(doc => {
          if (doc.data() && doc.data().for === this.state.dragProps.id) {
            allComments.push(doc.data());
          }
        });
        const comments = allComments.filter(comment => !comment.to);
        comments.sort(function(a, b) {
          return a.createdAt > b.createdAt ? -1 : 1;
        });
        const replies = allComments.filter(comment => !!comment.to);
        replies.sort(function(a, b) {
          return a.createdAt > b.createdAt ? -1 : 1;
        });
        this.setState(prevState => ({ ...prevState, comments, replies }));
      })
      .catch(error => {
        console.log(error);
      });
  };

  changeReplyStatus = (replyingTo, replyingToUserName) => {
    const userIsReplyingTo = replyingTo;
    const userIsReplyingToUserName = replyingToUserName;
    this.setState(prevState => ({
      ...prevState,
      userIsReplying: true,
      userIsReplyingTo,
      userIsReplyingToUserName
    }));
    document.querySelector(".commentInput").focus();
  };

  cancelReply = () => {
    this.setState(prevState => ({
      ...prevState,
      userIsReplying: false
    }));
    document.querySelector(".commentInput").focus();
  };

  onReply = e => {
    e.preventDefault();
    const { value, id } = e.target.comment;

    const newComment = {
      to: this.state.userIsReplyingTo,
      replyingTo: this.state.userIsReplyingToUserName,
      userName: this.state.state.userName,
      text: value,
      for: id,
      id: uuid(),
      profilePic: this.state.state.profilePic,
      createdAt: new Date()
    };

    firebase
      .firestore()
      .collection("comments")
      .doc(`${newComment.id}`)
      .set(newComment)
      .then()
      .catch(error => {
        console.log(error);
      });
    e.target.comment.value = "";
    this.checkComments();
    this.cancelReply();
  };

  goBack = () => {
    window.history.back();
  };

  render() {
    return (
      <div className="commentsPage">
        <div className="commentsHeader">
          {/* <NavLink to="/" exact> */}
          <span className="backBtn" onClick={this.goBack}>
            <IoMdArrowRoundBack />
          </span>
          {/* </NavLink> */}
          <span className="headerTitle">Comments</span>
          <span className="commentsDragTitle">
            {this.state.dragProps.leftDragTitle}{" "}
            <span
              style={{ display: !this.state.dragProps.leftDragTitle && "none" }}
            >
              vs
            </span>{" "}
            {this.state.dragProps.rightDragTitle}
          </span>
        </div>
        <div className="commentsBodyContainer">
          <div className="commentsBody">
            {!this.state.comments && (
              <ReactLoading
                type="spinningBubbles"
                color="royalblue"
                height={30}
                width={30}
                className="commentLoader"
              />
            )}
            {this.state.comments &&
              this.state.comments.map((comment, i) => (
                <CommentBubble
                  {...comment}
                  dragProps={this.state.dragProps}
                  key={i}
                  replies={this.state.replies}
                  handleReplyStatus={this.changeReplyStatus}
                  userIsReplying={this.state.userIsReplying}
                  profilePicture={this.state.profilePic}
                />
              ))}
          </div>
          <div className="commentBox">
            <div className="commentBoxBorder"></div>
            <div
              className="commentBoxReplyingContainer"
              style={{ display: !this.state.userIsReplying && "none" }}
            >
              Replying to <span>{this.state.userIsReplyingToUserName}</span>
              <button onClick={this.cancelReply}>cancel</button>
            </div>
            <form
              onSubmit={
                this.state.userIsReplying ? this.onReply : this.onComment
              }
            >
              <input
                type="text"
                name="comment"
                placeholder={
                  this.state.userIsReplying ? "comment reply.." : "comment..."
                }
                id={this.state.dragProps.id}
                className="commentInput"
                autoFocus
              />
              <button>
                <MdSend />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Comments;
