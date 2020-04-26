import React from "react";
import "../css/dragSummary.css";

const DragSummary = ({ ...props }) => {
  //   console.log(props);
  const totalDrags = props.leftDrag.drags + props.rightDrag.drags;
  const leftDragPercent = Math.round((props.leftDrag.drags / totalDrags) * 100);
  const rightDragPercent = Math.round(
    (props.rightDrag.drags / totalDrags) * 100
  );
  return (
    <div className="dragSummary">
      <div className="dragSummaryPic">
        <img src={props.picture} width="100%" alt="pic" />
      </div>
      <div className="dragSummaryDetails">
        <div
          className={`dragSummaryTitle ${leftDragPercent > rightDragPercent &&
            `higherDrag`}`}
        >
          {props.leftDrag.title}
          <span className="dragSummaryPercent">
            {totalDrags === 0 ? "0" : leftDragPercent}%
          </span>
        </div>
        <div
          className={`dragSummaryTitle ${rightDragPercent > leftDragPercent &&
            `higherDrag`}`}
        >
          {props.rightDrag.title}
          <span className="dragSummaryPercent">
            {totalDrags === 0 ? "0" : rightDragPercent}%
          </span>
        </div>
        <div className="dragSummaryMiniDetails">
          <span>
            {props.comments.length}{" "}
            {props.comments.length > 1 ? "comments" : "comment"} |{" "}
          </span>
          <span>
            {totalDrags} {totalDrags > 1 ? "drags" : "drag"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DragSummary;
