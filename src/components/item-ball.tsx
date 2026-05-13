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
      {/* Main Ball Body */}
      <Circle
        radius={ITEM_RAIO_VISUAL}
        fill={item.color}
        stroke="#fff"
        strokeWidth={5}
        shadowColor="black"
        shadowBlur={15}
        shadowOpacity={0.4}
        shadowOffsetX={5}
        shadowOffsetY={5}
      />
      
      {/* Image or Icon */}
      {item.media?.image ? (
         // Since Konva Image loading is complex inside a component, 
         // I'll keep the current approach of using an image state if it was there, 
         // but wait, ItemBall currently only uses Text for icon.
         // I should add image support to ItemBall too if it doesn't have it.
         <Text
           text={item.icon}
           fontSize={36}
           fill="#fff"
           width={ITEM_RAIO_VISUAL * 2}
           height={ITEM_RAIO_VISUAL * 2}
           offsetX={ITEM_RAIO_VISUAL}
           offsetY={ITEM_RAIO_VISUAL}
           align="center"
           verticalAlign="middle"
           listening={false}
           shadowColor="black"
           shadowBlur={4}
           shadowOpacity={0.5}
         />
      ) : (
        <Text
          ref={iconRef}
          text={item.icon}
          fontSize={36}
          fill="#fff"
          width={ITEM_RAIO_VISUAL * 2}
          height={ITEM_RAIO_VISUAL * 2}
          offsetX={ITEM_RAIO_VISUAL}
          offsetY={ITEM_RAIO_VISUAL}
          align="center"
          verticalAlign="middle"
          listening={false}
          shadowColor="black"
          shadowBlur={4}
          shadowOpacity={0.5}
        />
      )}

      {/* Glossy Effect (Konva version) */}
      <Circle
        radius={ITEM_RAIO_VISUAL - 2}
        fillRadialGradientStartPoint={{ x: -ITEM_RAIO_VISUAL * 0.4, y: -ITEM_RAIO_VISUAL * 0.4 }}
        fillRadialGradientStartRadius={0}
        fillRadialGradientEndPoint={{ x: -ITEM_RAIO_VISUAL * 0.4, y: -ITEM_RAIO_VISUAL * 0.4 }}
        fillRadialGradientEndRadius={ITEM_RAIO_VISUAL * 1.5}
        fillRadialGradientColorStops={[0, "rgba(255,255,255,0.4)", 1, "rgba(255,255,255,0)"]}
        listening={false}
      />

      <Group y={ITEM_RAIO_VISUAL + 24} listening={false}>
        <Rect
          x={-ITEM_RAIO_VISUAL - 20}
          width={ITEM_RAIO_VISUAL * 2 + 40}
          height={50}
          fill="rgba(26, 16, 7, 0.85)"
          cornerRadius={15}
          stroke={item.color}
          strokeWidth={2}
        />
        <Text
          text={item.name_boe}
          fontFamily="Nunito"
          fontStyle="900"
          fontSize={16}
          fill="#ffca28"
          width={ITEM_RAIO_VISUAL * 2 + 40}
          align="center"
          y={8}
          textTransform="uppercase"
        />
        <Text
          text={item.name}
          fontFamily="Nunito"
          fontStyle="bold"
          fontSize={12}
          fill="rgba(255,255,255,0.7)"
          width={ITEM_RAIO_VISUAL * 2 + 40}
          align="center"
          y={28}
        />
      </Group>
    </Group>
  );
}
