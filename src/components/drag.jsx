import React, { useState } from "react";
import Comment from "./comment";
import { NavLink } from "react-router-dom";
import "../css/drag.css";
import moment from "moment";
import firebase from "firebase/app";
import numeral from "numeral";
import uuid from "uuid";
import { FaUsers } from "react-icons/fa";
import { MdMoreVert } from "react-icons/md";
import { IoIosFlash, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import profilePic from "../pics/avatar.png";
import "lazysizes";
import "lazysizes/plugins/parent-fit/ls.parent-fit";
import DragUsersModal from "./DragUsersModal";

const Drag = props => {
  const { leftDrag, rightDrag, selectedDrag } = props.drag;
  const totalDrags = leftDrag.drags + rightDrag.drags;
  const leftDragPercent = Math.floor((leftDrag.drags / totalDrags) * 100);
  const rightDragPercent = Math.ceil((rightDrag.drags / totalDrags) * 100);
  const date = moment(props.drag.createdAt.toDate()).fromNow();
  const [displayMenu, setDisplayMenu] = useState(false);
  const [displayDeletePrompt, setDisplayDeletePrompt] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false)

  const imageSrc =
    props.drag.for === props.id ? props.profilePic : props.drag.profilePic;
  const handleMenuDisplay = value => {
    setDisplayMenu(value);
  };

  const handleDisplayDeletePrompt = value => {
    setDisplayDeletePrompt(value);
  };

  const openUsersModal= () => {
    setShowUsersModal(true)
  }

  const closeUsersModal= () => {
    setShowUsersModal(false)
  }

  const showMenu = () => {
    handleMenuDisplay(true);
  };

  const handleSave = () => {
    let drag = {
      dragId: props.drag.id,
      userId: props.id,
      id: uuid()
    };
    firebase
      .firestore()
      .collection("savedDrags")
      .doc(`${drag.id}`)
      .set(drag)
      .then(() => props.handleDataCheck())
      .catch(error => {
        console.log(error);
      });
    handleDisplayDeletePrompt(false);
  };

  const handleDelete = () => {
    firebase
      .firestore()
      .collection("drags")
      .doc(`${props.drag.id}`)
      .delete()
      .then(() => {
        props.handleDelete(props.drag.id);
      })
      .catch(error => {
        console.log(error);
      });
    handleDisplayDeletePrompt(false);
  };

  const handleUnfollow = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(`${props.id}`)
      .update({
        following: firebase.firestore.FieldValue.arrayRemove({
          userId: props.drag.for
        })
      })
      .then(() => {
        firebase
          .firestore()
          .collection("users")
          .doc(`${props.drag.for}`)
          .update({
            followers: firebase.firestore.FieldValue.arrayRemove({
              userId: props.id
            })
          })
          .then(props.handleDataCheck())
          .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
  };

  const DragPercent = prop => {
    if (!selectedDrag) {
      return "...";
    } else if (totalDrags === 0) {
      return "0";
    } else {
      return `${prop.drag}%`;
    }
  };

  const Caption = () => {
    const [displayCaption, setDisplayCaption] = useState(false);

    if (props.drag.caption.length > 250 && !displayCaption) {
      return (
        <span>
          {props.drag.caption.slice(0, 220)}
          <span
            style={{ color: "grey", fontSize: "13px" }}
            onClick={() => setDisplayCaption(true)}
          >
            ...show more
            <IoIosArrowDown />
          </span>
        </span>
      );
    } else if (props.drag.caption.length > 250 && displayCaption) {
      return (
        <span>
          {props.drag.caption}
          <span
            style={{ color: "grey", fontSize: "13px" }}
            onClick={() => setDisplayCaption(false)}
          >
            ...show less
            <IoIosArrowUp />
          </span>
        </span>
      );
    } else if (props.drag.caption.length < 250 && displayCaption) {
      return <span>{props.drag.caption}</span>;
    } else {
      return <span>{props.drag.caption}</span>;
    }
  };

  return (
    <div className="main-container">
      <div
        className="dragMenu"
        style={{ display: !displayMenu && "none" }}
        onClick={() => handleMenuDisplay(false)}
      >
        <div
          className="dragMenuBox"
          style={{ display: !displayMenu && "none" }}
        >
          <NavLink
            to={{
              pathname: `/edit/${props.drag.id}`,
              state: { ...props.drag, backPath: "/" }
            }}
            exact
          >
            <div
              style={{
                display: props.drag.for !== props.id && "none",
                borderBottom: " 0.5px solid lightgrey"
              }}
            >
              Edit
            </div>
          </NavLink>
          <div onClick={handleSave}>Save</div>
          <div
            style={{
              display: props.drag.for === props.id && "none",
              color: "#f5778c",
              fontWeight: "bolder",
              borderBottom: "none"
            }}
            onClick={handleUnfollow}
          >
            Unfollow
          </div>
          <div
            onClick={() => handleDisplayDeletePrompt(true)}
            style={{
              display: props.drag.for !== props.id && "none",
              color: "#f5778c",
              fontWeight: "bolder"
            }}
          >
            Delete
          </div>
        </div>
      </div>
      <div
        className="deletePrompt"
        style={{ display: !displayDeletePrompt && "none" }}
      >
        <div className="deletePromptBox">
          <div>Delete this drag?</div>
          <div
            className="promptOptionNo"
            onClick={() => handleDisplayDeletePrompt(false)}
          >
            No
          </div>
          <div className="promptOption" onClick={handleDelete}>
            Yes
          </div>
        </div>
      </div>
      <div className="drag-container" id={props.drag.id}>
        <div className="dragHeader">
          <div className="dragUserDetails">
            <div className="dragProfilePic">
              <img
                data-src={imageSrc ? imageSrc : profilePic}
                className="lazyload"
              />
            </div>
            <NavLink
              to={
                props.drag.for === props.id
                  ? {
                      pathname: "/profile"
                    }
                  : {
                      pathname: `/userProfile/${props.drag.userName}`,
                      state: {
                        id: props.drag.for,
                        myId: props.id
                      }
                    }
              }
            >
              <div className="dragHeaderName">
                <div className="dragHeaderDisplayName">
                  {props.drag.displayName}
                </div>
                <div className="dragHeaderUserName">@{props.drag.userName}</div>
              </div>
            </NavLink>
          </div>
          <div className="dragOptionBtns">
            <div
              className="menuBtn"
              onClick={() => {
                showMenu();
              }}
            >
              <MdMoreVert />
            </div>
          </div>
        </div>
        <div
          className="drag-text"
          style={{ display: !props.drag.caption && "none" }}
        >
          <Caption />
        </div>
        <div
          className="pic-container"
          style={{
            display:
              (props.drag.picture1 && "none") || (!props.drag.picture && "none")
          }}
        >
          <img data-src={props.drag.picture} className="lazyload" />
        </div>
        <div
          className="pic-container"
          style={{
            display:
              (props.drag.picture && "none") || (!props.drag.picture1 && "none")
          }}
        >
          <div className="image1">
            <img data-src={props.drag.picture1} className="lazyload" />
          </div>
          <div className="flashIcon">
            <IoIosFlash />
          </div>
          <div className="image2">
            <img data-src={props.drag.picture2} className="lazyload" />
          </div>
        </div>
        <div className="drags" style={{ display: !leftDrag.title && "none" }}>
          <form name="dragForm">
            <label
              className={
                selectedDrag === "leftDrag" ? "drag-one selected" : "drag-one"
              }
            >
              <input
                type="radio"
                name="drag"
                value="leftDrag"
                className={props.drag.id}
                checked={selectedDrag === "leftDrag" && "checked"}
                onChange={props.handleDrag}
              />
              <span>{leftDrag.title}</span>
            </label>
            <label
              className={
                selectedDrag === "rightDrag" ? "drag-two selected" : "drag-two"
              }
            >
              <input
                type="radio"
                name="drag"
                value="rightDrag"
                className={props.drag.id}
                checked={selectedDrag === "rightDrag" && "checked"}
                onChange={props.handleDrag}
              />
              <span>{rightDrag.title}</span>
            </label>
          </form>
        </div>
        <div
          className="drag-lines"
          style={{ display: !leftDrag.title && "none" }}
        >
          <div
            className={
              selectedDrag === "leftDrag"
                ? "drag-line-one selectedBg"
                : "drag-line-one"
            }
            style={{ width: `${leftDragPercent}%` }}
          ></div>
          <div
            className={
              selectedDrag === "rightDrag"
                ? "drag-line-two selectedBg"
                : "drag-line-two"
            }
            style={{ width: `${rightDragPercent}%` }}
          ></div>
        </div>
        <div
          className="drag-details"
          style={{ display: !leftDrag.title && "none" }}
        >
          <span
            className={
              selectedDrag === "leftDrag"
                ? "drag-one-percent selectedBg"
                : "drag-one-percent"
            }
          >
            <DragPercent drag={leftDragPercent} />
          </span>
          <span className="total-drags" onClick={openUsersModal}>
            <span
              style={{
                marginRight: "5px",
                display: "inline-flex",
                alignItems: "center"
              }}
            >
              <FaUsers />
            </span>
            {numeral(totalDrags).format("0a")}
          </span>
          <span
            className={
              selectedDrag === "rightDrag"
                ? "drag-two-percent selectedBg"
                : "drag-two-percent"
            }
          >
            <DragPercent drag={rightDragPercent} />
          </span>
        </div>
        <div>
          {props.drag.comments ? (
            <Comment
              myId={props.id}
              userId={props.drag.for}
              comments={props.drag.comments}
              id={props.drag.id}
              handleComment={props.handleComment}
              leftDragTitle={leftDrag.title}
              rightDragTitle={rightDrag.title}
              date={date}
              userName={props.userName}
              profilePic={props.profilePic}
            />
          ) : (
            ""
          )}
        </div>
        <div className="dragUsersModalWrapper" style={{display: !showUsersModal && "none"}}>
          <DragUsersModal {...props} closeUsersModal={closeUsersModal} />
        </div>
      </div>
    </div>
  );
};

export default Drag;
