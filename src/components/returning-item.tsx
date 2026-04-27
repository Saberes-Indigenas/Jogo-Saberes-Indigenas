import { useEffect, useRef } from "react";
import { Group } from "react-konva";
import Konva from "konva";
import { ItemBall } from "./item-ball";
import type { Item } from "../types";

interface ReturningItemProps {
  itemData: Item;
  startPos: { x: number; y: number };
  endPos: { x: number; y: number };
  onComplete: () => void;
}

export function ReturningItem({
  itemData,
  startPos,
  endPos,
  onComplete,
}: ReturningItemProps) {
  const groupRef = useRef<Konva.Group>(null);

  useEffect(() => {
    if (groupRef.current) {
      if (startPos.x === endPos.x && startPos.y === endPos.y) {
        groupRef.current.visible(false);
        onComplete();
        return;
      }
      const tween = new Konva.Tween({
        node: groupRef.current,
        x: endPos.x,
        y: endPos.y,
        opacity: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 0.5,
        easing: Konva.Easings.EaseOut,

        onFinish: () => {
          if (groupRef.current) {
            groupRef.current.visible(false);
          }
          onComplete();
        },
      });

      tween.play();
      return () => tween.destroy();
    }
  }, [onComplete, endPos.x, endPos.y, startPos.x, startPos.y]);

  return (
    <Group
      ref={groupRef}
      x={startPos.x}
      y={startPos.y}
      opacity={1}
      scaleX={1}
      scaleY={1}
      listening={false}
    >
      <ItemBall
        item={itemData}
        initial_pos={{ x: 0, y: 0 }}
        isDraggable={false}
      />
    </Group>
  );
}
