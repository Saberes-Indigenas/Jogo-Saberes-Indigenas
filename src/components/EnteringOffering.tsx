import { useEffect, useMemo, useRef } from "react";
import { Group, Circle, Text, RegularPolygon, Star } from "react-konva";
import Konva from "konva";
import type { EnteringOffering as EnteringOfferingState } from "../hooks/useGameLogic";

interface EnteringOfferingProps {
  offering: EnteringOfferingState;
  onComplete: (offering: EnteringOfferingState) => void;
}

const BASE_RADIUS = 52;

const EnteringOffering = ({ offering, onComplete }: EnteringOfferingProps) => {
  const groupRef = useRef<Konva.Group>(null);
  const sparkleRef = useRef<Konva.Group>(null);

  const accentColor = useMemo(() => {
    const hueSeed = Math.abs(offering.item.id.length * 37) % 360;
    return `hsl(${hueSeed}, 82%, 64%)`;
  }, [offering.item.id.length]);

  useEffect(() => {
    if (!groupRef.current) return;

    const travelTween = new Konva.Tween({
      node: groupRef.current,
      duration: 0.9,
      x: offering.endPos.x,
      y: offering.endPos.y - BASE_RADIUS * 0.2,
      scaleX: 0.25,
      scaleY: 0.25,
      opacity: 0,
      rotation: offering.startPos.x < offering.endPos.x ? -18 : 18,
      easing: Konva.Easings.EaseInOut,
      onFinish: () => onComplete(offering),
    });

    const wobble = new Konva.Tween({
      node: groupRef.current,
      duration: 0.3,
      scaleX: 1.12,
      scaleY: 0.92,
      yoyo: true,
      repeat: 3,
      easing: Konva.Easings.EaseInOut,
    });

    travelTween.play();
    wobble.play();

    return () => {
      travelTween.destroy();
      wobble.destroy();
    };
  }, [offering, onComplete]);

  useEffect(() => {
    if (!sparkleRef.current) return;

    const sparkleAnim = new Konva.Animation((frame) => {
      if (!frame) return;
      const pulse = (Math.sin(frame.time / 160) + 1) / 2;
      sparkleRef.current?.scale({ x: 0.9 + pulse * 0.2, y: 0.9 + pulse * 0.2 });
      sparkleRef.current?.opacity(0.6 + pulse * 0.3);
    }, sparkleRef.current.getLayer());

    sparkleAnim.start();

    return () => {
      sparkleAnim.stop();
    };
  }, []);

  return (
    <Group
      ref={groupRef}
      x={offering.startPos.x}
      y={offering.startPos.y}
      opacity={0.98}
      listening={false}
    >
      <Group ref={sparkleRef} opacity={0.75} listening={false}>
        <Star
          numPoints={6}
          innerRadius={BASE_RADIUS * 0.32}
          outerRadius={BASE_RADIUS * 0.62}
          fill={`${accentColor}55`}
          rotation={12}
        />
        <RegularPolygon
          sides={4}
          radius={BASE_RADIUS * 0.55}
          fill={`${accentColor}66`}
          rotation={45}
        />
      </Group>
      <Circle
        radius={BASE_RADIUS}
        fill={offering.item.color}
        stroke="#ffffff"
        strokeWidth={4}
        shadowColor="rgba(0,0,0,0.55)"
        shadowBlur={14}
        shadowOffset={{ x: 0, y: 10 }}
      />
      <Text
        text={offering.item.icon}
        fontSize={38}
        align="center"
        verticalAlign="middle"
        width={BASE_RADIUS * 2}
        height={BASE_RADIUS * 2}
        offsetX={BASE_RADIUS}
        offsetY={BASE_RADIUS}
        fill="#fff8e1"
        listening={false}
      />
    </Group>
  );
};

export default EnteringOffering;
