// import React, { useRef, useState, useEffect  } from "react";
import React, { forwardRef } from "react";
import styles from "./IconSection.module.css";

const IconSection = forwardRef(({ onAddToCanvas, showIcons, setShowIcons }, ref) => {

  const memeIcons = [
  "Boombox.Overlay.png",
  "Coffee.Overlay.png",
  "Good_Morning._Overlay.png",
  "Goodnight.Overlay.png",
  "meme1.png",
  "meme2.png",
  "meme3.png",
  "meme4.png",
  "Mic.Overlay.png",
  "paws_token-2.png",
  "Sign.Overlay.png"
].map((filename, i) => ({
  id: `icon-${i}`,
  src: `/assets/icons/${filename}`
}));

  const handleDragStart = (e, icon) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(icon));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div ref={ref} className={`${styles.iconSection} ${showIcons ? styles.slideIn : ""}`}>
      <div
        className={styles.iconListContainer}
        // ref={scrollContainerRef}
      >
        <div className={styles.drag}></div>
        <ul>
          {memeIcons.map((icon) => (
            <li
              key={icon.id}
              draggable
              onDragStart={(e) => handleDragStart(e, icon)}
              onClick={() => {
                onAddToCanvas(icon);
                setShowIcons(false);
              }}
            >
              <img src={icon.src} alt={`Meme ${icon.id}`} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});

export default IconSection;
