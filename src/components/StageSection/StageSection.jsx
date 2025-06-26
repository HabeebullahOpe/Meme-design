import React, { useState, useRef, forwardRef, useEffect } from "react";
import { Stage, Layer, Image, Group, Rect, Transformer } from "react-konva";
import useImage from "use-image";
import styles from "./StageSection.module.css";

// A4 Portrait dimensions at 72 DPI (595×842 pixels)
const PORTRAIT_SIZE = {
  width: 595,
  height: 842,
};

const StageSection = forwardRef(
  ({ addedItems, setAddedItems, selectedId, setSelectedId }, ref) => {
    // const [selectedId, setSelectedId] = useState(null);
    const stageRef = useRef(null);
    const containerRef = useRef(null);
    const [scaledSize, setScaledSize] = useState(PORTRAIT_SIZE);

    // Handle selection
    const handleSelect = (e) => {
      if (e.target === e.target.getStage()) {
        setSelectedId(null);
      }
    };

    // Handle drag end
    const handleDragEnd = (e, id) => {
      setAddedItems((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              x: e.target.x(),
              y: e.target.y(),
            };
          }
          return item;
        })
      );
    };

    // Handle transform end
    const handleTransformEnd = (e, id) => {
      const node = e.target;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();

      const newWidth = Math.max(20, node.width() * scaleX);
      const newHeight = Math.max(20, node.height() * scaleY);

      // ✅ Apply updated size directly to the Konva node
      node.width(newWidth);
      node.height(newHeight);
      node.scaleX(1);
      node.scaleY(1);

      // ✅ Then update your state
      setAddedItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                x: node.x(),
                y: node.y(),
                rotation: node.rotation(),
                width: newWidth,
                height: newHeight,
                scaleX: 1,
                scaleY: 1,
              }
            : item
        )
      );
    };

    // Responsive scaling
    useEffect(() => {
      const updateSize = () => {
        if (!containerRef.current) return;

        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;

        // Calculate scale to fit while maintaining aspect ratio
        const widthScale = containerWidth / PORTRAIT_SIZE.width;
        const heightScale = containerHeight / PORTRAIT_SIZE.height;
        const scale = Math.min(widthScale, heightScale) * 0.95; // 5% padding

        setScaledSize({
          width: PORTRAIT_SIZE.width * scale,
          height: PORTRAIT_SIZE.height * scale,
        });
      };

      updateSize();
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }, []);

    // Forward ref
    useEffect(() => {
      if (ref) {
        ref.current = stageRef.current;
      }
    }, [ref]);

    return (
      <div
        ref={containerRef}
        className={styles.stageSection}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // backgroundColor: "#f0f0f0", // Optional: Container background
        }}
      >
        <Stage
          ref={stageRef}
          width={scaledSize.width}
          height={scaledSize.height}
          onMouseDown={handleSelect}
          style={{
            backgroundColor: "#ffffff",
            boxShadow: "0 0 15px rgba(0,0,0,0.1)",
          }}
        >
          <Layer>
            <Rect
              width={scaledSize.width}
              height={scaledSize.height}
              fill="transparent"
              perfectDrawEnabled={false}
              listening={false}
            />

            {addedItems.map((item) => (
              <ImageElement
                key={item.id}
                item={item}
                isSelected={item.id === selectedId}
                onSelect={() => setSelectedId(item.id)}
                onDragEnd={(e) => handleDragEnd(e, item.id)}
                onTransformEnd={(e) => handleTransformEnd(e, item.id)}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    );
  }
);

const ImageElement = React.memo(
  ({ item, isSelected, onSelect, onDragEnd, onTransformEnd }) => {
    const [image] = useImage(item.src);
    const shapeRef = useRef();
    const trRef = useRef();

    useEffect(() => {
      const currentTr = trRef.current;
      const currentShape = shapeRef.current;

      if (isSelected && currentTr && currentShape) {
        currentTr.nodes([currentShape]);
        currentShape.getLayer().batchDraw();
      }

      return () => {
        if (currentTr) {
          currentTr.nodes([]);
        }
      };
    }, [isSelected]);

    return (
      <Group>
        <Image
          image={image}
          id={item.id}
          x={item.x}
          y={item.y}
          width={item.width}
          height={item.height}
          rotation={item.rotation}
          scaleX={item.scaleX || 1}
          scaleY={item.scaleY || 1}
          draggable
          onClick={onSelect}
          onTap={onSelect}
          ref={shapeRef}
          onDragEnd={onDragEnd}
          onTransformEnd={onTransformEnd}
        />
        {isSelected && (
          <Transformer
            ref={trRef}
            rotateEnabled={true}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 20 || newBox.height < 20) {
                return oldBox;
              }
              return newBox;
            }}
            anchorSize={8}
            borderEnabled={true}
            borderStroke="#4b8df8"
            borderStrokeWidth={1}
            anchorStroke="#4b8df8"
            anchorCornerRadius={3}
            keepRatio={false}
            enabledAnchors={[
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right",
              "top-center",
              "bottom-center",
              "middle-left",
              "middle-right",
            ]}
          />
        )}
      </Group>
    );
  }
);

export default StageSection;
