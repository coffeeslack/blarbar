import React, { useState } from "react";
import Comment from "./comment";
import { NavLink } from "react-router-dom";
import "../css/drag.css";
import moment from "moment";
import firebase from "firebase/app";
import numeral from "numeral";
import { FaUsers } from "react-icons/fa";
import { MdMoreVert } from "react-icons/md";
import { IoIosFlash } from "react-icons/io";
import profilePic from "../pics/avatar.png";
import "lazysizes";
import "lazysizes/plugins/parent-fit/ls.parent-fit";

const Drag = props => {
  const { leftDrag, rightDrag, selectedDrag } = props.drag;
  const [_selectedDrag, setSelectedDrag] = useState(selectedDrag);
  const [_leftDrag, setLeftDrag] = useState(leftDrag);
  const [_rightDrag, setRightDrag] = useState(rightDrag);
  const [_userHasDragged, setUserHasDragged] = useState(false);
  const totalDrags = _leftDrag.drags + _rightDrag.drags;
  const leftDragPercent = Math.floor((_leftDrag.drags / totalDrags) * 100);
  const rightDragPercent = Math.ceil((_rightDrag.drags / totalDrags) * 100);
  const date = moment(props.drag.createdAt.toDate()).fromNow();
  const [displayMenu, setDisplayMenu] = useState(false);
  const [displayDeletePrompt, setDisplayDeletePrompt] = useState(false);

  const imageSrc =
    props.drag.for === props.id ? props.profilePic : props.drag.profilePic;

  const onDrag = (value, state) => {
    if (value === "leftDrag") {
      firebase
        .firestore()
        .collection("drags")
        .doc(`${state.drag.id}`)
        .update({
          "leftDrag.drags": firebase.firestore.FieldValue.increment(1)
        })
        .then()
        .catch(error => {
          console.log(error);
        });
      firebase
        .firestore()
        .collection("clickedDrags")
        .add({
          dragId: state.drag.id,
          userId: state.id,
          selectedDrag: "leftDrag"
        })
        .then(() => {
          props.handleClickedDrags();
        })
        .catch(error => {
          console.log(error);
        });
    }
    if (value === "rightDrag") {
      firebase
        .firestore()
        .collection("drags")
        .doc(`${state.drag.id}`)
        .update({
          "rightDrag.drags": firebase.firestore.FieldValue.increment(1)
        })
        .then()
        .catch(error => {
          console.log(error);
        });
      firebase
        .firestore()
        .collection("clickedDrags")
        .add({
          dragId: state.drag.id,
          userId: state.id,
          selectedDrag: "rightDrag"
        })
        .then(() => {})
        .catch(error => {
          console.log(error);
        });
    }
  };

  const handleChange = (value, state) => {
    let clickedDrag = state.clickedDrags
      ? state.clickedDrags.filter(
          clickedDrag => clickedDrag.dragId === state.drag.id
        )
      : [];

    if (clickedDrag.length > 0) {
    } else if (
      clickedDrag.length === 0 &&
      _userHasDragged === false &&
      value === "rightDrag"
    ) {
      setSelectedDrag("rightDrag");
      setUserHasDragged(true);
      setRightDrag(prevState => ({ ...prevState, drags: prevState.drags + 1 }));
      onDrag(value, state);
    } else if (
      clickedDrag.length === 0 &&
      _userHasDragged === false &&
      value === "leftDrag"
    ) {
      setSelectedDrag("leftDrag");
      setUserHasDragged(true);
      setLeftDrag(prevState => ({ ...prevState, drags: prevState.drags + 1 }));
      onDrag(value, state);
    }
  };

  const handleMenuDisplay = value => {
    setDisplayMenu(value);
  };

  const handlePrompt = value => {
    setDisplayDeletePrompt(value);
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
    handlePrompt(false);
    props.handleDataCheck();
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
    if (!_selectedDrag) {
      return "...";
    } else if (totalDrags === 0) {
      return "0";
    } else {
      return `${prop.drag}%`;
    }
  };

  const Prompt = props => (
    <div
      className="deletePrompt"
      style={{ display: !displayDeletePrompt && "none" }}
    >
      <div className="deletePromptBox">
        <div>{props.message}</div>
        <div className="promptOptionNo" onClick={props.handleNo}>
          No
        </div>
        <div className="promptOption" onClick={props.handleYes}>
          Yes
        </div>
      </div>
    </div>
  );

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
          {" "}
          <NavLink
            to={{
              pathname: `/edit/${props.drag.id}`,
              state: { ...props.drag }
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
          <div style={{ display: props.drag.savedDrag && "none" }}>Save</div>
          <div
            onClick={() => handlePrompt(true)}
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
      <Prompt
        message={"Delete this drag?"}
        handleNo={() => handlePrompt(false)}
        handleYes={handleDelete}
      />
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
            <div className="menuBtn" onClick={() => handleMenuDisplay(true)}>
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
                _selectedDrag === "leftDrag" ? "drag-one selected" : "drag-one"
              }
            >
              <input
                type="radio"
                name="drag"
                checked={_selectedDrag === "leftDrag" && "checked"}
                onChange={() => {
                  handleChange("leftDrag", { ...props });
                }}
              />
              <span>{leftDrag.title}</span>
            </label>
            <label
              className={
                _selectedDrag === "rightDrag" ? "drag-two selected" : "drag-two"
              }
            >
              <input
                type="radio"
                name="drag"
                checked={_selectedDrag === "rightDrag" && "checked"}
                onChange={() => {
                  handleChange("rightDrag", { ...props });
                }}
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
              _selectedDrag === "leftDrag"
                ? "drag-line-one selectedBg"
                : "drag-line-one"
            }
            style={{ width: `${leftDragPercent}%` }}
          ></div>
          <div
            className={
              _selectedDrag === "rightDrag"
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
              _selectedDrag === "leftDrag"
                ? "drag-one-percent selectedBg"
                : "drag-one-percent"
            }
          >
            <DragPercent drag={leftDragPercent} />
          </span>
          <span className="total-drags">
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
              _selectedDrag === "rightDrag"
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
              comments={props.drag.comments}
              id={props.drag.id}
              myId={props.id}
              userId={props.drag.for}
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
      </div>
    </div>
  );
};

export default Drag;
