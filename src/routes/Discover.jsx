import React from "react";
import Navbar from "../components/navbar";
import "../css/search.css";
import ReactLoading from "react-loading";
import Drag from "../components/profileDrags";
import Logo from "../icons/logo.svg";
import { AiOutlineUser } from "react-icons/ai";

function Discover(props) {
  return (
    <div>
      <header className="homeHeader" id="navbar">
        <img src={Logo} width="20px" height="20px" alt="logo" />
        Blarbar
        <span className="desktopProfileIcon">
          <AiOutlineUser />
        </span>
      </header>
      <div className="searchDiscover tab" id="desktopDiscover">
        {!props.allDrags && (
          <ReactLoading
            type="spinningBubbles"
            color="royalblue"
            height={30}
            width={30}
            className="commentLoader"
          />
        )}
        {props.allDrags &&
          props.allDrags.map((drag, i) => {
            if (!drag.savedDrag) {
              return (
                <div className="dragContainer" key={i}>
                  <Drag
                    {...props}
                    drag={drag}
                    handleDrag={props.handleDrag}
                    handleComment={props.handleComment}
                  />
                </div>
              );
            }
          })}
      </div>
      <Navbar
        page="discover"
        count={props.newNotifications && props.newNotifications.length}
      />
    </div>
  );
}

export default Discover;
