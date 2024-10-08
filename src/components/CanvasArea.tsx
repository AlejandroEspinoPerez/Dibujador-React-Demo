import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Circle, Transformer } from "react-konva";
import Toolbar from "./Toolbar";

const CanvasArea: React.FC = () => {
  const [shapes, setShapes] = useState<any[]>([]); // Lista de todas las figuras
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>(null); // Herramienta seleccionada
  const transformerRef = useRef<any>(null);
  const shapeRefs = useRef<any[]>([]); // Referencias a los nodos de las formas

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
          }
        : shape
    );

    node.scaleX(1);
    node.scaleY(1);
    setShapes(updatedShapes);
  };

  const handleCanvasClick = (e: any) => {
    if (!selectedTool) return; // Si no hay herramienta seleccionada, no hacer nada

    const stage = e.target.getStage();
    const { x, y } = stage.getPointerPosition(); // Obtener la posición del mouse en el canvas

    // Crear una nueva figura dependiendo de la herramienta seleccionada
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
          }
        : {
            id: shapes.length + 1,
            type: "circle",
            x,
            y,
            radius: 50,
            fill: "grey",
          };

    setShapes([...shapes, newShape]); // Añadir la nueva figura a la lista
    setSelectedTool(null); // Resetear la herramienta seleccionada para evitar seguir añadiendo figuras
  };

  const handleDelete = () => {
    // Eliminar la figura seleccionada
    const updatedShapes = shapes.filter((shape) => shape.id !== selectedId);
    setShapes(updatedShapes);
    setSelectedId(null); // Deseleccionar la figura
  };

  return (
    <div style={{ display: "flex" }}>
      <Toolbar onSelectTool={setSelectedTool} />
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={handleCanvasClick} // Detectar clics en el canvas
      >
        <Layer>
          {shapes.map((shape, i) =>
            shape.type === "rect" ? (
              <Rect
                key={shape.id}
                ref={(node) => (shapeRefs.current[i] = node)} // Referencia al nodo
                {...shape}
                draggable
                onClick={() => handleSelect(shape.id)}
                onDragEnd={(e) => handleDragEnd(e, shape.id)}
                onTransformEnd={(e) => handleTransformEnd(e, shape.id)}
              />
            ) : (
              <Circle
                key={shape.id}
                ref={(node) => (shapeRefs.current[i] = node)} // Referencia al nodo
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
              {/* Botón de eliminar flotante */}
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
