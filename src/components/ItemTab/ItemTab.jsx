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
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onUploadImage(event.target.result); // Pass base64/image URL to parent
      };
      reader.readAsDataURL(file);
    }
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
            onClick={item.onClick || (item.id === 'openPreview' ? onPreviewClick : undefined)}
          >
            <img src={`/assets/tabs/${item.img}`} alt="" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemTab;