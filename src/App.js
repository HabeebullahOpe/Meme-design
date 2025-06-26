// App.js
import React, { useState, useRef, useEffect } from "react";
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
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showIcons, setShowIcons] = useState(false);
  const stageRef = useRef(null);
  const iconRef = useRef(null);

  useEffect(() => {
  const handleOutside = (e) => {
    if (iconRef.current && !iconRef.current.contains(e.target)) {
      setShowIcons(false);
    }
  };

  document.addEventListener("mousedown", handleOutside);   // Desktop
  document.addEventListener("touchstart", handleOutside); // Mobile

  return () => {
    document.removeEventListener("mousedown", handleOutside);
    document.removeEventListener("touchstart", handleOutside);
  };
}, []);

  const updateItems = (newItems) => {
    setHistory((prev) => [...prev, addedItems]);
    setAddedItems(newItems);
    setRedoStack([]);
  };

  const handleAddToCanvas = (icon) => {
    const newItem = {
      ...icon,
      id: `item-${Date.now()}`,
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    };
    updateItems([...addedItems, newItem]);
  };

  const handleUploadImage = (newImage) => {
    updateItems([...addedItems, newImage]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setRedoStack((r) => [addedItems, ...r]);
    setHistory((h) => h.slice(0, -1));
    setAddedItems(prev);
    setSelectedId(null);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setHistory((h) => [...h, addedItems]);
    setRedoStack((r) => r.slice(1));
    setAddedItems(next);
    setSelectedId(null);
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    updateItems(addedItems.filter((item) => item.id !== selectedId));
    setSelectedId(null);
  };

  return (
    <ThemeProvider>
      <main>
        <StageSection
          addedItems={addedItems}
          setAddedItems={updateItems}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          ref={stageRef}
        />
        <ItemTab
          onPreviewClick={() => setShowPreview(true)}
          onUploadImage={handleUploadImage}
          setShowIcons={setShowIcons}
          undo={undo}
          redo={redo}
          deleteSelected={deleteSelected}
        />
      </main>

      <IconSection
        onAddToCanvas={handleAddToCanvas}
        showIcons={showIcons}
        setShowIcons={setShowIcons}
        ref={iconRef}

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
