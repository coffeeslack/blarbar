import React from "react";
import sendBtn from "../icons/send.svg";
import { NavLink } from "react-router-dom";
import "../css/comment.css";
import { MdSend } from "react-icons/md";

const Comment = props => {
  // console.log(props.comments);
  const comments =
    props.comments.length > 1
      ? [
          props.comments[props.comments.length - 1],
          props.comments[props.comments.length - 2]
        ]
      : props.comments;
  const Text = props => {
    if (props.comment.text.length < 80) {
      return <span>{props.comment.text}</span>;
    } else {
      return (
        <span>
          {`${props.comment.text.slice(0, 80)}...`}
          <NavLink
            to={{
              pathname: `/comments/${props.id}`,
              state: {
                id: props.id,
                leftDragTitle: props.leftDragTitle,
                rightDragTitle: props.rightDragTitle,
                userName: props.userName,
                profilePic: props.profilePic
              }
            }}
          >
            <span style={{ fontWeight: "bolder", color: "grey" }}>more</span>
          </NavLink>
        </span>
      );
    }
  };
  return (
    <div className="commentContainer">
      <div className="commentBox">
        <form onSubmit={props.handleComment}>
          <input
            type="text"
            name="comment"
            placeholder="comment..."
            id={props.id}
          />
          <button>
            <MdSend />
          </button>
        </form>
      </div>
      <div className="commentsContainer">
        {props.comments.length > 0 &&
          comments.map((comment, i) => {
            return (
              <div className="comment" key={i}>
                <span className="commentText">
                  <span className="commentUserName">{comment.userName} </span>
                  <Text comment={comment} {...props} />
                </span>
              </div>
            );
          })}
        <div className="commentDetails">
          <div className="commentCount">
            {props.comments.length > 1
              ? `${props.comments.length} comments`
              : `${props.comments.length} comment`}
          </div>
          <NavLink
            to={{
              pathname: `/comments/${props.id}`,
              state: {
                id: props.id,
                leftDragTitle: props.leftDragTitle,
                rightDragTitle: props.rightDragTitle,
                userName: props.userName,
                profilePic: props.profilePic,
                myId: props.myId,
                userId: props.userId
              }
            }}
            exact
          >
            <div
              className="commentViewBtn"
              style={{ visibility: props.comments.length < 1 && "hidden" }}
            >
              view all comments
            </div>
          </NavLink>
          <div className="postTime">{props.date}</div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
