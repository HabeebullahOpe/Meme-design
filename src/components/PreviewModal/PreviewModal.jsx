import React, { useState, useEffect } from 'react';
import styles from './PreviewModal.module.css';

const PreviewModal = ({ isOpen, onClose, stageRef }) => {
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (isOpen && stageRef.current?.getStage()) {
      const stage = stageRef.current.getStage();
      // Clone stage to remove any transformers
      const tempStage = stage.clone();
      tempStage.find('Transformer').forEach(t => t.destroy());
      
      const dataURL = tempStage.toDataURL({
        mimeType: 'image/png',
        quality: 1,
        pixelRatio: 2
      });
      setPreviewUrl(dataURL);
    }
  }, [isOpen, stageRef]);

  const handleDownload = () => {
    if (!previewUrl) return;
    
    const link = document.createElement('a');
    link.download = 'meme-design.png';
    link.href = previewUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.previewModal}>
      <div className={styles.preview}>
        <div className={styles.imgPreview}>
          {previewUrl && (
            <img 
              src={previewUrl} 
              alt="Preview" 
              style={{ maxWidth: '100%', maxHeight: '400px' }}
            />
          )}
        </div>
        <div className={styles.previewNav}>
          <ul>
            <li onClick={handleDownload}>
              <img src="/assets/tabs/download.png" alt="Download" />
            </li>
          </ul>
        </div>
      </div>
      <div className={styles.cancelPreviewModal} onClick={onClose}>
        <img src="/assets/tabs/close.png" alt="Close" />
      </div>
    </div>
  );
};

export default PreviewModal;