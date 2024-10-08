import React, { useState } from "react";
import CanvasArea from "./components/CanvasArea";


const App: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<string>("rectangle");

  return (
    <div style={{ display: "flex" }}>

      {/* Área de dibujo */}
      <CanvasArea />
    </div>
  );
};

export default App;
