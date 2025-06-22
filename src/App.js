import React, { useState, useRef } from 'react'; // Added useRef import
import { ThemeProvider } from './context/ThemeContext';
import IconSection from './components/IconSection/IconSection';
import StageSection from './components/StageSection/StageSection';
import ItemTab from './components/ItemTab/ItemTab';
import PreviewModal from './components/PreviewModal/PreviewModal';
import './styles/globals.css';
import './styles/variables.css';
import './App.css';

function App() {
  const [showPreview, setShowPreview] = useState(false);
  const [addedItems, setAddedItems] = useState([]);
  const stageRefs = useRef({
    div: null,
    stage: null
  });

  // Defined handleAddToCanvas function
  const handleAddToCanvas = (icon) => {
    setAddedItems(prev => [
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
        scaleY: 1
      }
    ]);
  };

  return (
    <ThemeProvider>
      <main>
        <div className="container">
          <IconSection onAddToCanvas={handleAddToCanvas} />
          <StageSection 
            addedItems={addedItems} 
            setAddedItems={setAddedItems} 
            ref={stageRefs}
          />
        </div>
        <ItemTab onPreviewClick={() => setShowPreview(true)} />
      </main>

      <PreviewModal 
        isOpen={showPreview} 
        onClose={() => setShowPreview(false)}
        stageRef={stageRefs}
      />
    </ThemeProvider>
  );
}

export default App;