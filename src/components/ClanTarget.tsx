// ClanTarget.tsx

import { useEffect, useMemo, useState } from "react";
import { Image as KonvaImage, Text, Group } from "react-konva";

import ocaDireitaUrl from "../assets/ocaLadoDireito.svg";
import ocaEsquerdaUrl from "../assets/ocaLadoEsquerdo.svg";

interface ClanTargetProps {
  clanName: string;
  x: number;
  y: number;
  stageRadius: number; // Referência para dimensionamento responsivo
  centerX: number;
}

const ClanTarget = ({
  clanName,
  x,
  y,
  stageRadius,
  centerX,
}: ClanTargetProps) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [naturalSize, setNaturalSize] = useState({ width: 1, height: 1 });

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

  return (
    <Group x={x} y={y}>
      {image && (
        <KonvaImage
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
