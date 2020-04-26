import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import Login from "../components/Login";
import SignUp from "../components/signUp";

export default function LoginRoute() {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route path="/" exact render={() => <Login />} />
          <Route path="/signup" render={() => <SignUp />} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}
