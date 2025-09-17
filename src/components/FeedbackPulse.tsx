import { useEffect, useRef } from "react";
import { Circle } from "react-konva";
import Konva from "konva";

interface FeedbackPulseProps {
  x: number;
  y: number;
  color: "correct" | "incorrect";
  onComplete: () => void;
}

const FeedbackPulse = ({ x, y, color, onComplete }: FeedbackPulseProps) => {
  const circleRef = useRef<Konva.Circle>(null);

  useEffect(() => {
    if (circleRef.current) {
      // A animação em si está correta
      const tween = new Konva.Tween({
        node: circleRef.current,
        scaleX: 1.2, // Aumentei um pouco para o efeito ficar mais visível
        scaleY: 1.2,
        opacity: 0,
        duration: 0.6,
        easing: Konva.Easings.EaseOut,
        onFinish: onComplete,
      });

      tween.play();
    }
    // MUDANÇA 1: A lista de dependências vazia ([]) garante que a animação
    // rode apenas uma vez quando o componente é criado, que é exatamente o que queremos.
  }, []);

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
      // MUDANÇA 2: Definimos o estado inicial diretamente nas props.
      // O círculo já "nasce" pequeno e opaco, pronto para a animação.
      scaleX={0}
      scaleY={0}
      opacity={1}
    />
  );
};

export default FeedbackPulse;
