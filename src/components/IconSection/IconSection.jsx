import React, { useRef, useState, useEffect } from 'react';
import styles from './IconSection.module.css';

const IconSection = ({ onAddToCanvas }) => {
  const [currentWidth, setCurrentWidth] = useState(80);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 400);
  const scrollContainerRef = useRef(null);

  const memeIcons = Array(15).fill().map((_, i) => ({
    id: `icon-${i}`,
    src: `/assets/icons/meme${(i % 4) + 1}.png`
  }));

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 400);
      if (window.innerWidth >= 400) setCurrentWidth(80);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRightClick = () => {
    if (currentWidth < 160) setCurrentWidth(currentWidth + 80);
  };

  const handleLeftClick = () => {
    if (currentWidth > 80) setCurrentWidth(currentWidth - 80);
  };

  const scrollUp = () => {
    scrollContainerRef.current?.scrollBy({ top: -100, behavior: 'smooth' });
  };

  const scrollDown = () => {
    scrollContainerRef.current?.scrollBy({ top: 100, behavior: 'smooth' });
  };

  const handleDragStart = (e, icon) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(icon));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div 
      className={styles.iconSection} 
      style={{ width: isMobile ? `${currentWidth}px` : '80px' }}
    >
      {isMobile && (
        <div className={styles.iconControl}>
          <span 
            onClick={handleLeftClick} 
            className={currentWidth <= 80 ? styles.hidden : ''}
          >
            <img src="/assets/tabs/left.png" alt="left" />
          </span>
          <span 
            onClick={handleRightClick} 
            className={currentWidth >= 160 ? styles.hidden : ''}
          >
            <img src="/assets/tabs/right.png" alt="right" />
          </span>
        </div>
      )}

      {!isMobile && (
        <>
          <button 
            className={`${styles.scrollButton} ${styles.scrollUp}`}
            onClick={scrollUp}
          >
            <div>
              <img src="/assets/tabs/up.png" alt="Scroll up" />
            </div>
          </button>
          <button 
            className={`${styles.scrollButton} ${styles.scrollDown}`}
            onClick={scrollDown}
          >
            <div>
              <img src="/assets/tabs/down.png" alt="Scroll down" />
            </div>
          </button>
        </>
      )}

      <div 
        className={styles.iconListContainer}
        ref={scrollContainerRef}
      >
        <ul>
          {memeIcons.map((icon) => (
            <li 
              key={icon.id}
              draggable
              onDragStart={(e) => handleDragStart(e, icon)}
              onClick={() => onAddToCanvas(icon)}
            >
              <img src={icon.src} alt={`Meme ${icon.id}`} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default IconSection;