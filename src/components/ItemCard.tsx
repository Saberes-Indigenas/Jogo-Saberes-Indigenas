import { useEffect, useMemo, useRef, useState } from "react";
import { Group, Rect, Text, Line } from "react-konva";
import Konva from "konva";
import type { Item } from "../types";

interface ItemCardProps {
  item: Item;
  initial_pos: { x: number; y: number };
  isDraggable?: boolean;
  showLabels?: boolean;
  floating?: boolean;
}

const CARD_WIDTH = 150;
const CARD_HEIGHT = 190;
const ICON_FRAME_SIZE = 100;

const ItemCard = ({
  item,
  initial_pos,
  isDraggable = true,
  showLabels = true,
  floating = false,
}: ItemCardProps) => {
  const groupRef = useRef<Konva.Group>(null);
  const floatAnimRef = useRef<Konva.Animation | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const accentColor = useMemo(() => {
    const hueSeed = Math.abs(item.id.length * 47) % 360;
    return `hsl(${hueSeed}, 86%, 62%)`;
  }, [item.id.length]);

  useEffect(() => {
    if (!groupRef.current) return;

    const hoverTween = new Konva.Tween({
      node: groupRef.current,
      duration: 0.22,
      easing: Konva.Easings.EaseOut,
      x: isHovered ? initial_pos.x - 6 : initial_pos.x,
      y: isHovered ? initial_pos.y - 8 : initial_pos.y,
      rotation: isHovered ? 3 : 0,
      shadowOffsetX: isHovered ? 10 : 6,
      shadowOffsetY: isHovered ? 18 : 12,
      shadowBlur: isHovered ? 34 : 22,
      shadowOpacity: isHovered ? 0.45 : 0.35,
    });

    hoverTween.play();

    return () => hoverTween.destroy();
  }, [initial_pos.x, initial_pos.y, isHovered]);

  useEffect(() => {
    if (!groupRef.current) return;

    const scaleTween = new Konva.Tween({
      node: groupRef.current,
      duration: 0.12,
      easing: Konva.Easings.EaseOut,
      scaleX: isPressed ? 0.94 : 1,
      scaleY: isPressed ? 0.94 : 1,
    });

    scaleTween.play();

    return () => scaleTween.destroy();
  }, [isPressed]);

  useEffect(() => {
    if (!groupRef.current || !floating) {
      floatAnimRef.current?.stop();
      floatAnimRef.current = null;
      return;
    }

    const layer = groupRef.current.getLayer();
    if (!layer) return;

    const baseX = initial_pos.x;
    const baseY = initial_pos.y;

    const animation = new Konva.Animation((frame) => {
      if (!frame || !groupRef.current) return;
      const t = frame.time / 1000;
      const bob = Math.sin(t * 2.1) * 6;
      const wiggle = Math.sin(t * 3.6) * 2.5;
      groupRef.current.position({ x: baseX + wiggle, y: baseY + bob });
      groupRef.current.rotation(Math.sin(t * 3.6) * 2.5);
    }, layer);

    animation.start();
    floatAnimRef.current = animation;

    return () => {
      animation.stop();
      floatAnimRef.current = null;
    };
  }, [floating, initial_pos.x, initial_pos.y]);

  return (
    <Group
      ref={groupRef}
      x={initial_pos.x}
      y={initial_pos.y}
      draggable={isDraggable}
      listening={isDraggable}
      shadowColor="rgba(0,0,0,0.45)"
      shadowBlur={22}
      shadowOffsetX={6}
      shadowOffsetY={12}
      shadowOpacity={0.35}
      onMouseEnter={() => {
        if (!isDraggable) return;
        setIsHovered(true);
        const stage = groupRef.current?.getStage();
        if (stage) stage.container().style.cursor = "grab";
      }}
      onMouseLeave={() => {
        if (!isDraggable) return;
        setIsHovered(false);
        setIsPressed(false);
        const stage = groupRef.current?.getStage();
        if (stage) stage.container().style.cursor = "default";
      }}
      onMouseDown={() => {
        if (!isDraggable) return;
        setIsPressed(true);
        const stage = groupRef.current?.getStage();
        if (stage) stage.container().style.cursor = "grabbing";
      }}
      onMouseUp={() => {
        if (!isDraggable) return;
        setIsPressed(false);
        const stage = groupRef.current?.getStage();
        if (stage) stage.container().style.cursor = "grab";
      }}
    >
      <Group listening={false}>
        <Rect
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
          cornerRadius={28}
          fillLinearGradientStartPoint={{ x: 0, y: 0 }}
          fillLinearGradientEndPoint={{ x: 0, y: CARD_HEIGHT }}
          fillLinearGradientColorStops={[0, "#fff0d9", 0.5, "#ffe0b2", 1, "#ffcc80"]}
          stroke={accentColor}
          strokeWidth={4}
        />
        <Rect
          x={8}
          y={10}
          width={CARD_WIDTH - 16}
          height={CARD_HEIGHT - 20}
          cornerRadius={22}
          fillLinearGradientStartPoint={{ x: 0, y: 0 }}
          fillLinearGradientEndPoint={{ x: 0, y: CARD_HEIGHT }}
          fillLinearGradientColorStops={[0, "#ffffff", 1, "#ffe8c6"]}
          shadowColor="rgba(255, 217, 167, 0.6)"
          shadowBlur={18}
          shadowOpacity={0.6}
          shadowOffset={{ x: 0, y: 8 }}
        />
        <Line
          points={[16, 54, CARD_WIDTH - 16, 54]}
          stroke={accentColor}
          strokeWidth={2.5}
          lineCap="round"
          dash={[12, 6]}
          opacity={0.65}
        />
        <Line
          points={[22, CARD_HEIGHT - 60, CARD_WIDTH - 22, CARD_HEIGHT - 60]}
          stroke="#f57f17"
          strokeWidth={2}
          lineCap="round"
          dash={[6, 6]}
          opacity={0.6}
        />
      </Group>

      <Group x={(CARD_WIDTH - ICON_FRAME_SIZE) / 2} y={30} listening={false}>
        <Rect
          width={ICON_FRAME_SIZE}
          height={ICON_FRAME_SIZE}
          cornerRadius={22}
          fill={item.color}
          shadowColor="rgba(0,0,0,0.35)"
          shadowBlur={18}
          shadowOffset={{ x: 0, y: 12 }}
        />
        <Rect
          x={8}
          y={8}
          width={ICON_FRAME_SIZE - 16}
          height={ICON_FRAME_SIZE - 16}
          cornerRadius={18}
          stroke="rgba(255,255,255,0.75)"
          strokeWidth={3}
          dash={[10, 6]}
          opacity={0.9}
        />
        <Text
          text={item.icon}
          fontSize={46}
          width={ICON_FRAME_SIZE}
          height={ICON_FRAME_SIZE}
          align="center"
          verticalAlign="middle"
          fill="#fff8e1"
          shadowColor="rgba(0,0,0,0.4)"
          shadowBlur={6}
        />
      </Group>

      {showLabels && (
        <Group y={CARD_HEIGHT - 72} listening={false}>
          <Rect
            x={18}
            width={CARD_WIDTH - 36}
            height={54}
            cornerRadius={18}
            fill="#ffe5b5"
            shadowColor="rgba(255, 152, 0, 0.45)"
            shadowBlur={16}
            shadowOffset={{ x: 0, y: 6 }}
          />
          <Text
            text={item.name_boe}
            fontFamily="Nunito"
            fontStyle="900"
            fontSize={16}
            fill="#e65100"
            width={CARD_WIDTH - 36}
            align="center"
            y={6}
          />
          <Text
            text={`(${item.name})`}
            fontFamily="Nunito"
            fontSize={13}
            fill="#6d4c41"
            width={CARD_WIDTH - 36}
            align="center"
            y={26}
          />
        </Group>
      )}
    </Group>
  );
};

export default ItemCard;
