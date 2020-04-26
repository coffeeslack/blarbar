import React from "react";
import Drag from "../components/drag";
import Navbar from "../components/navbar";
import Logo from "../icons/logo.svg";
import ReactLoading from "react-loading";
import Welcome from "../components/Welcome";
import Search from "../routes/Search";
import Notifications from "../routes/Notifications";
import { AiOutlineUser } from "react-icons/ai";
import { NavLink } from "react-router-dom";

const Home = props => {
  // console.log(props.drags);
  // useEffect(() => {
  //   props.checkAllDrags();
  // }, []);
  const scrollFunction = () => {
    if (document.getElementById("navbar")) {
      if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
      ) {
        document.getElementById("navbar").style.top = "-50px";
      } else {
        document.getElementById("navbar").style.top = "0";
      }
      // console.log(document.documentElement.scrollTop, document.body.scrollTop);
    }
  };
  window.onscroll = function() {
    scrollFunction();
  };

  return (
    <div className="home">
      <header className="homeHeader" id="navbar">
        <img src={Logo} width="20px" height="20px" alt="logo" />
        Blarbar
        <NavLink to="/profile">
          <span className="desktopProfileIcon">
            <AiOutlineUser />
          </span>
        </NavLink>
      </header>
      {/* {console.log(props.drags)} */}
      {props.user && !props.drags && (
        <ReactLoading
          type="spinningBubbles"
          color="royalblue"
          height={30}
          width={30}
          className="loader"
        />
      )}
      <div className="desktopSearch">
        <Search {...props} />
      </div>
      <div className="desktopNotifications">
        <Notifications {...props} />
      </div>
      <div className="dragFeed">
        <Welcome {...props} />
        {props.drags &&
          props.drags.slice(0, 20).map((drag, i) => {
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
        page="home"
        count={props.newNotifications && props.newNotifications.length}
      />
    </div>
  );
};

export default Home;
