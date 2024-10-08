import { useState } from "react";

export const useDrawingTools = () => {
    const [selectedTool, setSelectedTool] = useState<string>("rectangle");
    const [shapes, setShapes] = useState<any[]>([]);

    const addShape = (tool: string) => {
        if (tool === "rectangle") {
            setShapes([...shapes, { id: shapes.length + 1, type: "rect", x: 50, y: 50, width: 100, height: 100, fill: "grey" }]);
        }
        // Puedes agregar lógica para otras formas
    };

    return {
        selectedTool,
        shapes,
        setSelectedTool,
        addShape,
    };
};
