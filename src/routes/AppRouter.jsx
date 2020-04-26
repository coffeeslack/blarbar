import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import Home from "./Home";
import Comments from "./Comments";
import Profile from "./Profile";
import ProfileForm from "../components/ProfileForm";
import CreateDrag from "./CreateDrag";
import Login from "./Login";
import SignUp from "./SignUp";
import CreateProfile from "./CreateProfile";
import Search from "./Search";
import Notifications from "./Notifications";
import UserProfile from "./UserProfile";
import EditDrag from "./EditDrag";
import Discover from "./Discover";

const AppRouter = props => {
  // console.log(props.drags);
  return (
    <BrowserRouter>
      {!props.user ? (
        <div>
          <Switch>
            <Route path="/" exact render={() => <Login {...props} />} />
            <Route path="/signUp" exact render={() => <SignUp {...props} />} />
            <Route
              path="/createProfile"
              render={(state, stateProps = { ...props }) => (
                <CreateProfile {...state} state={stateProps} />
              )}
            />
          </Switch>
        </div>
      ) : (
        <div>
          <Switch>
            <Route path="/" exact render={() => <Home {...props} />} />
            <Route
              path="/comments/:id"
              render={(state, stateProps = { ...props }) => (
                <Comments {...state} state={stateProps} />
              )}
            />
            <Route path="/profile" render={() => <Profile {...props} />} />
            <Route
              path="/editProfile"
              render={() => <ProfileForm {...props} />}
            />
            <Route path="/create" render={() => <CreateDrag {...props} />} />
            <Route path="/search" render={() => <Search {...props} />} />
            <Route
              path="/userProfile/:id"
              render={(state, stateProps = { ...props }) => (
                <UserProfile {...state} state={stateProps} />
              )}
            />
            <Route
              path="/edit/:id"
              render={(state, stateProps = { ...props }) => (
                <EditDrag {...state} state={stateProps} />
              )}
            />
            <Route
              path="/notifications"
              render={() => <Notifications {...props} />}
            />
            <Route path="/discover" render={() => <Discover {...props} />} />
          </Switch>
        </div>
      )}
    </BrowserRouter>
  );
};

export default AppRouter;
