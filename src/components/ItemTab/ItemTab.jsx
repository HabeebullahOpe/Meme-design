import React, { useRef } from 'react';
import styles from './ItemTab.module.css';

const ItemTab = ({ onPreviewClick, onUploadImage }) => {
  const fileInputRef = useRef(null);
  const tabItems = [
    { img: 'text (1).png', className: 'toggleArt' },
    { 
      img: 'image (2).png', 
      onClick: () => fileInputRef.current.click() // Trigger file input
    },
    { img: 'backward.png' },
    { img: 'forward.png' },
    { img: 'clean.png' },
    { img: 'gallery.png', id: 'openPreview', onClick: onPreviewClick }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      onUploadImage({
        src: event.target.result,
        id: `upload-${Date.now()}`,
        x: 100, // Center position
        y: 100,
        width: 200, // Default size
        height: 200,
        rotation: 0,
        scaleX: 1,
        scaleY: 1
      });
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input
  };

  return (
    <div className={styles.itemTab}>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        style={{ display: 'none' }}
      />
      
      <ul>
        {tabItems.map((item, index) => (
          <li 
            key={index}
            className={item.className ? styles[item.className] : ''}
            onClick={item.onClick}
          >
            <img src={`/assets/tabs/${item.img}`} alt="" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemTab;