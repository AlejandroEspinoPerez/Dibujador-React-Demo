// Toolbar.tsx
import React from "react";

type ToolbarProps = {
  onSelectTool: (tool: string) => void;
};

const Toolbar: React.FC<ToolbarProps> = ({ onSelectTool }) => {
  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f0f0f0",
        width: "200px",
        height: "100vh",
      }}
    >
      <h3>Herramientas</h3>
      <button onClick={() => onSelectTool("rectangle")}>Cuadrado</button>
      <button onClick={() => onSelectTool("circle")}>Círculo</button>
      <button onClick={() => onSelectTool("round")}>Redondear</button>{" "}
      {/* Nuevo botón */}
    </div>
  );
};

export default Toolbar;
