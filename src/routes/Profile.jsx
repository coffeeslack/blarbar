import React, { useState } from "react";
import "../css/profile.css";
import Navbar from "../components/navbar";
import { Redirect, NavLink } from "react-router-dom";
import Drag from "../components/drag";
import numeral from "numeral";
import ReactLoading from "react-loading";
import { MdMoreVert } from "react-icons/md";
import coverPhoto from "../pics/pic1.png";
import profilePic from "../pics/avatar.png";

const Profile = props => {
  const myDrags = () => {
    let noOfDrags = 0;
    props.drags &&
      props.drags.map((drag, i) => {
        if (!drag.savedDrag && drag.for === props.id) {
          noOfDrags += 1;
        }
      });
    return noOfDrags;
  };

  const changeTab = num => {
    const tabs = document.querySelectorAll(".tab");
    const profileTabBtn = document.querySelectorAll(".profileTabBtn");
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].style.display = "none";
      profileTabBtn[i].classList.remove("selectedTab");
    }
    tabs[num].style.display = "block";
    profileTabBtn[num].classList.add("selectedTab");
  };

  const [displayMenu, setDisplayMenu] = useState(false);
  const [displayPrompt, setDisplayPrompt] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const handleRedirect = () => {
    setRedirect(true);
  };
  const renderRedirect = () => {
    if (redirect) {
      return <Redirect to="/" />;
    }
  };
  const handleMenuDisplay = value => {
    setDisplayMenu(value);
  };
  const handlePromptDisplay = value => {
    setDisplayPrompt(value);
    handleMenuDisplay(false);
  };
  const handleLogOut = () => {
    props.handleLogOut();
    handleRedirect();
  };
  const Bio = () => {
    const [displayBio, setDisplayBio] = useState(false);

    if (props.bio.length > 250 && !displayBio) {
      return (
        <span>
          {props.bio.slice(0, 220)}
          <span
            style={{ color: "grey", fontSize: "13px" }}
            onClick={() => setDisplayBio(true)}
          >
            ...show more
          </span>
        </span>
      );
    } else if (props.bio.length > 250 && displayBio) {
      return (
        <span>
          {props.bio}
          <span
            style={{ color: "grey", fontSize: "13px" }}
            onClick={() => setDisplayBio(false)}
          >
            ...show less
          </span>
        </span>
      );
    } else if (props.bio.length < 250 && displayBio) {
      return <span>{props.bio}</span>;
    } else {
      return <span>{props.bio}</span>;
    }
  };
  return (
    <div className="profileContainer">
      {renderRedirect()}
      {/* {console.log(myDrags())} */}
      <div>
        {!props.drags ? (
          <ReactLoading
            type="spinningBubbles"
            color="royalblue"
            height={30}
            width={30}
            className="commentLoader"
          />
        ) : (
          <div>
            <div className="commentsHeader" id="profileNavbar">
              <span className="headerTitle">Profile</span>
              <span
                className="profileMenuBtn"
                onClick={() => handleMenuDisplay(true)}
              >
                <MdMoreVert />
              </span>
            </div>
            <div
              className="profileMenu"
              style={{ display: !displayMenu && "none" }}
              onClick={() => handleMenuDisplay(false)}
            ></div>
            <div
              className="profileMenuBox"
              style={{ display: !displayMenu && "none" }}
            >
              {/* <div>Copy profile URL</div> */}
              <div onClick={() => handlePromptDisplay(true)}>Log out</div>
            </div>
            <div
              className="LogOutPrompt"
              style={{ display: !displayPrompt && "none" }}
            >
              <div className="logOutPromptBox">
                <div>Are you sure you want to Log out?</div>
                <div
                  className="promptOptionNo"
                  onClick={() => handlePromptDisplay(false)}
                >
                  No
                </div>
                <div className="promptOption" onClick={handleLogOut}>
                  Yes
                </div>
              </div>
            </div>
            <div className="profileBody">
              <div className="profileCoverPhoto">
                <div className="coverPhoto">
                  <img
                    src={props.coverPhoto ? props.coverPhoto : coverPhoto}
                    width="100%"
                  />
                </div>
              </div>
              <div className="profileDetails">
                <div className="profileUserDetails">
                  <div className="profileProfilePic">
                    <img
                      src={props.profilePic ? props.profilePic : profilePic}
                      width="100%"
                    />
                  </div>
                  <div className="profileUserNameContainer">
                    <div className="profileDisplayName">
                      {props.displayName}
                    </div>
                    <div className="profileUserName">@{props.userName}</div>
                  </div>
                  <div className="profileEditBtn">
                    <NavLink to="/editProfile">
                      <button>edit profile</button>
                    </NavLink>
                  </div>
                </div>
                <div className="profileFollow">
                  <div className="profileFollowContainer">
                    <div className="profileFollowNum">{myDrags()}</div>
                    <div className="profileFollowLabel">drags</div>
                  </div>
                  <div className="profileFollowContainer">
                    <div className="profileFollowNum">
                      {numeral(
                        props.followers && props.followers.length
                      ).format("0a")}
                    </div>
                    <div className="profileFollowLabel">followers</div>
                  </div>
                  <div className="profileFollowContainer">
                    <div className="profileFollowNum">
                      {numeral(
                        props.following && props.following.length
                      ).format("0a")}
                    </div>
                    <div className="profileFollowLabel">following</div>
                  </div>
                </div>
                <div
                  className="profileBio"
                  style={{
                    display: props.bio === "" && "none"
                  }}
                >
                  {/* {props.bio} */}
                  <Bio />
                </div>
              </div>
              <div className="profileTab">
                <div className="profileTabMenu">
                  <div
                    className="profileTabBtn selectedTab"
                    onClick={() => changeTab(0)}
                  >
                    Drags
                  </div>
                  <div className="profileTabBtn" onClick={() => changeTab(1)}>
                    Saved
                  </div>
                </div>
                <div
                  className="profileDragsContainer tab"
                  // style={{ padding: "0px 0px 45px 0px" }}
                >
                  {/* {props.drags.map(
              (drag, i) =>
                drag.for === props.id && <DragSummary {...drag} key={i} />
            )} */}
                  {props.drags &&
                    props.drags.map((drag, i) => {
                      return (
                        !drag.savedDrag &&
                        drag.for === props.id && (
                          <div className="profileDragContainer" key={i}>
                            <Drag
                              {...props}
                              drag={drag}
                              handleDrag={props.handleDrag}
                              handleComment={props.handleComment}
                            />
                          </div>
                        )
                      );
                    })}
                </div>
                <div
                  className="profileSavedDragsContainer tab"
                  style={{ display: "none" }}
                >
                  {props.savedDrags && props.savedDrags.length === 0 && (
                    <div className="noSavedDrags">No saved Drag</div>
                  )}
                  {props.savedDrags &&
                    props.savedDrags.map((drag, i) => {
                      return (
                        drag.leftDrag &&
                        drag.savedDrag && (
                          <div className="profileDragContainer" key={i}>
                            <Drag
                              {...props}
                              drag={drag}
                              handleDrag={props.handleDrag}
                              handleComment={props.handleComment}
                            />
                          </div>
                        )
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Navbar
        page="profile"
        count={props.newNotifications && props.newNotifications.length}
      />
    </div>
  );
};

export default Profile;
