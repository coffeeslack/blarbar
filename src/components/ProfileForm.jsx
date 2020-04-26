import React from "react";
import { NavLink, Redirect } from "react-router-dom";
import { IoIosCloseCircle } from "react-icons/io";
import edit from "../icons/edit.svg";
import "../css/profileForm.css";
import firebase from "firebase";
import coverPhoto from "../pics/pic1.png";
import profilePic from "../pics/avatar.png";

class ProfileForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkData: props.handleDataCheck,
      checkUserDetails: props.checkUserDetails,
      id: props.id,
      userName: props.userName,
      displayName: props.displayName,
      bio: props.bio,
      profilePic: props.profilePic,
      coverPhoto: props.coverPhoto,
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
      coverImageProgress: ""
    };
  }
  handleDataCheck = () => {
    this.state.checkData();
  };
  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/profile" />;
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
  handleUpdate = e => {
    e.preventDefault();
    this.setState(() => ({ uploading: true }));
    firebase
      .firestore()
      .collection("users")
      .doc(`${this.state.id}`)
      .update({
        id: this.state.id,
        userName: this.state.userName,
        displayName: this.state.displayName,
        bio: this.state.bio
      })
      .then(() => {
        this.state.checkUserDetails();
        this.setState(() => ({ uploading: false }));
        this.handleAlert();
        // console.log("done");
      })
      .catch(error => console.log(error));
  };
  handleChange = e => {
    const name = e.target.name;
    this.setState({ [name]: e.target.value });
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
          // console.log("Upload is " + progress + "% done");
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

            firebase
              .firestore()
              .collection("users")
              .doc(`${this.state.id}`)
              .update({
                profilePic: this.state.profileImageUrl
              })
              .then(() => {
                this.state.checkData();
                this.setState(() => ({
                  uploading: false,
                  uploadingProfileImage: false
                }));
                this.handleAlert();
                // console.log("done");
              })
              .catch(error => console.log(error));
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
          // console.log("Upload is " + progress + "% done");
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

            firebase
              .firestore()
              .collection("users")
              .doc(`${this.state.id}`)
              .update({
                coverPhoto: this.state.coverImageUrl
              })
              .then(() => {
                this.state.checkData();
                this.setState(() => ({
                  uploading: false,
                  uploadingCoverImage: false
                }));
                this.handleAlert();
                // console.log("done");
              })
              .catch(error => console.log(error));
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
    // console.log(this.state);

    const Alert = () => {
      if (this.state.uploading) {
        return <div>{`updating profile...`}</div>;
      } else if (this.state.uploadingProfileImage) {
        return (
          <div>{`Uploading profile picture... (${this.state.profileImageProgress}%)`}</div>
        );
      } else if (this.state.uploadingCoverImage) {
        return (
          <div>{`Uploading cover photo... (${this.state.coverImageProgress}%)`}</div>
        );
      } else {
        return <div>{"update successful!"}</div>;
      }
    };

    return (
      <div className="profileFormContainer">
        {this.renderRedirect()}
        <form onSubmit={this.handleUpdate}>
          <div
            className={
              this.state.showAlert ? "updateAlert" : "updateAlertClose"
            }
          >
            {/* <div>update successful!</div> */}
            <Alert />
          </div>
          <div className="commentsHeader">
            <NavLink to="/profile" exact>
              <span className="backBtn">
                <IoIosCloseCircle />
              </span>
            </NavLink>
            <span className="headerTitle">Edit Profile</span>
            <span className="headerCheckBtn">
              <button>save</button>
            </span>
          </div>
          <div className="profileFormBody">
            <input
              type="file"
              name="imageInput"
              id="coverImageInput"
              accept="image/*"
              onChange={this.handleCoverImageChange}
            />
            <label htmlFor="coverImageInput">
              <div className="profileCoverPhoto">
                <div className="coverPhoto">
                  <img
                    src={
                      this.state.coverPhoto ? this.state.coverPhoto : coverPhoto
                    }
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
              />
              <label htmlFor="profileImageInput">
                <div className="profilePic">
                  <img
                    src={
                      this.state.profilePic ? this.state.profilePic : profilePic
                    }
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

export default ProfileForm;
