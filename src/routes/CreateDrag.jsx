import React from "react";
import { Redirect } from "react-router-dom";
import Pic from "../pics/pic.png";
import firebase from "firebase/app";
import uuid from "uuid";
import "../css/createDrag.css";
import { FaRegImage, FaRegImages } from "react-icons/fa";
import { IoIosFlash, IoIosCloseCircle } from "react-icons/io";
import { MdTextFormat } from "react-icons/md";
import moment from "moment";
import imageCompression from "browser-image-compression";

export default class CreateDrag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props,
      image: null,
      image1: null,
      image2: null,
      url: "",
      url1: "",
      url2: "",
      redirect: false,
      uploading: false,
      uploadingStatus: "",
      imageType: "text"
    };
  }

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
  handleImageType = type => {
    this.setState(() => ({ imageType: type }));
  };
  handleUploadStatus = progress => {
    this.setState(prevState => ({
      ...prevState,
      uploading: true,
      uploadingStatus: progress
    }));
  };
  handleCreate = e => {
    e.preventDefault();
    const caption = e.target.caption.value;
    const option1 = e.target.option1.value;
    const option2 = e.target.option2.value;
    const { image, image1, image2 } = this.state;

    if (!image && !image1 && !image2) {
      const newDrag = {
        for: this.state.id,
        userName: this.state.userName,
        displayName: this.state.displayName,
        profilePic: this.state.profilePic,
        id: uuid(),
        leftDrag: {
          title: option1,
          drags: 0
        },
        rightDrag: {
          title: option2,
          drags: 0
        },
        caption: caption,
        userHasDragged: false,
        selectedDrag: "",
        createdAt: new Date()
      };
      this.handleUploadStatus(0);
      firebase
        .firestore()
        .collection("drags")
        .doc(`${newDrag.id}`)
        .set(newDrag)
        .then(() => {
          this.state.handleCreate({
            ...newDrag,
            createdAt: moment.utc(),
            comments: []
          });
          this.setRedirect();
        })
        .catch(error => {
          console.log(error);
        });
    }

    if (image1 && image2) {
      const uploadTask1 = firebase
        .storage()
        .ref(`images/${uuid()}`)
        .put(image1);

      uploadTask1.on(
        "state_changed",
        snapshot => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.handleUploadStatus(progress);
        },
        error => {
          console.log(error);
        },
        () => {
          uploadTask1.snapshot.ref.getDownloadURL().then(url => {
            this.setState(() => ({ url1: url }));

            const uploadTask2 = firebase
              .storage()
              .ref(`images/${uuid()}`)
              .put(image2);

            uploadTask2.on(
              "state_changed",
              snapshot => {
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                this.handleUploadStatus(progress);
              },
              error => {
                console.log(error);
              },
              () => {
                uploadTask2.snapshot.ref.getDownloadURL().then(url => {
                  this.setState(() => ({ url2: url }));

                  const newDrag = {
                    for: this.state.id,
                    userName: this.state.userName,
                    displayName: this.state.displayName,
                    profilePic: this.state.profilePic,
                    id: uuid(),
                    leftDrag: {
                      title: option1,
                      drags: 0
                    },
                    rightDrag: {
                      title: option2,
                      drags: 0
                    },
                    caption: caption,
                    userHasDragged: false,
                    selectedDrag: "",
                    picture1: this.state.url1 && this.state.url1,
                    picture2: this.state.url2 && this.state.url2,
                    createdAt: new Date()
                  };

                  firebase
                    .firestore()
                    .collection("drags")
                    .doc(`${newDrag.id}`)
                    .set(newDrag)
                    .then(() => {
                      this.state.handleCreate({
                        ...newDrag,
                        createdAt: moment.utc(),
                        comments: []
                      });
                      this.setRedirect();
                    })
                    .catch(error => {
                      console.log(error);
                    });
                });
              }
            );
          });
        }
      );
    }

    if (image) {
      const uploadTask = firebase
        .storage()
        .ref(`images/${uuid()}`)
        .put(image);

      uploadTask.on(
        "state_changed",
        snapshot => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.handleUploadStatus(progress);
        },
        error => {
          console.log(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(url => {
            this.setState(() => ({ url }));

            const newDrag = {
              for: this.state.id,
              userName: this.state.userName,
              displayName: this.state.displayName,
              profilePic: this.state.profilePic,
              id: uuid(),
              leftDrag: {
                title: option1,
                drags: 0
              },
              rightDrag: {
                title: option2,
                drags: 0
              },
              caption: caption,
              userHasDragged: false,
              selectedDrag: "",
              picture: this.state.url && this.state.url,
              createdAt: new Date()
            };

            firebase
              .firestore()
              .collection("drags")
              .doc(`${newDrag.id}`)
              .set(newDrag)
              .then(() => {
                this.state.handleCreate({
                  ...newDrag,
                  createdAt: moment.utc(),
                  comments: []
                });
                this.setRedirect();
              })
              .catch(error => {
                console.log(error);
              });
          });
        }
      );
    }
  };

  handleChange = e => {
    if (e.target.files[0] && e.target.name === "imageInput") {
      const image = e.target.files[0];
      this.setState(() => ({ image, image1: null, image2: null }));
      // const date = moment.utc();
      // // const _date = date.getUTCMilliseconds();
      // const date_ = moment(date.toDate()).fromNow();
      // console.log(date_);
      console.log("originalFile instanceof Blob", image instanceof Blob); // true
      console.log(`originalFile size ${image.size / 1024 / 1024} MB`);

      var options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 600,
        useWebWorker: true
      };

      imageCompression(image, options)
        .then(function(compressedFile) {
          console.log(
            "compressedFile instanceof Blob",
            compressedFile instanceof Blob
          ); // true
          console.log(
            `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
          ); // smaller than maxSizeMB

          // return uploadToServer(compressedFile); // write your own logic
          console.log("c_image", compressedFile, image);
        })
        .catch(function(error) {
          console.log(error.message);
        });
    }
    if (e.target.files[0] && e.target.name === "imageInput1") {
      const image1 = e.target.files[0];
      this.setState(() => ({ image1, image: null }));
      this.previewImage(image1, e.target.name);
      // console.log(this.state);
    }
    if (e.target.files[0] && e.target.name === "imageInput2") {
      const image2 = e.target.files[0];
      this.setState(() => ({ image2, image: null }));
      this.previewImage(image2, e.target.name);
      // console.log(this.state);
    }
    this.previewImage(e.target.files[0], e.target.name);
  };

  previewImage = (img, name) => {
    var reader = new FileReader();
    var imageField;

    if (name === "imageInput") {
      imageField = document.getElementById("image-field");
    }
    if (name === "imageInput1") {
      imageField = document.getElementById("image-field1");
    }
    if (name === "imageInput2") {
      imageField = document.getElementById("image-field2");
    }

    reader.onload = () => {
      if (reader.readyState === 2) {
        imageField.src = reader.result;
      }
    };
    reader.readAsDataURL(img);
  };

  goBack = () => {
    window.history.back();
  };

  render() {
    return (
      <div>
        {this.renderRedirect()}
        <form className="createDragForm" onSubmit={this.handleCreate}>
          <div className="commentsHeader">
            <span className="backBtn" onClick={this.goBack}>
              <IoIosCloseCircle />
            </span>
            <span className="headerTitle">Create Drag</span>
          </div>
          <div className="createDragBody">
            <div
              style={{ display: !this.state.uploading && "none" }}
              className="creatingLoaderContainer"
            >
              <div className="loaderCaption">uploading...</div>
              <div className="creatingLoader">
                <div
                  id="loaderStatus"
                  style={{ width: `${this.state.uploadingStatus}%` }}
                ></div>
              </div>
            </div>
            <div className="createTypes">
              <div className="imageIconContainer">
                <div
                  className={
                    this.state.imageType === "text"
                      ? "imageIconSelected"
                      : "singleImage"
                  }
                  onClick={() => this.handleImageType("text")}
                >
                  <MdTextFormat />
                </div>
              </div>
              <div className="imageIconContainer">
                <div
                  className={
                    this.state.imageType === "single"
                      ? "imageIconSelected"
                      : "singleImage"
                  }
                  onClick={() => this.handleImageType("single")}
                >
                  <FaRegImage />
                </div>
              </div>
              <div className="imageIconContainer">
                <div
                  className={
                    this.state.imageType === "double"
                      ? "imageIconSelected"
                      : "doubleImage"
                  }
                  onClick={() => this.handleImageType("double")}
                >
                  <FaRegImages />
                </div>
              </div>
            </div>
            <input
              type="file"
              name="imageInput"
              id="imageInput"
              accept="image/*"
              onChange={this.handleChange}
            />
            <input
              type="file"
              name="imageInput1"
              id="imageInput1"
              accept="image/*"
              onChange={this.handleChange}
            />
            <input
              type="file"
              name="imageInput2"
              id="imageInput2"
              accept="image/*"
              onChange={this.handleChange}
            />
            <div
              style={{
                display:
                  (this.state.imageType === "double" && "none") ||
                  (this.state.imageType === "text" && "none")
              }}
            >
              <label htmlFor="imageInput">
                <div className="createFormPicContainer">
                  <img
                    src={Pic}
                    width="100%"
                    id="image-field"
                    alt="dragPicture"
                  />
                </div>
              </label>
            </div>
            <div
              style={{
                display:
                  (this.state.imageType === "single" && "none") ||
                  (this.state.imageType === "text" && "none")
              }}
            >
              <div className="createFormPicContainer">
                <div className="image1">
                  <label htmlFor="imageInput1">
                    <img src={Pic} width="100%" id="image-field1" />
                  </label>
                </div>
                <div className="flashIcon">
                  <IoIosFlash />
                </div>
                <div className="image2">
                  <label htmlFor="imageInput2">
                    <img src={Pic} width="100%" id="image-field2" />
                  </label>
                </div>
              </div>
            </div>
            <div className="createFormCaption">
              <textarea
                type="text"
                name="caption"
                placeholder="Drag caption e.g what's your favorite? (optional)"
              />
            </div>
            <div className="createFormOptions">
              <input
                className="createFormOption1"
                type="text"
                name="option1"
                placeholder="Option 1..."
                maxLength={15}
                required
              />
              <div className="createFormVs">vs</div>
              <input
                className="createFormOption2"
                type="text"
                name="option2"
                placeholder="Option 2..."
                maxLength={15}
                required
              />
            </div>
          </div>
          <button className="createDragPostBtn">
            <span>Post</span>
          </button>
        </form>
      </div>
    );
  }
}
