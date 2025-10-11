import { useEffect, useRef } from "react";
import { Group } from "react-konva";
import Konva from "konva";
import ItemCard from "./ItemCard";
import type { Item } from "../types";

interface ReturningItemProps {
  itemData: Item;
  startPos: { x: number; y: number };
  endPos: { x: number; y: number };
  onComplete: () => void;
}

const RETURN_DURATION = 600;

const ReturningItem = ({ itemData, startPos, endPos, onComplete }: ReturningItemProps) => {
  const groupRef = useRef<Konva.Group>(null);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    group.position(startPos);
    group.opacity(1);
    group.scale({ x: 1, y: 1 });
    group.rotation(0);
    group.listening(false);
    group.moveToTop();

    const layer = group.getLayer();
    if (!layer) return;

    let animation: Konva.Animation | null = null;
    let completed = false;

    animation = new Konva.Animation((frame) => {
      if (!frame) return;
      const progress = Math.min(frame.time / RETURN_DURATION, 1);
      const eased = Konva.Easings.BackEaseOut(progress, 0, 1, 1);
      const wobble = Math.sin(progress * Math.PI * 2) * 16;
      const lift = Math.sin(progress * Math.PI) * 48;

      const nextX = startPos.x + (endPos.x - startPos.x) * eased + wobble * 0.2;
      const nextY = startPos.y + (endPos.y - startPos.y) * eased - lift * (1 - progress * 0.6);

      group.position({ x: nextX, y: nextY });
      group.rotation(Math.sin(progress * Math.PI * 2) * 8);

      const squash = 1 + Math.sin(progress * Math.PI * 2) * 0.08;
      group.scale({ x: squash, y: 1 - (progress * 0.15 - Math.sin(progress * Math.PI) * 0.08) });
      group.opacity(0.95 + Math.sin(progress * Math.PI) * 0.05);

      if (progress >= 1 && !completed) {
        completed = true;
        group.position(endPos);
        group.rotation(0);
        group.scale({ x: 1, y: 1 });
        group.opacity(1);
        group.visible(false);
        animation?.stop();
        onComplete();
      }
    }, layer);

    animation.start();

    return () => {
      animation?.stop();
    };
  }, [endPos, onComplete, startPos]);

  return (
    <Group ref={groupRef}>
      <ItemCard item={itemData} initial_pos={{ x: -75, y: -95 }} isDraggable={false} />
    </Group>
  );
};

export default ReturningItem;
