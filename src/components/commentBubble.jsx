import React, { useState, useEffect } from "react";
import ReplyBubble from "./replyBubble";
import { NavLink } from "react-router-dom";
import moment from "moment";
import firebase from "firebase/app";
import profileImage from "../pics/avatar.png";

const CommentBubble = props => {
  const { replies } = props;
  const [id, setId] = useState("");
  const time = moment(props.createdAt.toDate()).fromNow();
  const userReplies = replies.filter(reply => reply.to === props.id);
  const replyBubble = userReplies.map((reply, i) => (
    <ReplyBubble
      {...reply}
      id={id}
      dragProps={props.dragProps}
      profilePicture={props.profilePicture}
      key={i}
      handleReplyStatus={props.handleReplyStatus}
    />
  ));
  const [showReplies, setShowReplies] = useState(false);

  useEffect(() => {
    checkUserData();
  }, []);

  const toggleRepliesVisibility = () => {
    setShowReplies(!showReplies);
  };
  const handleReplyStatus = () => {
    props.handleReplyStatus(props.id, props.userName);
  };
  // console.log(props);
  const checkUserData = () => {
    firebase
      .firestore()
      .collection("users")
      .get()
      .then(data => {
        data.forEach(user => {
          if (user.data().userName === props.userName) {
            setId(user.data().id);
            // console.log(this.state);
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  };
  return (
    <div className="bubbleWrapper">
      <div className="bubbleContainer">
        <div className="bubbleMainWrap">
          <div className="bubbleHeader">
            <span className="profilePic">
              <img
                src={props.profilePic ? props.profilePic : profileImage}
                alt="pic"
                width="100%"
              />
            </span>
            {/* <span className="userName">{props.userName}</span> */}
          </div>
          <div className="bubbleText">
            <NavLink
              to={
                id === props.dragProps.myId
                  ? {
                      pathname: "/profile"
                    }
                  : {
                      pathname: `/userProfile/${props.userName}`,
                      state: {
                        id: id,
                        myId: props.dragProps.myId
                      }
                    }
              }
            >
              <span className="userName">{props.userName}</span>
            </NavLink>
            {props.text}
          </div>
        </div>
        <div className="bubbleDetails">
          <span className="bubbleTime">{time}</span>
          <span className="bubbleReply">
            <button onClick={handleReplyStatus}>Reply</button>
          </span>
        </div>
      </div>
      <div
        className="toggleRepliesBtn"
        onClick={toggleRepliesVisibility}
        style={{ display: userReplies.length < 2 && "none" }}
      >
        {showReplies
          ? "hide replies"
          : `show all replies (${userReplies.length})`}
      </div>
      <div className="bubbleReplies">
        {showReplies ? replyBubble : replyBubble[0]}
      </div>
    </div>
  );
};

export default CommentBubble;
