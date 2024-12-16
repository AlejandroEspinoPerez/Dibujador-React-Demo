import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Circle, Transformer } from "react-konva";
import Toolbar from "./Toolbar";

const CanvasArea: React.FC = () => {
  const [shapes, setShapes] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const transformerRef = useRef<any>(null);
  const shapeRefs = useRef<any[]>([]);

  useEffect(() => {
    if (transformerRef.current && selectedId !== null) {
      const selectedNode = shapeRefs.current.find(
        (ref) => ref?.id() === selectedId
      );
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedId, shapes]);

  const handleSelect = (id: number) => {
    setSelectedId(id);
  };

  const handleDragEnd = (e: any, id: number) => {
    const updatedShapes = shapes.map((shape) =>
      shape.id === id ? { ...shape, x: e.target.x(), y: e.target.y() } : shape
    );
    setShapes(updatedShapes);
  };

  const handleTransformEnd = (e: any, id: number) => {
    const node = e.target;
    const updatedShapes = shapes.map((shape) =>
      shape.id === id
        ? {
            ...shape,
            x: node.x(),
            y: node.y(),
            width: node.width() * node.scaleX(),
            height: node.height() * node.scaleY(),
            cornerRadius: node.cornerRadius(), // Actualizar el cornerRadius
          }
        : shape
    );

    node.scaleX(1);
    node.scaleY(1);
    setShapes(updatedShapes);
  };

  const handleCanvasClick = (e: any) => {
    if (!selectedTool) return;

    const stage = e.target.getStage();
    const { x, y } = stage.getPointerPosition();

    const newShape =
      selectedTool === "rectangle"
        ? {
            id: shapes.length + 1,
            type: "rect",
            x,
            y,
            width: 100,
            height: 100,
            fill: "grey",
            cornerRadius: {
              topLeft: 0,
              topRight: 0,
              bottomLeft: 0,
              bottomRight: 0,
            }, // Inicializar el radio de las esquinas
          }
        : selectedTool === "circle"
        ? {
            id: shapes.length + 1,
            type: "circle",
            x,
            y,
            radius: 50,
            fill: "grey",
          }
        : null;

    if (newShape) {
      setShapes([...shapes, newShape]);
      setSelectedTool(null);
    }
  };

  const handleDelete = () => {
    const updatedShapes = shapes.filter((shape) => shape.id !== selectedId);
    setShapes(updatedShapes);
    setSelectedId(null);
  };

  const handleRoundCorner = (e: any, id: number, corner: string) => {
    e.cancelBubble = true; // Evitar que el evento se propague al rectángulo
    const updatedShapes = shapes.map((shape) => {
      if (shape.id === id) {
        const newCornerRadius = { ...shape.cornerRadius };
        newCornerRadius[corner] = 30; // Ajusta el valor del radio según sea necesario
        return {
          ...shape,
          cornerRadius: newCornerRadius,
        };
      }
      return shape;
    });
    setShapes(updatedShapes);
  };

  return (
    <div style={{ display: "flex" }}>
      <Toolbar onSelectTool={setSelectedTool} />
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={handleCanvasClick}
      >
        <Layer>
          {shapes.map((shape, i) =>
            shape.type === "rect" ? (
              <React.Fragment key={shape.id}>
                <Rect
                  ref={(node) => (shapeRefs.current[i] = node)}
                  {...shape}
                  draggable
                  onClick={() => handleSelect(shape.id)}
                  onDragEnd={(e) => handleDragEnd(e, shape.id)}
                  onTransformEnd={(e) => handleTransformEnd(e, shape.id)}
                  cornerRadius={[
                    shape.cornerRadius.topLeft,
                    shape.cornerRadius.topRight,
                    shape.cornerRadius.bottomRight,
                    shape.cornerRadius.bottomLeft,
                  ]}
                />
                {/* Puntos para redondear esquinas */}
                {Object.values(shape.cornerRadius).every(
                  (radius) => radius === 0
                ) && (
                  <>
                    <Circle
                      x={shape.x - 10} // Desplazar a la izquierda
                      y={shape.y - 10} // Desplazar hacia arriba
                      radius={5}
                      fill="blue"
                      onClick={(e) => handleRoundCorner(e, shape.id, "topLeft")}
                    />
                    <Circle
                      x={shape.x + shape.width + 10} // Desplazar a la derecha
                      y={shape.y - 10} // Desplazar hacia arriba
                      radius={5}
                      fill="blue"
                      onClick={(e) =>
                        handleRoundCorner(e, shape.id, "topRight")
                      }
                    />
                    <Circle
                      x={shape.x - 10} // Desplazar a la izquierda
                      y={shape.y + shape.height + 10} // Desplazar hacia abajo
                      radius={5}
                      fill="blue"
                      onClick={(e) =>
                        handleRoundCorner(e, shape.id, "bottomLeft")
                      }
                    />
                    <Circle
                      x={shape.x + shape.width + 10} // Desplazar a la derecha
                      y={shape.y + shape.height + 10} // Desplazar hacia abajo
                      radius={5}
                      fill="blue"
                      onClick={(e) =>
                        handleRoundCorner(e, shape.id, "bottomRight")
                      }
                    />
                  </>
                )}
              </React.Fragment>
            ) : (
              <Circle
                key={shape.id}
                ref={(node) => (shapeRefs.current[i] = node)}
                {...shape}
                draggable
                onClick={() => handleSelect(shape.id)}
                onDragEnd={(e) => handleDragEnd(e, shape.id)}
                onTransformEnd={(e) => handleTransformEnd(e, shape.id)}
              />
            )
          )}

          {selectedId !== null && (
            <>
              <Transformer
                ref={transformerRef}
                rotateEnabled={false}
                resizeEnabled
              />
              <Rect
                x={
                  shapeRefs.current
                    .find((ref) => ref?.id() === selectedId)
                    ?.x() || 0
                }
                y={
                  shapeRefs.current
                    .find((ref) => ref?.id() === selectedId)
                    ?.y() || 0
                }
                width={30}
                height={30}
                fill="red"
                onClick={handleDelete}
                cornerRadius={5}
                perfectDrawEnabled={false}
              />
            </>
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default CanvasArea;
