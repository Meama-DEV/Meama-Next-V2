import React, { useEffect, useState } from "react";
import "./LoopingText.css";

const LoopingText: React.FC = () => {
  const [shouldRender, setShouldRender] = useState(false);
  const text = "OPEN YOUR EYES";

  useEffect(() => {
    // Only render on client-side after mount to prevent SSR flash
    // Use double requestAnimationFrame + timeout to ensure everything is ready
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Small delay to ensure CSS is loaded and browser is ready
        setTimeout(() => {
          setShouldRender(true);
        }, 100);
      });
    });
  }, []);

  // Don't render anything on server or during initial client render
  if (!shouldRender) {
    return null;
  }

  // create a bunch of copies so the strip is long enough
  const items = Array.from({ length: 12 }, (_, i) => (
    <span className="looping-text__item" key={i}>
      {text}
    </span>
  ));

  return (
    <div className="looping-text__wrapper looping-text__wrapper--visible">
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
