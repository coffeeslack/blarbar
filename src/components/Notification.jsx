import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../css/notification.css";
import firebase from "firebase/app";
import moment from "moment";
import profileImage from "../pics/avatar.png";
import "lazysizes";
// import a plugin
import "lazysizes/plugins/parent-fit/ls.parent-fit";

const Notification = props => {
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const date = moment(props.createdAt.toDate()).fromNow();
  // console.log(props);
  useEffect(() => {
    checkUserData();
    viewedNotifications();
  }, []);

  const viewedNotifications = () => {
    firebase
      .firestore()
      .collection("notifications")
      .doc(`${props.notificationId}`)
      .update({
        viewed: true
      })
      .then(props.checkNotifications())
      .catch(error => {
        console.log(error);
      });
  };

  const checkUserData = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(`${props.from}`)
      .get()
      .then(user => {
        setProfilePic(user.data().profilePic);
        setUserName(user.data().userName);
        // console.log(user.data().profilePic, profilePic);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div className="notificationContainer">
      <div className="notificationImage">
        {/* <img src={profilePic ? profilePic : profileImage} width="100%" /> */}
        <img
          data-src={profilePic ? profilePic : profileImage}
          className="lazyload"
        />
      </div>
      <div className="notificationText">
        <div className="notificationMessage">
          <NavLink
            to={
              props.from === props.id
                ? {
                    pathname: "/profile"
                  }
                : {
                    pathname: `/userProfile/${userName}`,
                    state: {
                      id: props.from,
                      myId: props.id
                    }
                  }
            }
          >
            <span className="notificationUserName">{userName}</span>
          </NavLink>
          <span style={{ display: !userName && "none" }}>{props.text} </span>
          <br />
          <span
            style={{ display: !userName && "none" }}
            className="notificationDate"
          >
            {date}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Notification;
