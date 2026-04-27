import { useState, useEffect, useRef } from "react";
import { Group, Circle, Text, Rect } from "react-konva";
import Konva from "konva";
import type { Item } from "../types";

interface ItemBallProps {
  item: Item;
  initial_pos: { x: number; y: number };
  isDraggable?: boolean;
}

const ITEM_RAIO_VISUAL = 50;

export function ItemBall({
  item,
  initial_pos,
  isDraggable = true,
}: ItemBallProps) {
  const groupRef = useRef<Konva.Group>(null);
  const iconRef = useRef<Konva.Text>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const shadowProps = {
    shadowColor: "black",
    shadowBlur: 0,
    shadowOpacity: 1,
    shadowOffsetX: isHovered ? 10 : 4,
    shadowOffsetY: isHovered ? 10 : 4,
    shadowEnabled: true,
  };

  useEffect(() => {
    if (groupRef.current) {
      const tween = new Konva.Tween({
        node: groupRef.current,
        duration: 0.2,
        easing: Konva.Easings.EaseOut,
        x: isHovered ? initial_pos.x - 6 : initial_pos.x,
        y: isHovered ? initial_pos.y - 6 : initial_pos.y,
        rotation: isHovered ? 2 : 0,
      });
      tween.play();
    }
  }, [isHovered, initial_pos]);

  useEffect(() => {
    if (groupRef.current) {
      const scale = isPressed ? 0.95 : 1;
      const tween = new Konva.Tween({
        node: groupRef.current,
        duration: 0.1,
        scaleX: scale,
        scaleY: scale,
      });
      tween.play();
    }
  }, [isPressed]);

  useEffect(() => {
    if (!iconRef.current) return;

    const angularSpeed = 90;
    const anim = new Konva.Animation((frame) => {
      if (!frame) return;
      const angleDiff = (frame.timeDiff * angularSpeed) / 1000;
      iconRef.current?.rotate(angleDiff);
    }, iconRef.current.getLayer());

    if (isHovered) {
      anim.start();
    } else {
      anim.stop();
      iconRef.current.rotation(0);
    }

    return () => {
      anim.stop();
    };
  }, [isHovered]);

  return (
    <Group
      ref={groupRef}
      x={initial_pos.x}
      y={initial_pos.y}
      draggable={isDraggable}
      onMouseEnter={() => {
        setIsHovered(true);
        const stage = groupRef.current?.getStage();
        if (stage) stage.container().style.cursor = "pointer";
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
        const stage = groupRef.current?.getStage();
        if (stage) stage.container().style.cursor = "default";
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      <Circle
        radius={ITEM_RAIO_VISUAL}
        fill={item.color}
        stroke="#fff"
        strokeWidth={3}
        {...shadowProps}
      />
      <Text
        ref={iconRef}
        text={item.icon}
        fontSize={30}
        fill="#f5f5f5"
        align="center"
        verticalAlign="middle"
        width={ITEM_RAIO_VISUAL * 2}
        height={ITEM_RAIO_VISUAL * 2}
        offsetX={ITEM_RAIO_VISUAL}
        offsetY={ITEM_RAIO_VISUAL}
        listening={false}
      />
      <Group y={ITEM_RAIO_VISUAL + 18} listening={false}>
        <Rect
          x={-ITEM_RAIO_VISUAL - 20}
          width={ITEM_RAIO_VISUAL * 2 + 40}
          height={54}
          fill="rgba(0, 0, 0, 0.55)"
          cornerRadius={20}
        />
        <Text
          text={item.name_boe}
          fontFamily="Nunito"
          fontStyle="bold"
          fontSize={16}
          fill="#fff59d"
          width={ITEM_RAIO_VISUAL * 2 + 40}
          align="center"
          y={6}
        />
        <Text
          text={`(${item.name})`}
          fontFamily="Nunito"
          fontSize={13}
          fill="#f5f5f5"
          width={ITEM_RAIO_VISUAL * 2 + 40}
          align="center"
          y={28}
        />
      </Group>
    </Group>
  );
}
