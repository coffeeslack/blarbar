import React, { Component } from "react";
import fb from "../config/firebase";
import logo from "../icons/logo.svg";
import { Redirect } from "react-router-dom";

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      handleDataCheck: props.handleDataCheck,
      showAlert: false,
      redirect: false,
      error: ""
    };
  }
  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };
  renderRedirect = () => {
    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: "/createProfile",
            state: {
              email: this.state.email,
              password: this.state.password
            }
          }}
          exact
        />
      );
    }
  };

  handleAlert = () => {
    this.setState({
      showAlert: true
    });
    window.setTimeout(() => {
      this.setState({
        showAlert: false
      });
    }, 2000);
  };

  handleChange = e => {
    const name = e.target.name;
    this.setState({ [name]: e.target.value });
  };
  handleSubmit = e => {
    e.preventDefault();
  };
  handleSignUp = () => {
    if (this.state.email && this.state.password.length >= 6) {
      this.setState(() => ({ redirect: true }));
    } else if (!this.state.email) {
      this.setState(() => ({ error: "no email" }));
      this.handleAlert();
    } else if (!this.state.password) {
      this.setState(() => ({ error: "no password" }));
      this.handleAlert();
    } else if (this.state.email && this.state.password.length < 5) {
      this.setState(() => ({ error: "incomplete password" }));
      this.handleAlert();
    }
  };
  render() {
    const Alert = () => {
      if (this.state.error === "auth/wrong-password") {
        return <div>Password is incorrect!</div>;
      } else if (this.state.error === "auth/user-not-found") {
        return <div>Account does not exist!</div>;
      } else if (this.state.error === "auth/invalid-email") {
        return <div>email is incorrect!</div>;
      } else if (this.state.error === "auth/network-request-failed") {
        return <div>Internet disconnected!</div>;
      } else if (this.state.error === "no email") {
        return <div>Please input a valid email!</div>;
      } else if (this.state.error === "no password") {
        return <div>Please input a valid password!</div>;
      } else if (this.state.error === "incomplete password") {
        return <div>Password must be at least 6 characters!</div>;
      } else {
        return <div>Logged In</div>;
      }
    };

    return (
      <div className="loginPage">
        {this.renderRedirect()}
        <div
          className={this.state.showAlert ? "updateAlert" : "updateAlertClose"}
        >
          <Alert />
        </div>
        <div className="logoWrapper">
          <div className="logoContainer">
            <img src={logo} width="25px" alt="logo" />
          </div>
          <div className="logoTextContainer">Sign Up</div>
        </div>
        <form className="loginForm" onSubmit={this.handleSubmit}>
          <span className="inputLabel">email</span>
          <br />
          <input
            type="email"
            name="email"
            value={this.state.email}
            onChange={this.handleChange}
            className="loginInput"
            required
          />
          <br />
          <span className="inputLabel">password</span>
          <br />
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
            className="loginInput"
            required
          />
          <br />
          <button className="logInBtn" onClick={this.handleSignUp}>
            Sign up
          </button>
        </form>
      </div>
    );
  }
}
