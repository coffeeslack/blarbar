import React, { Component } from "react";
import firebase from "firebase/app";
import { NavLink } from "react-router-dom";
import profilePic from "../pics/avatar.png";
import "lazysizes";
// import a plugin
import "lazysizes/plugins/parent-fit/ls.parent-fit";

export default class SearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.result,
      myId: props.id
    };
  }

  componentDidMount() {
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
            this.setState(prevState => ({ ...prevState, ...user.data() }));
            // console.log(this.state);
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return (
      <>
        <NavLink
          to={
            this.state.id === this.state.myId
              ? {
                  pathname: "/profile"
                }
              : {
                  pathname: `/userProfile/${this.state.userName}`,
                  state: {
                    ...this.state
                  }
                }
          }
          exact
          className="searchResultContainer"
        >
          <div className="searchResultWrap">
            <div
              className="searchResultImage"
            >
              {/* <img
                src={
                  !this.state.profilePic ? profilePic : this.state.profilePic
                }
                width="100%"
              /> */}
              <img data-src={!this.state.profilePic ? profilePic : this.state.profilePic} className="lazyload" />
            </div>
            <div className="searchResultName">
              <div className="searchResultDisplayName">
                {this.state.displayName}
              </div>
              <div className="searchResultUserName">{this.state.userName}</div>
            </div>
          </div>
        </NavLink>
      </>
    );
  }
}
