import React from "react";
import "../css/createProfile.css";
import fb from "../config/firebase";
import coverPhoto from "../pics/pic1.png";
import profilePic from "../pics/avatar.png";
import edit from "../icons/edit.svg";
import { NavLink, Redirect } from "react-router-dom";
import "../css/profileForm.css";
import firebase from "firebase";
import { IoIosCloseCircle } from "react-icons/io";

class CreateProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      props: props,
      email: props.location.state.email,
      password: props.location.state.password,
      handleDataCheck: props.state.handleDataCheck,
      userName: "",
      displayName: "",
      bio: "",
      profilePic: profilePic,
      coverPhoto: coverPhoto,
      redirect: false,
      showAlert: false,
      profileImage: null,
      coverImage: null,
      profileImageUrl: "",
      coverImageUrl: "",
      uploading: false,
      uploadingProfileImage: false,
      uploadingCoverImage: false,
      uploadProgress: "",
      profileImageProgress: "",
      coverImageProgress: "",
      validUserName: true,
      error: "",
      signingUp: false
    };
  }
  addUser = id => {
    const user = {
      id,
      displayName: this.state.displayName,
      userName: this.state.userName,
      bio: this.state.bio,
      profilePic: this.state.profileImageUrl,
      coverPhoto: this.state.coverImageUrl,
      followers: [],
      following: [{ userId: "9mvtt4QpfZaDvQfAOUoqJP3TNxD2" }]
    };

    firebase
      .firestore()
      .collection("users")
      .doc(`${id}`)
      .set(user)
      .then(() => this.state.handleDataCheck())
      .catch(error => console.log(error));
  };

  signUp = e => {
    e.preventDefault();

    firebase
      .firestore()
      .collection("users")
      .get()
      .then(data => {
        data.forEach(user => {
          if (user.data().userName === this.state.userName) {
            this.setState(() => ({ validUserName: false }));
            this.setState(prevState => ({ ...prevState, signingUp: true }));
            this.handleAlert();
          }
        });
        if (this.state.validUserName) {
          this.setState(prevState => ({ ...prevState, signingUp: true }));
          this.handleAlert();
          fb.auth()
            .createUserWithEmailAndPassword(
              this.state.email,
              this.state.password
            )
            .then(data => {
              this.addUser(data.user.uid);
              this.setState(() => ({ uploading: false }));
              this.handleAlert();
              this.setRedirect();
            })
            .catch(error => {
              console.log(error);
              this.setState(() => ({ error: error.code }));
              this.handleAlert();
            });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/" />;
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
    this.setState(() => ({ validUserName: true }));
  };
  handleProfileImageChange = e => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      this.setState(() => ({ profileImage: image }));

      const uploadTask = firebase
        .storage()
        .ref(`images/${image.name}`)
        .put(image);

      uploadTask.on(
        "state_changed",
        snapshot => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          this.setState(() => ({
            uploading: true,
            uploadingProfileImage: true,
            profileImageProgress: progress,
            showAlert: true
          }));
        },
        error => {
          // Handle unsuccessful uploads
          console.log(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(url => {
            this.setState(() => ({ profileImageUrl: url }));
            this.setState(() => ({
              uploading: false,
              uploadingProfileImage: false
            }));
            this.handleAlert();
          });
        }
      );
    }
    this.previewProfileImage(e.target.files[0]);
  };
  previewProfileImage = img => {
    var reader = new FileReader();
    var imageField = document.getElementById("profile-image-field");

    reader.onload = () => {
      if (reader.readyState === 2) {
        imageField.src = reader.result;
      }
    };
    reader.readAsDataURL(img);
  };
  handleCoverImageChange = e => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      this.setState(() => ({ coverImage: image }));
      const uploadTask = firebase
        .storage()
        .ref(`images/${image.name}`)
        .put(image);

      uploadTask.on(
        "state_changed",
        snapshot => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          this.setState(() => ({
            uploading: true,
            uploadingCoverImage: true,
            coverImageProgress: progress,
            showAlert: true
          }));
        },
        error => {
          // Handle unsuccessful uploads
          console.log(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(url => {
            this.setState(() => ({ coverImageUrl: url }));
            this.setState(() => ({
              uploading: false,
              uploadingCoverImage: false
            }));
            this.handleAlert();
          });
        }
      );
    }
    this.previewCoverImage(e.target.files[0]);
  };
  previewCoverImage = img => {
    var reader = new FileReader();
    var imageField = document.getElementById("cover-image-field");

    reader.onload = () => {
      if (reader.readyState === 2) {
        imageField.src = reader.result;
      }
    };
    reader.readAsDataURL(img);
  };

  render() {
    const Alert = () => {
      if (this.state.uploadingProfileImage) {
        return (
          <div>{`Uploading profile picture... (${this.state.profileImageProgress}%)`}</div>
        );
      } else if (this.state.uploadingCoverImage) {
        return (
          <div>{`Uploading cover photo... (${this.state.coverImageProgress}%)`}</div>
        );
      } else if (!this.state.validUserName) {
        return <div>{`username has already been used!`}</div>;
      } else if (this.state.error === "auth/email-already-in-use") {
        return (
          <div>{`The email address is already in use by another account`}</div>
        );
      } else if (this.state.signingUp) {
        return <div>{`signing up...`}</div>;
      } else {
        return <div>{"update successful!"}</div>;
      }
    };

    return (
      <div className="profileFormContainer">
        {this.renderRedirect()}
        <form onSubmit={this.signUp}>
          <div
            className={
              this.state.showAlert ? "updateAlert" : "updateAlertClose"
            }
          >
            <Alert />
          </div>
          <div className="commentsHeader">
            <NavLink to="/signUp" exact>
              <span className="backBtn">
                <IoIosCloseCircle />
              </span>
            </NavLink>
            <span className="headerTitle">Create your profile</span>
            <span className="headerCheckBtn">
              <button>Sign Up</button>
            </span>
          </div>
          <div className="profileFormBody">
            <input
              type="file"
              name="imageInput"
              id="coverImageInput"
              accept="image/*"
              onChange={this.handleCoverImageChange}
              // required
            />
            <label htmlFor="coverImageInput">
              <div className="profileCoverPhoto">
                <div className="coverPhoto">
                  <img
                    src={this.state.coverPhoto}
                    alt="coverPhoto"
                    width="100%"
                    id="cover-image-field"
                  />
                </div>
                <div className="editCoverPic">
                  <img src={edit} alt="editIcon" width="100%" />
                </div>
              </div>
            </label>
            <div>
              <input
                type="file"
                name="imageInput"
                id="profileImageInput"
                accept="image/*"
                onChange={this.handleProfileImageChange}
                // required
              />
              <label htmlFor="profileImageInput">
                <div className="profilePic">
                  <img
                    src={this.state.profilePic}
                    alt="profilePic"
                    width="100%"
                    id="profile-image-field"
                  />
                </div>
                <div className="editProfilePic">
                  <img src={edit} alt="editIcon" width="100%" />
                </div>
              </label>
            </div>
            <div className="profileEditForm">
              <span className="inputLabel">user name</span>
              <br />
              <input
                type="text"
                name="userName"
                defaultValue={this.state.userName}
                onChange={this.handleChange}
                className="loginInput"
                required
              />
              <br />
              <span className="inputLabel">display name</span>
              <br />
              <input
                type="text"
                name="displayName"
                defaultValue={this.state.displayName}
                onChange={this.handleChange}
                className="loginInput"
                required
              />
              <br />
              <span className="inputLabel">bio</span>
              <br />
              <textarea
                rows="6"
                type="text"
                name="bio"
                defaultValue={this.state.bio}
                onChange={this.handleChange}
                className="loginInput"
                placeholder="Say something about yourself (optional)"
              />
              <br />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default CreateProfile;
