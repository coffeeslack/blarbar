import React, { Component } from "react";
import "../css/profile.css";
// import DragSummary from "../components/dragSummary";
import Navbar from "../components/navbar";
import Drag from "../components/profileDrags";
// import { NavLink } from "react-router-dom";
import firebase from "firebase/app";
import ReactLoading from "react-loading";
import uuid from "uuid";
import numeral from "numeral";
import { IoMdArrowRoundBack } from "react-icons/io";
import profilePic from "../pics/avatar.png";
import coverPhoto from "../pics/pic1.png";

export default class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.location.state,
      state: props.state,
      isLoading: true,
      amFollowing: false,
      isMyAccount: false,
      followersLength: 0,
      followingLength: 0,
      displayBio: false
    };
  }

  componentDidMount() {
    this.setState(() => ({ isLoading: true }));
    this.checkDrag();
    this.handleResultData();
  }

  handleResultData = () => {
    firebase
      .firestore()
      .collection("users")
      .get()
      .then(data => {
        data.forEach(user => {
          if (user.id === this.state.id) {
            this.setState(prevState => ({
              ...prevState,
              ...user.data(),
              followersLength: user.data().followers.length,
              followingLength: user.data().following.length
            }));
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  checkDrag = () => {
    this.checkClickedDrags();
    firebase
      .firestore()
      .collection("drags")
      .get()
      .then(data => {
        const mainDrags = [];
        data.forEach(doc => {
          if (doc.data().for === this.state.id) {
            mainDrags.push(doc.data());
          }
        });
        this.state.clickedDrags &&
          mainDrags.map(drag => {
            this.state.clickedDrags.map(clickedDrag => {
              if (clickedDrag.dragId === drag.id) {
                drag.selectedDrag = clickedDrag.selectedDrag;
              }
              return clickedDrag;
            });
            return drag;
          });
        mainDrags.sort(function(a, b) {
          return a.createdAt > b.createdAt ? -1 : 1;
        });
        this.setState(prevState => ({
          ...prevState,
          drags: mainDrags
        }));
        this.checkComments();
        this.checkFollowing();
        // console.log(this.state.id);
      })
      .catch(error => {
        console.log(error);
      });
  };

  checkClickedDrags = () => {
    firebase
      .firestore()
      .collection("clickedDrags")
      .get()
      .then(data => {
        let clickedDrags = [];
        data.forEach(doc => {
          if (doc.data().userId === this.state.state.id) {
            clickedDrags.push(doc.data());
            this.setState(prevState => ({
              ...prevState,
              clickedDrags: clickedDrags
            }));
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  checkComments = () => {
    firebase
      .firestore()
      .collection("comments")
      .get()
      .then(data => {
        let comments = [];
        data.forEach(doc => {
          if (doc.data()) {
            comments.push(doc.data());
          }
        });
        this.setState(prevState => {
          return {
            ...prevState,
            drags: prevState.drags.map(drag => {
              let dragComments = [];
              comments.map(comment => {
                if (comment.for === drag.id) {
                  dragComments.push(comment);
                }
                return comment;
              });
              return { ...drag, comments: dragComments };
            })
          };
        });
        this.setState(() => ({ isLoading: false }));
      })
      .catch(error => {
        console.log(error);
      });
  };

  checkFollowing = () => {
    this.state.state.following.map(user => {
      if (user.userId === this.state.id) {
        this.setState(() => ({ amFollowing: true }));
      }
    });
    if (this.state.state.id === this.state.id) {
      this.setState(() => ({ isMyAccount: true }));
    }
  };

  handleFollow = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(`${this.state.state.id}`)
      .update({
        following: firebase.firestore.FieldValue.arrayUnion({
          userId: this.state.id
        })
      })
      .then(() => {
        firebase
          .firestore()
          .collection("users")
          .doc(`${this.state.id}`)
          .update({
            followers: firebase.firestore.FieldValue.arrayUnion({
              userId: this.state.state.id
            })
          })
          .then(this.state.state.checkUserDetails())
          .catch(error => console.log(error));

        this.setState(prevState => ({
          ...prevState,
          amFollowing: true,
          followersLength: prevState.followersLength + 1
        }));
        let newNotification = {
          from: this.state.state.id,
          to: this.state.id,
          text: "is now following you",
          viewed: false,
          id: uuid(),
          createdAt: new Date()
        };
        firebase
          .firestore()
          .collection("notifications")
          .doc(`${newNotification.id}`)
          .set(newNotification)
          .then()
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => console.log(error));
  };

  handleUnfollow = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(`${this.state.state.id}`)
      .update({
        following: firebase.firestore.FieldValue.arrayRemove({
          userId: this.state.id
        })
      })
      .then(() => {
        firebase
          .firestore()
          .collection("users")
          .doc(`${this.state.id}`)
          .update({
            followers: firebase.firestore.FieldValue.arrayRemove({
              userId: this.state.state.id
            })
          })
          .then()
          .catch(error => console.log(error));

        this.state.state.checkUserDetails();
        this.setState(prevState => ({
          ...prevState,
          amFollowing: false,
          followersLength: prevState.followersLength - 1
        }));
      })
      .catch(error => console.log(error));
  };

  onComment = e => {
    e.preventDefault();
    const { value, id } = e.target.comment;

    const newComment = {
      for: id,
      text: value,
      id: uuid(),
      userName: this.state.state.userName,
      profilePic: this.state.state.profilePic,
      createdAt: new Date()
    };
    firebase
      .firestore()
      .collection("comments")
      .doc(`${newComment.id}`)
      .set(newComment)
      .then(
        this.setState(prevState => ({
          ...prevState,
          drags: prevState.drags.map(drag => {
            if (drag.id === id && value !== "") {
              return {
                ...drag,
                comments: [...drag.comments, newComment]
              };
            } else {
              return { ...drag };
            }
          })
        }))
      )
      .catch(error => {
        console.log(error);
      });

    e.target.comment.value = "";
  };

  goBack = () => {
    window.history.back();
  };

  render() {
    const Bio = () => {
      if (this.state.bio.length > 250 && !this.state.displayBio) {
        return (
          <span>
            {this.state.bio.slice(0, 220)}
            <span
              style={{ color: "grey", fontSize: "13px" }}
              onClick={() => this.setState(() => ({ displayBio: true }))}
            >
              ...show more
            </span>
          </span>
        );
      } else if (this.state.bio.length > 250 && this.state.displayBio) {
        return (
          <span>
            {this.state.bio}
            <span
              style={{ color: "grey", fontSize: "13px" }}
              onClick={() => this.setState(() => ({ displayBio: false }))}
            >
              ...show less
            </span>
          </span>
        );
      } else if (this.state.bio.length < 250 && this.state.displayBio) {
        return <span>{this.state.bio}</span>;
      } else {
        return <span>{this.state.bio}</span>;
      }
    };

    return (
      <div style={{ backgroundColor: "white", height: "100vh" }}>
        {this.state.isLoading ? (
          <ReactLoading
            type="spinningBubbles"
            color="royalblue"
            height={30}
            width={30}
            className="commentLoader"
          />
        ) : (
          <div className="profileContainer">
            <div className="commentsHeader">
              <div style={{ display: "flex", alignItems: "center" }}>
                {/* <NavLink to="/search"> */}
                <span className="backBtn" onClick={this.goBack}>
                  <IoMdArrowRoundBack />
                </span>
                {/* </NavLink> */}
                <span className="headerTitle">{this.state.userName}</span>
              </div>
            </div>
            <div className="profileBody">
              <div className="profileCoverPhoto">
                <div className="coverPhoto">
                  <img
                    src={
                      this.state.coverPhoto ? this.state.coverPhoto : coverPhoto
                    }
                    alt="coverPhoto"
                    width="100%"
                  />
                </div>
              </div>
              <div className="profileDetails">
                <div className="profileUserDetails">
                  <div className="profileProfilePic">
                    <img
                      src={
                        this.state.profilePic
                          ? this.state.profilePic
                          : profilePic
                      }
                      alt="profilePic"
                      width="100%"
                    />
                  </div>
                  <div className="profileUserNameContainer">
                    <div className="profileDisplayName">
                      {this.state.displayName}
                    </div>
                    <div className="profileUserName">
                      @{this.state.userName}
                    </div>
                  </div>
                  <div
                    className="profileEditBtn"
                    style={{ display: this.state.isMyAccount && "none" }}
                    onClick={
                      !this.state.amFollowing
                        ? this.handleFollow
                        : this.handleUnfollow
                    }
                  >
                    <button>
                      {this.state.amFollowing ? "unfollow" : "follow"}
                    </button>
                  </div>
                </div>
                <div className="profileFollow">
                  <div className="profileFollowContainer">
                    <div className="profileFollowNum">
                      {this.state.drags.length}
                    </div>
                    <div className="profileFollowLabel">drags</div>
                  </div>
                  <div className="profileFollowContainer">
                    <div className="profileFollowNum">
                      {numeral(this.state.followersLength).format("0a")}
                    </div>
                    <div className="profileFollowLabel">followers</div>
                  </div>
                  <div className="profileFollowContainer">
                    <div className="profileFollowNum">
                      {numeral(this.state.followingLength).format("0a")}
                    </div>
                    <div className="profileFollowLabel">following</div>
                  </div>
                </div>
                <div
                  className="profileBio"
                  style={{
                    display: this.state.bio === "" && "none"
                  }}
                >
                  {/* {this.state.bio} */}
                  <Bio />
                </div>
              </div>
              <div className="profileTab" style={{ paddingBottom: "45px" }}>
                <div>
                  {this.state.drags &&
                    this.state.drags.map((drag, i) => {
                      return (
                        <div className="profileDragContainer" key={i}>
                          <Drag
                            {...this.state.state}
                            amFollowing={this.state.amFollowing}
                            drag={drag}
                            handleDrag={this.state.state.handleDrag}
                            handleComment={this.onComment}
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}
        <Navbar
          page="search"
          count={
            this.state.state.newNotifications &&
            this.state.state.newNotifications.length
          }
        />
      </div>
    );
  }
}
