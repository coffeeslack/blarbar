import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { FaSearch } from "react-icons/fa";
import "../css/search.css";
import firebase from "firebase";
import SearchResult from "../components/SearchResult";
import ReactLoading from "react-loading";
import Drag from "../components/profileDrags";
import { NavLink } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

function Search(props) {
  const [state, setState] = useState({
    ...props,
    searchValue: "",
    searchResult: [],
    searching: true,
    noResult: false,
    allUsers: [],
    length: 10
  });

  useEffect(() => {
    handleSearch();
    props.checkAllDrags();
  }, []);

  const handleSearch = () => {
    setState(prev => ({ ...prev, searching: true, searchResult: [] }));
    firebase
      .firestore()
      .collection("users")
      .get()
      .then(data => {
        let searchResult = [];
        data.forEach(user => {
          if (
            user
              .data()
              .userName.toLowerCase()
              .includes(state.searchValue) ||
            user
              .data()
              .displayName.toLowerCase()
              .includes(state.searchValue)
          ) {
            // console.log(user.data().userName);
            searchResult.push(user.data().id);
            setState(prev => ({ ...prev, searchResult, searching: false }));
          } else {
            setState(prev => ({ ...prev, searching: false }));
          }
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleChange = e => {
    const name = e.target.name;
    setState({ [name]: e.target.value });
    handleSearch();
    changeTab(1);
  };

  const changeTab = num => {
    const tabs = document.querySelectorAll(".tab");
    const profileTabBtn = document.querySelectorAll(".searchTabBtn");
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].style.display = "none";
      profileTabBtn[i].classList.remove("selectedTab");
    }
    tabs[num].style.display = "block";
    profileTabBtn[num].classList.add("selectedTab");
  };

  return (
    <div className="searchContainer">
      <div className="searchHeader">
        <div className="searchBar">
          <div className="searchBox">
            <NavLink to="/">
              <span className="backBtn">
                <IoMdArrowRoundBack />
              </span>
            </NavLink>
            <input
              type="text"
              name="searchValue"
              placeholder="Search Blarbar..."
              className="searchBoxText"
              onChange={handleChange}
            />
            <span onClick={handleSearch}>
              <FaSearch />
            </span>
          </div>
        </div>
      </div>
      <div className="searchBody" id="desktopSearch">
        {state.searching && (
          <ReactLoading
            type="spinningBubbles"
            color="royalblue"
            height={30}
            width={30}
            className="commentLoader"
          />
        )}
        {state.searchResult &&
          !state.searching &&
          state.searchResult.map(result => (
            <SearchResult key={result} result={result} id={props.id} />
          ))}
        {state.searchResult.length === 0 &&
          !state.searching &&
          "no result found"}
      </div>
      <div className="searchBody" id="mobileSearch">
        <div className="profileTab">
          <div className="searchTabMenu">
            <div
              className="searchTabBtn selectedTab"
              onClick={() => changeTab(0)}
            >
              Discover
            </div>
            <div className="searchTabBtn" onClick={() => changeTab(1)}>
              Users
            </div>
          </div>
          <div className="searchDiscover tab" id="discover">
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
              props.allDrags.slice(0, 20).map((drag, i) => {
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
            {/* {props.allDrags && (
              <div>
                <button onClick={showMore}>show more</button>
              </div>
            )} */}
          </div>
          <div className="searchAllUsers tab" style={{ display: "none" }}>
            {state.searching && (
              <ReactLoading
                type="spinningBubbles"
                color="royalblue"
                height={30}
                width={30}
                className="commentLoader"
              />
            )}
            {state.searchResult &&
              !state.searching &&
              state.searchResult.map(result => (
                <SearchResult key={result} result={result} id={props.id} />
              ))}
            {state.searchResult.length === 0 &&
              !state.searching &&
              "no result found"}
          </div>
        </div>
      </div>
      <Navbar
        page="search"
        count={props.newNotifications && props.newNotifications.length}
      />
    </div>
  );
}

export default Search;
