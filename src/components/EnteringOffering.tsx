import { useEffect, useMemo, useRef } from "react";
import { Group, Circle, Text } from "react-konva";
import Konva from "konva";
import type { EnteringOffering as EnteringOfferingState } from "../hooks/useGameLogic";

interface EnteringOfferingProps {
  offering: EnteringOfferingState;
  onComplete: (offering: EnteringOfferingState) => void;
}

const BASE_RADIUS = 52;

const EnteringOffering = ({ offering, onComplete }: EnteringOfferingProps) => {
  const groupRef = useRef<Konva.Group>(null); // grupo fixo
  const textRef = useRef<Konva.Text>(null); // apenas o texto vai girar

  const accentColor = useMemo(() => {
    const hueSeed = Math.abs(offering.item.id.length * 37) % 360;
    return `hsl(${hueSeed}, 82%, 64%)`;
  }, [offering.item.id.length]);

  // ================================================================
  // ===== ANIMAÇÃO =====
  // ================================================================
  useEffect(() => {
    if (!groupRef.current) return;

    const tweens: Konva.Tween[] = [];
    const node = groupRef.current;

    // Começa no tamanho original
    node.scale({ x: 1, y: 1 });

    // --- FASE 1: Crescimento suave ---
    const growTween = new Konva.Tween({
      node,
      duration: 0.3,
      scaleX: 1.5,
      scaleY: 1.5,
      easing: Konva.Easings.BackEaseOut, // ✅ nome correto
    });
    tweens.push(growTween);

    // --- FASE 2: Contração / sucção ---
    const shrinkTween = new Konva.Tween({
      node,
      duration: 0.25,
      scaleX: 0,
      scaleY: 0,
      easing: Konva.Easings.EaseIn, // ✅ nome correto
      onFinish: () => onComplete(offering),
    });
    tweens.push(shrinkTween);

    // Encadeamento
    growTween.onFinish = () => shrinkTween.play();

    // Inicia a sequência
    growTween.play();

    // --- ROTAÇÃO DO TEXTO (somente o ícone gira) ---
    if (textRef.current) {
      const textTween = new Konva.Tween({
        node: textRef.current,
        duration: 0.55,
        rotation: 360,
        easing: Konva.Easings.Linear,
      });
      textTween.play();
      tweens.push(textTween);
    }

    return () => tweens.forEach((t) => t.destroy());
  }, [offering, onComplete]);

  // ================================================================
  // ===== RENDERIZAÇÃO =====
  // ================================================================
  return (
    <Group
      ref={groupRef}
      x={offering.endPos.x}
      y={offering.endPos.y}
      offsetX={BASE_RADIUS}
      offsetY={BASE_RADIUS}
      listening={false}
      opacity={0.98}
    >
      {/* Bola principal */}
      <Circle
        radius={BASE_RADIUS}
        fill={offering.item.color}
        stroke={accentColor}
        strokeWidth={4}
        shadowColor="rgba(0,0,0,0.55)"
        shadowBlur={12}
        shadowOffset={{ x: 0, y: 6 }}
      />

      {/* Ícone central rotativo */}
      <Text
        ref={textRef}
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
