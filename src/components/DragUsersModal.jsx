import React from "react";
import "../css/dragUsersModal.css";

function DragUsersModal(props) {
  return (
    <div className="dragUsersModal">
      <div
        className="dragUsersModalBlind"
        onClick={props.closeUsersModal}
      ></div>
      <div className="dragUsersModalContainer">drag users</div>
    </div>
  );
}

export default DragUsersModal;
