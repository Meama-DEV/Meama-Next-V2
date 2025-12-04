import React from "react";
import "./LoopingText.css";

const LoopingText: React.FC = () => {
  const text = "OPEN YOUR EYES";

  // create a bunch of copies so the strip is long enough
  const items = Array.from({ length: 12 }, (_, i) => (
    <span className="looping-text__item" key={i}>
      {text}
    </span>
  ));

  return (
    <div className="looping-text__wrapper">
      <div className="looping-text__track">
        {/* first copy of the track */}
        <div className="looping-text__group">{items}</div>

        {/* second copy for seamless looping */}
        <div className="looping-text__group" aria-hidden="true">
          {items}
        </div>
      </div>
    </div>
  );
};

export default LoopingText;
