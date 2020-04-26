import React, { useState } from "react";
// import backBtn from "../icons/close.svg";
import firebase from "firebase/app";
import "../css/createDrag.css";
import { IoIosFlash, IoIosCloseCircle } from "react-icons/io";

function EditDrag(props) {
  const [state, setState] = useState({
    ...props.location.state,
    updating: false,
    showAlert: false,
    pictureClicked: false
  });
  // console.log(props);

  const handleAlert = () => {
    setState(prev => ({
      ...prev,
      showAlert: true
    }));
    window.setTimeout(() => {
      setState(prev => ({
        ...prev,
        showAlert: false,
        pictureClicked: false,
        updating: false
      }));
    }, 2000);
  };

  const updateDrag = e => {
    e.preventDefault();
    setState(prev => ({ ...prev, updating: true }));

    firebase
      .firestore()
      .collection("drags")
      .doc(`${state.id}`)
      .update({
        caption: state.caption,
        "leftDrag.title": state.leftDrag.title,
        "rightDrag.title": state.rightDrag.title
      })
      .then(() => {
        props.state.handleDataCheck();
        setState(prev => ({ ...prev, updating: false }));
        handleAlert();
      })
      .catch(error => console.log(error));
  };

  const handleChange = e => {
    // console.log(e.target.name, e.target.value);
    const { name, value } = e.target;
    if (name === "option1") {
      setState(prev => ({
        ...prev,
        leftDrag: { ...prev.leftDrag, title: value }
      }));
      // console.log(e.target.name, e.target.value);
    }
    if (name === "option2") {
      setState(prev => ({
        ...prev,
        rightDrag: { ...prev.rightDrag, title: value }
      }));
    }
    if (name === "caption") {
      setState(prev => ({ ...prev, caption: value }));
    }
  };

  const handlePictureClick = () => {
    setState(prev => ({ ...prev, pictureClicked: true }));
    handleAlert();
  };

  const Alert = () => {
    if (state.updating) {
      return <div>{`updating drag...`}</div>;
    } else if (state.pictureClicked) {
      return <div>{`picture cannot be changed!`}</div>;
    } else {
      return <div>{"update successful!"}</div>;
    }
  };
  const goBack = () => {
    window.history.back();
  };
  return (
    <div>
      <div className={state.showAlert ? "updateAlert" : "updateAlertClose"}>
        <Alert />
      </div>
      <form className="createDragForm" onSubmit={updateDrag}>
        <div className="commentsHeader">
          {/* <NavLink to={props.location.state.backPath} exact> */}
          <span className="backBtn" onClick={goBack}>
            <IoIosCloseCircle />
          </span>
          {/* </NavLink> */}
          <span className="headerTitle">Edit Drag</span>
          <button className="createDragPostBtn">save</button>
        </div>
        <div className="createDragBody">
          <label htmlFor="imageInput">
            <div
              className="createFormPicContainer"
              onClick={handlePictureClick}
              style={{ display: state.picture1 && "none" }}
            >
              <img
                src={state.picture}
                width="100%"
                id="image-field"
                alt="dragPicture"
              />
            </div>
            <div
              className="createFormPicContainer"
              style={{ display: state.picture && "none" }}
              onClick={handlePictureClick}
            >
              <div className="image1">
                <img src={state.picture1} width="100%" />
              </div>
              <div className="flashIcon">
                <IoIosFlash />
              </div>
              <div className="image2">
                <img src={state.picture2} width="100%" />
              </div>
            </div>
          </label>
          <div className="createFormCaption">
            <textarea
              type="text"
              name="caption"
              defaultValue={state.caption}
              onChange={handleChange}
              placeholder="Drag caption e.g what's your favorite? (optional)"
            />
          </div>
          <div className="createFormOptions">
            <input
              className="createFormOption1"
              type="text"
              name="option1"
              placeholder="Option 1..."
              defaultValue={state.leftDrag.title}
              maxLength={15}
              onChange={handleChange}
              // required
            />
            <div className="createFormVs">vs</div>
            <input
              className="createFormOption2"
              type="text"
              name="option2"
              placeholder="Option 2..."
              defaultValue={state.rightDrag.title}
              maxLength={15}
              onChange={handleChange}
              // required
            />
          </div>
          {/* <div className="createFormHashtags">
            <input type="text" name="hashtags" placeholder="hashtags..." />
          </div> */}
        </div>
      </form>
    </div>
  );
}

export default EditDrag;
