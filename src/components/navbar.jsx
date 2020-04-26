import React from "react";
import { NavLink } from "react-router-dom";
import "../css/navbar.css";
import {
  AiOutlineHome,
  AiOutlineSearch,
  AiOutlineBell,
  AiOutlineUser,
  AiOutlineCompass
} from "react-icons/ai";
import { MdAddCircle } from "react-icons/md";

function navbar(props) {
  return (
    <div className="navbar">
      <div className="gradientBorder"></div>
      <NavLink to="/">
        <div className="navIcon">
          {props.page === "home" ? (
            <AiOutlineHome className="iconSelected" />
          ) : (
            <AiOutlineHome className="icon" />
          )}
        </div>
      </NavLink>
      <NavLink to="/search">
        <div className="navIcon searchIcon">
          {props.page === "search" ? (
            <AiOutlineSearch className="iconSelected" />
          ) : (
            <AiOutlineSearch className="icon" />
          )}
        </div>
      </NavLink>
      <NavLink to="/create">
        <div className="navIcon">
          <MdAddCircle className="addIcon" />
        </div>
      </NavLink>
      <NavLink to="/discover">
        <div className="navIcon discoverIcon">
          {props.page === "discover" ? (
            <AiOutlineCompass className="iconSelectedBlue" />
          ) : (
            <AiOutlineCompass className="icon" />
          )}
        </div>
      </NavLink>
      <NavLink to="/notifications">
        <div className="navIcon notificationsIcon">
          {props.page === "notifications" ? (
            <AiOutlineBell className="iconSelectedBlue" />
          ) : (
            <AiOutlineBell className="icon" />
          )}
          <div
            className="notificationCount"
            style={{ display: props.count > 0 && "inline-flex" }}
          >
            {props.count}
          </div>
        </div>
      </NavLink>
      <NavLink to="/profile">
        <div className="navIcon profileIcon">
          {props.page === "profile" ? (
            <AiOutlineUser className="iconSelectedBlue" />
          ) : (
            <AiOutlineUser className="icon" />
          )}
        </div>
      </NavLink>
    </div>
  );
}

export default navbar;
