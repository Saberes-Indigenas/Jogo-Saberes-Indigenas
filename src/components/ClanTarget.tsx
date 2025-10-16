// ClanTarget.tsx

import { useEffect, useMemo, useState, useRef } from "react";
import { Image as KonvaImage, Text, Group, Circle } from "react-konva";
import Konva from "konva";

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

const ClanTarget = ({
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
}: ClanTargetProps) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [naturalSize, setNaturalSize] = useState({ width: 1, height: 1 });
  const groupRef = useRef<Konva.Group>(null);
  const imageRef = useRef<Konva.Image>(null);
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

  const targetRadius = stageRadius * 0.12;
  const baseWidth = targetRadius * 2.6;
  const aspectRatio = naturalSize.width / naturalSize.height;
  const imageWidth = baseWidth;
  const imageHeight = imageWidth / aspectRatio;
  const imageOffsetY = imageHeight * 0.65;
  const fontSize = targetRadius * 0.4;

  useEffect(() => {
    if (image && imageRef.current && textRef.current) {
      imageRef.current.cache();
      textRef.current.cache();
    }
    if (hasOfferings && glowRef.current) {
      glowRef.current.cache();
    }
  }, [image, hasOfferings]);

  // ==================================================================
  // ===== INÍCIO DA NOVA LÓGICA DE ANIMAÇÃO DE PULO "CARTOON" =====
  // ==================================================================
  useEffect(() => {
    if (!deliveryTrigger || !groupRef.current) return;

    const groupNode = groupRef.current;
    const jumpHeight = imageHeight * 0.25; // Quão alto o grupo vai pular
    const tweens: Konva.Tween[] = []; // Array para guardar os tweens e destruí-los depois

    // 1. Antecipação (achata antes de pular)
    const tweenAnticipation = new Konva.Tween({
      node: groupNode,
      duration: 1,
      scaleX: 2,
      scaleY: 0.85,
      easing: Konva.Easings.EaseOut,
    });
    tweens.push(tweenAnticipation);

    // 2. O Pulo (sobe e estica)
    const tweenJump = new Konva.Tween({
      node: groupNode,
      duration: 0.8,
      y: groupNode.y() - jumpHeight,
      scaleX: 0.5,
      scaleY: 1.1,
      easing: Konva.Easings.EaseOut,
    });
    tweens.push(tweenJump);

    // 3. A Queda (volta para a posição original)
    const tweenFall = new Konva.Tween({
      node: groupNode,
      duration: 0.8,
      y: groupNode.y(), // Volta para o Y original
      scaleX: 1,
      scaleY: 1,
      easing: Konva.Easings.EaseIn,
    });
    tweens.push(tweenFall);

    // 4. Impacto (achata com força ao aterrissar)
    const tweenImpact = new Konva.Tween({
      node: groupNode,
      duration: 0.7,
      scaleX: 1.2,
      scaleY: 0.8,
      easing: Konva.Easings.EaseOut,
      yoyo: true, // yoyo aqui faz ele achatar e voltar ao normal rapidamente
    });
    tweens.push(tweenImpact);

    // Encadeando as animações
    tweenAnticipation.onFinish = () => tweenJump.play();
    tweenJump.onFinish = () => tweenFall.play();
    tweenFall.onFinish = () => tweenImpact.play();

    // Inicia a primeira animação da cadeia
    tweenAnticipation.play();

    // Animação do brilho (pode continuar separada)
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

    // Função de limpeza: para todos os tweens se o componente desmontar
    return () => {
      tweens.forEach((t) => t.destroy());
    };
  }, [deliveryTrigger, imageHeight]); // Adicionamos imageHeight como dependência
  // ================================================================
  // ===== FIM DA NOVA LÓGICA DE ANIMAÇÃO =====
  // ================================================================
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
      if (!hasOfferings) return;
      container.style.cursor = "pointer";
    };
    const handleLeave = () => {
      container.style.cursor = "default";
    };

    node.on("mouseenter", handleEnter);
    node.on("mouseleave", handleLeave);
    return () => {
      node.off("mouseenter", handleEnter);
      node.off("mouseleave", handleLeave);
      if (container) container.style.cursor = "default";
    };
  }, [hasOfferings]);

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
          radius={targetRadius * 1.18}
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
        <KonvaImage
          ref={imageRef}
          image={image}
          width={imageWidth}
          height={imageHeight}
          offsetX={imageWidth / 2}
          offsetY={imageOffsetY}
          shadowColor="rgba(0,0,0,0.55)"
          shadowBlur={18}
          shadowOpacity={0.7}
          shadowOffset={{ x: 0, y: 10 }}
        />
      )}
      <Text
        ref={textRef}
        text={clanName}
        x={-targetRadius * 1}
        y={targetRadius * 1.15}
        width={targetRadius * 2}
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
};

export default ClanTarget;
