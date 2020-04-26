import React from "react";
import Navbar from "../components/navbar";
import ReactLoading from "react-loading";
import Notification from "../components/Notification";

const Notifications = props => {
  return (
    <div className="notificationsContainer">
      <div className="notificationsHeader">
        <span className="headerTitle">Notifications</span>
      </div>
      <div className="notificationsContainer">
        {!props.notifications ? (
          <ReactLoading
            type="spinningBubbles"
            color="royalblue"
            height={30}
            width={30}
            className="notificationsLoader"
          />
        ) : (
          props.notifications &&
          props.notifications.map((notification, i) => (
            <Notification
              notificationId={notification.id}
              {...notification}
              {...props}
              checkNotifications={props.checkNotifications}
              key={i}
            />
          ))
        )}
        {props.notifications && props.notifications.length === 0 && (
          <span>No notifications</span>
        )}
      </div>
      <Navbar page="notifications" />
    </div>
  );
};

export default Notifications;
