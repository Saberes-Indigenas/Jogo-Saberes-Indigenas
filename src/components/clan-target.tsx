import { useEffect, useMemo, useState, useRef } from "react";
import { Image as KonvaImage, Text, Group, Circle } from "react-konva";
import Konva from "konva";
import { useGameStore } from "../store/useGameStore";

import ocaDireitaUrl from "../assets/ocaLadoDireito.svg";
import ocaEsquerdaUrl from "../assets/ocaLadoEsquerdo.svg";

interface ClanTargetProps {
  clanId: string;
  clanName: string;
  x: number;
  y: number;
  stageRadius: number;
  centerX: number;
  hasOfferings: boolean;
  deliveryTrigger: number;
  resetTrigger: number;
  onClick: () => void;
}

interface HutLayoutEntry {
  key: string;
  scale: number;
  offsetX: number; // múltiplo da largura da casa principal
  offsetY: number; // múltiplo da largura da casa principal (negativo = mais "atrás")
  opacity: number;
  shadowBlur: number;
}

// Pequeno hash estável a partir do id do clã, só para variar levemente a
// disposição das casinhas de aldeia pra aldeia sem ficar tudo idêntico.
function makeSeededRandom(seedText: string) {
  let seed = 0;
  for (let i = 0; i < seedText.length; i += 1) {
    seed = (seed * 31 + seedText.charCodeAt(i)) >>> 0;
  }
  return (max: number) => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return (seed % 1000) / 1000 * max;
  };
}

// Cada clã não é representado por uma oca isolada, e sim por um pequeno
// agrupamento: casinhas menores/mais translúcidas "atrás" dão profundidade,
// e a casa principal (maior, na frente) continua sendo o alvo visual central.
function buildHutCluster(clanId: string): HutLayoutEntry[] {
  const rand = makeSeededRandom(clanId);

  return [
    {
      key: "back-left",
      scale: 0.48 + rand(0.06),
      offsetX: -(0.3 + rand(0.06)),
      offsetY: -(0.34 + rand(0.08)),
      opacity: 0.82,
      shadowBlur: 8,
    },
    {
      key: "back-right",
      scale: 0.42 + rand(0.06),
      offsetX: 0.34 + rand(0.07),
      offsetY: -(0.42 + rand(0.1)),
      opacity: 0.78,
      shadowBlur: 8,
    },
    {
      key: "main",
      scale: 1,
      offsetX: 0,
      offsetY: 0,
      opacity: 1,
      shadowBlur: 18,
    },
  ];
}

export function ClanTarget({
  clanId,
  clanName,
  x,
  y,
  stageRadius,
  centerX,
  hasOfferings,
  deliveryTrigger,
  onClick,
  resetTrigger,
}: ClanTargetProps) {
  const hoveredClanId = useGameStore((s) => s.hoveredClanId);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [naturalSize, setNaturalSize] = useState({ width: 1, height: 1 });
  const groupRef = useRef<Konva.Group>(null);
  const hutsGroupRef = useRef<Konva.Group>(null);
  const glowRef = useRef<Konva.Circle>(null);
  const textRef = useRef<Konva.Text>(null);

  const isRightSide = useMemo(() => x >= centerX, [x, centerX]);
  const selectedImageUrl = isRightSide ? ocaEsquerdaUrl : ocaDireitaUrl;

  useEffect(() => {
    const img = new Image();
    img.src = selectedImageUrl;

    const handleLoad = () => {
      setNaturalSize({
        width: img.naturalWidth || 1,
        height: img.naturalHeight || 1,
      });
      setImage(img);
    };

    if (img.complete) {
      handleLoad();
    } else {
      img.addEventListener("load", handleLoad);
    }

    return () => img.removeEventListener("load", handleLoad);
  }, [selectedImageUrl]);

  const targetRadius = stageRadius * 0.105;
  const baseWidth = targetRadius * 2.3;
  const aspectRatio = naturalSize.width / naturalSize.height;
  const imageWidth = baseWidth;
  const imageHeight = imageWidth / aspectRatio;
  // Fonte do nome do clã desacoplada do tamanho da oca: precisa continuar
  // grande e legível mesmo com a casa reduzida.
  const fontSize = targetRadius * 0.55;
  const labelWidth = targetRadius * 3.2;

  const hutCluster = useMemo(() => buildHutCluster(clanId), [clanId]);

  useEffect(() => {
    if (image && hutsGroupRef.current && textRef.current) {
      hutsGroupRef.current.cache();
      textRef.current.cache();
    }
    if (hasOfferings && glowRef.current) {
      glowRef.current.cache();
    }
  }, [image, hasOfferings]);

  useEffect(() => {
    if (!deliveryTrigger || !groupRef.current) return;

    const groupNode = groupRef.current;
    const jumpHeight = imageHeight * 0.25;
    const tweens: Konva.Tween[] = [];

    const tweenAnticipation = new Konva.Tween({
      node: groupNode,
      duration: 1,
      scaleX: 2,
      scaleY: 0.85,
      easing: Konva.Easings.EaseOut,
    });
    tweens.push(tweenAnticipation);

    const tweenJump = new Konva.Tween({
      node: groupNode,
      duration: 0.8,
      y: groupNode.y() - jumpHeight,
      scaleX: 0.5,
      scaleY: 1.1,
      easing: Konva.Easings.EaseOut,
    });
    tweens.push(tweenJump);

    const tweenFall = new Konva.Tween({
      node: groupNode,
      duration: 0.8,
      y: groupNode.y(),
      scaleX: 1,
      scaleY: 1,
      easing: Konva.Easings.EaseIn,
    });
    tweens.push(tweenFall);

    const tweenImpact = new Konva.Tween({
      node: groupNode,
      duration: 0.7,
      scaleX: 1.2,
      scaleY: 0.8,
      easing: Konva.Easings.EaseOut,
      yoyo: true,
    });
    tweens.push(tweenImpact);

    tweenAnticipation.onFinish = () => tweenJump.play();
    tweenJump.onFinish = () => tweenFall.play();
    tweenFall.onFinish = () => tweenImpact.play();

    tweenAnticipation.play();

    const halo = glowRef.current
      ? new Konva.Tween({
          node: glowRef.current,
          duration: 0.4,
          scaleX: 1.25,
          scaleY: 1.25,
          opacity: 0.95,
          easing: Konva.Easings.EaseOut,
          yoyo: true,
        })
      : null;
    halo?.play();
    if (halo) tweens.push(halo);

    return () => {
      tweens.forEach((t) => t.destroy());
    };
  }, [deliveryTrigger, imageHeight]);

  const isVisualHovered = isHovered || hoveredClanId === clanId;

  useEffect(() => {
    const node = groupRef.current;
    if (!node) return;

    node.to({
      scaleX: isVisualHovered ? 1.08 : 1,
      scaleY: isVisualHovered ? 1.08 : 1,
      duration: 0.2,
      easing: Konva.Easings.EaseOut,
    });
  }, [isVisualHovered]);

  useEffect(() => {
    const node = groupRef.current;
    if (!node) return;

    node.to({
      scaleX: 1,
      scaleY: 1,
      duration: 0.3,
      easing: Konva.Easings.EaseOut,
    });
  }, [resetTrigger]);

  useEffect(() => {
    const node = groupRef.current;
    const stage = node?.getStage();
    if (!node || !stage) return;

    const container = stage.container();
    const handleEnter = () => {
      setIsHovered(true);
      container.style.cursor = "pointer";
    };
    const handleLeave = () => {
      setIsHovered(false);
      container.style.cursor = "default";
    };

    node.on("mouseenter", handleEnter);
    node.on("mouseleave", handleLeave);
    return () => {
      node.off("mouseenter", handleEnter);
      node.off("mouseleave", handleLeave);
      if (container) container.style.cursor = "default";
    };
  }, []);

  return (
    <Group
      ref={groupRef}
      x={x}
      y={y}
      onClick={() => hasOfferings && onClick()}
      onTap={() => hasOfferings && onClick()}
      listening
      name={`clan-target-${clanId}`}
    >
      {hasOfferings && (
        <Circle
          ref={glowRef}
          radius={targetRadius * 1.5}
          fillRadialGradientColorStops={[
            0,
            "rgba(255, 241, 179, 0.85)",
            0.35,
            "rgba(255, 214, 102, 0.65)",
            1,
            "rgba(255, 214, 102, 0)",
          ]}
          offsetY={targetRadius * 0.2}
          opacity={0.85}
          listening={false}
        />
      )}
      {image && (
        <Group ref={hutsGroupRef}>
          {hutCluster.map((hut) => {
            const hutWidth = imageWidth * hut.scale;
            const hutHeight = imageHeight * hut.scale;
            return (
              <KonvaImage
                key={hut.key}
                image={image}
                x={hut.offsetX * baseWidth}
                y={hut.offsetY * baseWidth}
                width={hutWidth}
                height={hutHeight}
                offsetX={hutWidth / 2}
                offsetY={hutHeight * 0.65}
                opacity={hut.opacity}
                shadowColor="rgba(0,0,0,0.55)"
                shadowBlur={hut.shadowBlur}
                shadowOpacity={0.7}
                shadowOffset={{ x: 0, y: hut.key === "main" ? 10 : 6 }}
              />
            );
          })}
        </Group>
      )}
      <Text
        ref={textRef}
        text={clanName}
        x={-labelWidth / 2}
        y={targetRadius * 1.2}
        width={labelWidth}
        align="center"
        fontSize={fontSize}
        fontStyle="bold"
        fill="#f5f5f5"
        listening={false}
        shadowColor="black"
        shadowBlur={5}
        shadowOpacity={0.85}
        stroke="rgba(0, 0, 0, 0.9)"
        strokeWidth={0.5}
      />
    </Group>
  );
}
