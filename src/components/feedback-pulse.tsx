import { useEffect, useRef } from "react";
import { Circle } from "react-konva";
import Konva from "konva";

interface FeedbackPulseProps {
  x: number;
  y: number;
  color: "correct" | "incorrect";
  onComplete: () => void;
}

export function FeedbackPulse({
  x,
  y,
  color,
  onComplete,
}: FeedbackPulseProps) {
  const circleRef = useRef<Konva.Circle>(null);

  useEffect(() => {
    if (circleRef.current) {
      const tween = new Konva.Tween({
        node: circleRef.current,
        scaleX: 1.2,
        scaleY: 1.2,
        opacity: 0,
        duration: 0.6,
        easing: Konva.Easings.EaseOut,
        onFinish: onComplete,
      });

      tween.play();
    }
  }, [onComplete]);

  const pulseColor = color === "correct" ? "#2ecc71" : "#e74c3c";

  return (
    <Circle
      ref={circleRef}
      x={x}
      y={y}
      radius={50}
      stroke={pulseColor}
      strokeWidth={4}
      listening={false}
      scaleX={0}
      scaleY={0}
      opacity={1}
    />
  );
}
