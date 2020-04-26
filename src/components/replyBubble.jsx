import React from "react";
import moment from "moment";
import { NavLink } from "react-router-dom";
import profileImage from "../pics/avatar.png";

const ReplyBubble = props => {
  // console.log(props);
  const time = moment(props.createdAt.toDate()).fromNow();
  return (
    <div className="replyBubble">
      <div className="replyBubblePic">
        <img
          src={props.profilePic ? props.profilePic : profileImage}
          width="100%"
        />
      </div>
      <div className="replyBubbleComment">
        <NavLink
          to={
            props.id === props.dragProps.myId
              ? {
                  pathname: "/profile"
                }
              : {
                  pathname: `/userProfile/${props.userName}`,
                  state: {
                    id: props.id,
                    myId: props.dragProps.myId
                  }
                }
          }
        >
          <div className="replyBubbleUserName">{props.userName}</div>
        </NavLink>
        <span className="replyBubbleTo">@{props.replyingTo}</span>
        {props.text}
      </div>
      <div className="replyBubbleDetails">
        <span className="replyBubbleTime">{time}</span>
        <span className="replyBubbleReply">
          <button
            onClick={() => props.handleReplyStatus(props.to, props.userName)}
          >
            Reply
          </button>
        </span>
      </div>
    </div>
  );
};

export default ReplyBubble;
