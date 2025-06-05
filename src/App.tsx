import React, { useState } from "react";
import { Circle, Stage, Layer } from "react-konva";
import Konva from 'konva';

interface Position {
    x: number;
    y: number;
}

const App: React.FC = () => {
    const [position, setPosition] = useState<Position>({
        x: 30,
        y: 30
    });

    const stageWidth: number = 500;
    const stageHeight: number = 500;
    const circleRadius: number = 30;

    const limitSpaceDrager = (e: Konva.KonvaEventObject<DragEvent>) => {
        const node = e.target;
        let newX: number = node.x();
        let newY: number = node.y();

        const minX: number = circleRadius;
        const maxX: number = stageWidth - circleRadius;
        const minY: number = circleRadius;
        const maxY: number = stageHeight - circleRadius;

        if (newX < minX) {
            newX = minX;
        } else if (newX > maxX) {
            newX = maxX;
        }

        if (newY < minY) {
            newY = minY;
        } else if (newY > maxY) {
            newY = maxY;
        }

        node.x(newX);
        node.y(newY);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Stage
                width={stageWidth}
                height={stageHeight}
                className="bg-white border border-gray-300 rounded-md shadow-lg"
            >
                <Layer>
                    <Circle
                        x={position.x}
                        y={position.y}
                        draggable
                        radius={circleRadius}
                        fill='blue'
                        onDragMove={limitSpaceDrager}
                        onDragEnd={(e: Konva.KonvaEventObject<DragEvent>) => {
                            setPosition({
                                x: e.target.x(),
                                y: e.target.y()
                            });
                        }}
                    />
                </Layer>
            </Stage>
        </div>
    );
};

export default App;