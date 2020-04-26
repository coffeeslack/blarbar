import React from "react";
import "../css/Welcome.css";

function Welcome(props) {
  return (
    <div>
      {props.drags &&
        props.following &&
        props.following.length === 1 &&
        props.following[0].userId === "9mvtt4QpfZaDvQfAOUoqJP3TNxD2" && (
          <div className="welcomeContainer">
            <div className="welcomeGreeting">Hello {props.displayName}!</div>
            <div className="welcomeMessage">Thanks for joining Blarbar</div>
            <div className="welcomeHint">
              Please follow people from the search page so you can see the drags
              they post.
            </div>
          </div>
        )}
    </div>
  );
}

export default Welcome;
