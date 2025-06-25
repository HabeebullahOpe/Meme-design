import React, { useState, useRef } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import IconSection from "./components/IconSection/IconSection";
import StageSection from "./components/StageSection/StageSection";
import ItemTab from "./components/ItemTab/ItemTab";
import PreviewModal from "./components/PreviewModal/PreviewModal";
import "./styles/globals.css";
import "./styles/variables.css";
import "./App.css";

function App() {
  const [showPreview, setShowPreview] = useState(false);
  const [addedItems, setAddedItems] = useState([]);
  const [showIcons, setShowIcons] = useState(false);
  const stageRef = useRef(null);

  // Add template image
  const handleAddToCanvas = (icon) => {
    setAddedItems((prev) => [
      ...prev,
      {
        ...icon,
        id: `item-${Date.now()}`,
        x: 50,
        y: 50,
        width: 100,
        height: 100,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      },
    ]);
  };

  // Handle uploaded images
  const handleUploadImage = (newImage) => {
    setAddedItems((prev) => [...prev, newImage]);
  };

  return (
    <ThemeProvider>
      <main>
        <StageSection
          addedItems={addedItems}
          setAddedItems={setAddedItems}
          ref={stageRef}
        />
        <ItemTab
          onPreviewClick={() => setShowPreview(true)}
          onUploadImage={handleUploadImage}
          setShowIcons={setShowIcons}
        />
      </main>

      <IconSection
        onAddToCanvas={handleAddToCanvas}
        showIcons={showIcons}
        setShowIcons={setShowIcons}
      />

      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        stageRef={stageRef}
      />
    </ThemeProvider>
  );
}

export default App;
