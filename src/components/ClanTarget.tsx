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
  stageRadius: number; // Referência para dimensionamento responsivo
  centerX: number;
  hasOfferings: boolean;
  deliveryTrigger: number;
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
}: ClanTargetProps) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [naturalSize, setNaturalSize] = useState({ width: 1, height: 1 });
  const groupRef = useRef<Konva.Group>(null);
  const imageRef = useRef<Konva.Image>(null);
  const glowRef = useRef<Konva.Circle>(null);

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

    return () => {
      img.removeEventListener("load", handleLoad);
    };
  }, [selectedImageUrl]);

  const targetRadius = stageRadius * 0.12;
  const baseWidth = targetRadius * 2.6;
  const aspectRatio = naturalSize.width / naturalSize.height;
  const imageWidth = baseWidth;
  const imageHeight = imageWidth / aspectRatio;
  const imageOffsetY = imageHeight * 0.65;
  const fontSize = targetRadius * 0.22;

  useEffect(() => {
    if (!deliveryTrigger || !imageRef.current) return;

    const bounce = new Konva.Tween({
      node: imageRef.current,
      duration: 0.45,
      scaleX: 1.06,
      scaleY: 0.94,
      rotation: isRightSide ? 4.5 : -4.5,
      y: imageRef.current.y() - imageHeight * 0.08,
      easing: Konva.Easings.EaseInOut,
      yoyo: true,
      repeat: 1,
    });

    const halo = glowRef.current
      ? new Konva.Tween({
          node: glowRef.current,
          duration: 0.45,
          scaleX: 1.15,
          scaleY: 1.15,
          opacity: 0.95,
          easing: Konva.Easings.EaseOut,
          yoyo: true,
          repeat: 1,
        })
      : null;

    bounce.play();
    halo?.play();

    return () => {
      bounce.destroy();
      halo?.destroy();
    };
  }, [deliveryTrigger, imageHeight, isRightSide]);

  useEffect(() => {
    if (!groupRef.current) return;
    const stage = groupRef.current.getStage();
    if (!stage) return;

    const container = stage.container();
    const handleEnter = () => {
      if (!hasOfferings) return;
      container.style.cursor = "pointer";
    };
    const handleLeave = () => {
      container.style.cursor = "default";
    };

    const node = groupRef.current;
    node.on("mouseenter", handleEnter);
    node.on("mouseleave", handleLeave);

    return () => {
      node.off("mouseenter", handleEnter);
      node.off("mouseleave", handleLeave);
      if (container) {
        container.style.cursor = "default";
      }
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
      />
    </Group>
  );
};

export default ClanTarget;
