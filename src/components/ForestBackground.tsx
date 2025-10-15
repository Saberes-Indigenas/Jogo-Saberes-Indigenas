/* Arquivo: src/components/ForestBackground.tsx */

import React, { useMemo, memo, useRef, useEffect } from "react";
import { useImageLoader } from "../hooks/useImageLoader";

// --- Importações das imagens (ATUALIZADAS PARA WEBP) ---
// Note que todas as importações agora apontam para a pasta /webp e usam a extensão .webp
import tree1Url from "../assets/webp/tree1.webp";
import tree2Url from "../assets/webp/tree2.webp";
import tree3Url from "../assets/webp/tree3.webp";
import tree4Url from "../assets/webp/tree4.webp";
import bushUrl from "../assets/webp/bush.webp";
import rockUrl from "../assets/webp/rock.webp";
import pieceForestUrl1 from "../assets/webp/pieceForest1.webp";
import pieceForestUrl2 from "../assets/webp/pieceForest2.webp";
import pieceForestUrl3 from "../assets/webp/pieceForest3.webp";
import pieceForestUrl4 from "../assets/webp/pieceForest4.webp";
import floorParticlesUrl from "../assets/webp/floorparticles.webp";
import floorParticle2Url from "../assets/webp/floorparticle2.webp";

// --- Constantes e Tipos (sem alterações) ---
const pieceForestUrls = [
  pieceForestUrl1,
  pieceForestUrl2,
  pieceForestUrl3,
  pieceForestUrl4,
];
const treeAssetUrls = [tree1Url, tree2Url, tree3Url, tree4Url];
const groundParticleUrls = [floorParticlesUrl, floorParticle2Url];

type AssetType = "PIECE_FOREST" | "TREE" | "BUSH" | "ROCK" | "GROUND_PARTICLE";

interface StaticAsset {
  id: number;
  type: AssetType;
  variant?: number;
  angle: number;
  distance: number;
  size: number;
  rotation?: number;
  isFlipped?: boolean;
  zIndex?: number;
}

// O restante do arquivo permanece exatamente o mesmo, pois a lógica não depende do formato da imagem.

const createGroundParticleRing = (
  baseId: number,
  options: {
    step: number;
    distance: number;
    size: number;
    zIndex: number;
    angleOffset?: number;
  }
): StaticAsset[] => {
  const { step, distance, size, zIndex, angleOffset = 0 } = options;
  const count = Math.max(1, Math.round(360 / step));
  return Array.from({ length: count }, (_, index) => {
    const angle = angleOffset + index * step;
    return {
      id: baseId + index,
      type: "GROUND_PARTICLE" as const,
      variant: index % groundParticleUrls.length,
      angle,
      distance,
      size,
      rotation: angle,
      zIndex,
    };
  });
};

const STATIC_FOREST_ASSETS: StaticAsset[] = [
  {
    id: 1,
    type: "PIECE_FOREST",
    variant: 0,
    angle: 20,
    distance: 1.7,
    size: 1.5,
    rotation: 20,
    zIndex: 10,
  },
  {
    id: 2,
    type: "PIECE_FOREST",
    variant: 1,
    angle: 75,
    distance: 1.5,
    size: 2.6,
    rotation: -5,
    zIndex: 10,
  },
  {
    id: 100,
    type: "PIECE_FOREST",
    variant: 3,
    angle: 110,
    distance: 1.3,
    size: 1.5,
    rotation: -5,
    zIndex: 10,
  },
  {
    id: 3,
    type: "PIECE_FOREST",
    variant: 2,
    angle: 150,
    distance: 1.5,
    size: 1.7,
    rotation: 35,
    isFlipped: true,
    zIndex: 10,
  },
  {
    id: 4,
    type: "PIECE_FOREST",
    variant: 0,
    angle: 210,
    distance: 1.6,
    size: 1.3,
    rotation: 90,
    isFlipped: true,
    zIndex: 10,
  },
  {
    id: 5,
    type: "PIECE_FOREST",
    variant: 1,
    angle: 240,
    distance: 1.2,
    size: 1.4,
    rotation: 5,
    zIndex: 10,
  },
  {
    id: 6,
    type: "PIECE_FOREST",
    variant: 2,
    angle: 290,
    distance: 1.3,
    size: 1.4,
    rotation: -15,
    zIndex: 10,
  },
  {
    id: 7,
    type: "PIECE_FOREST",
    variant: 0,
    angle: 340,
    distance: 1.8,
    size: 1.6,
    rotation: 10,
    isFlipped: true,
    zIndex: 11,
  },
  {
    id: 8,
    type: "TREE",
    variant: 1,
    angle: 360,
    distance: 1.8,
    size: 0.6,
    rotation: 70,
    zIndex: 9,
  },
  {
    id: 101,
    type: "BUSH",
    variant: 1,
    angle: 360,
    distance: 1.4,
    size: 0.4,
    rotation: 10,
    zIndex: 8,
  },

  {
    id: 9,
    type: "TREE",
    variant: 0,
    angle: 355,
    distance: 1.5,
    size: 0.3,
    rotation: 0,
    zIndex: 8,
  },
  {
    id: 10,
    type: "TREE",
    variant: 0,
    angle: 180,
    distance: 1.4,
    size: 0.7,
    rotation: 0,
    zIndex: 11,
  },
  {
    id: 11,
    type: "BUSH",
    variant: 0,
    angle: -40,
    distance: 1.6,
    size: 0.8,
    rotation: 40,
    zIndex: 1,
  },
  {
    id: 12,
    type: "BUSH",
    variant: 0,
    angle: 180,
    distance: 1.6,
    size: 0.8,
    rotation: 100,
    zIndex: 1,
  },
  {
    id: 13,
    type: "TREE",
    variant: 2,
    angle: -40,
    distance: 1.3,
    size: 0.8,
    rotation: 190,
    zIndex: 11,
  },
  {
    id: 14,
    type: "BUSH",
    variant: 0,
    angle: 155,
    distance: 2,
    size: 0.9,
    rotation: 40,
    zIndex: -1,
  },
  {
    id: 15,
    type: "BUSH",
    variant: 0,
    angle: 190,
    distance: 1.7,
    size: 0.5,
    rotation: 90,
    zIndex: 1,
  },
  {
    id: 16,
    type: "TREE",
    variant: 1,
    angle: 30,
    distance: 1.8,
    size: 0.7,
    rotation: 150,
    zIndex: 13,
  },
  {
    id: 17,
    type: "BUSH",
    variant: 0,
    angle: 27,
    distance: 2.2,
    size: 0.7,
    rotation: 150,
    zIndex: 1,
  },
  {
    id: 18,
    type: "PIECE_FOREST",
    variant: 3,
    angle: 200,
    distance: 2.8,
    size: 2.5,
    rotation: 90,
    zIndex: 10,
  },
  {
    id: 19,
    type: "TREE",
    variant: 3,
    angle: 210,
    distance: 2.8,
    size: 1.5,
    rotation: 90,
    zIndex: 9,
  },
  {
    id: 20,
    type: "BUSH",
    variant: 0,
    angle: 160,
    distance: 2.3,
    size: 1.2,
    rotation: 50,
    zIndex: 1,
  },
  {
    id: 21,
    type: "TREE",
    variant: 2,
    angle: 180,
    distance: 2.4,
    size: 1.2,
    rotation: 50,
    zIndex: 11,
  },
  {
    id: 22,
    type: "PIECE_FOREST",
    variant: 2,
    angle: 160,
    distance: 2.6,
    size: 1.2,
    rotation: 50,
    zIndex: 10,
  },
  {
    id: 23,
    type: "TREE",
    variant: 1,
    angle: 205,
    distance: 2,
    size: 0.8,
    rotation: 50,
    zIndex: 10,
  },
  {
    id: 24,
    type: "TREE",
    variant: 1,
    angle: 10,
    distance: 2.1,
    size: 0.7,
    rotation: 50,
    zIndex: 10,
  },
];

const FOREST_LAYOUT: StaticAsset[] = [
  ...createGroundParticleRing(1000, {
    step: 15,
    distance: 1.2,
    size: 0.9,
    zIndex: -50,
  }),
  ...createGroundParticleRing(1100, {
    step: 15,
    distance: 1.28,
    size: 0.85,
    zIndex: -51,
    angleOffset: 7.5,
  }),
  ...STATIC_FOREST_ASSETS,
];

interface RenderableAsset {
  id: number;
  src: string;
  x: number;
  y: number;
  size: number;
  rotation?: number;
  isFlipped?: boolean;
  zIndex?: number;
}

// ---- SUBCOMPONENTE OTIMIZADO PARA DESENHAR NO CANVAS (sem alterações) ----
const ForestCanvas = memo<{
  assets: RenderableAsset[];
  loadedImages: Map<string, HTMLImageElement>;
  width: number;
  height: number;
}>(({ assets, loadedImages, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || loadedImages.size === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    const sortedAssets = [...assets].sort(
      (a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0)
    );

    sortedAssets.forEach((asset) => {
      const img = loadedImages.get(asset.src);
      if (!img || img.naturalWidth === 0) return;

      ctx.save();
      ctx.translate(asset.x, asset.y);
      ctx.rotate((asset.rotation ?? 0) * (Math.PI / 180));
      ctx.scale(asset.isFlipped ? -1 : 1, 1);
      ctx.filter = "drop-shadow(2px 2px 4px rgba(0,0,0,0.4))";

      const aspectRatio = img.naturalWidth / img.naturalHeight;
      const drawWidth = asset.size;
      const drawHeight = drawWidth / aspectRatio;

      ctx.drawImage(
        img,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
      );

      ctx.restore();
    });
  }, [assets, loadedImages, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ position: "absolute", zIndex: 1, pointerEvents: "none" }}
    />
  );
});

// --- COMPONENTE PRINCIPAL (ORQUESTRADOR) (sem alterações na lógica) ---
const ForestBackground: React.FC<{
  stageCenter: { x: number; y: number };
  stageRadius: number;
  width: number;
  height: number;
  onReady?: () => void;
}> = ({ stageCenter, stageRadius, width, height, onReady }) => {
  const imageUrls = useMemo(() => {
    return [
      ...new Set([
        ...pieceForestUrls,
        ...treeAssetUrls,
        ...groundParticleUrls,
        bushUrl,
        rockUrl,
      ]),
    ];
  }, []);

  const { loadedImages, isLoading } = useImageLoader(imageUrls);
  const hasReportedReadyRef = useRef(false);
  const canRender = !isLoading && width > 0 && height > 0;

  useEffect(() => {
    if (!canRender || hasReportedReadyRef.current) {
      return;
    }
    hasReportedReadyRef.current = true;
    onReady?.();
  }, [canRender, onReady]);

  const assets = useMemo<RenderableAsset[]>(() => {
    if (width === 0 || height === 0) return [];

    return FOREST_LAYOUT.map((staticAsset) => {
      let src = "";
      switch (staticAsset.type) {
        case "PIECE_FOREST":
          src = pieceForestUrls[staticAsset.variant ?? 0];
          break;
        case "TREE":
          src = treeAssetUrls[staticAsset.variant ?? 0];
          break;
        case "GROUND_PARTICLE":
          src =
            groundParticleUrls[
              ((staticAsset.variant ?? 0) + groundParticleUrls.length) %
                groundParticleUrls.length
            ];
          break;
        case "BUSH":
          src = bushUrl;
          break;
        case "ROCK":
          src = rockUrl;
          break;
      }

      const angleInRadians = staticAsset.angle * (Math.PI / 180);
      const pixelDistance = staticAsset.distance * stageRadius;
      const x = stageCenter.x + Math.cos(angleInRadians) * pixelDistance;
      const y = stageCenter.y + Math.sin(angleInRadians) * pixelDistance;

      return {
        id: staticAsset.id,
        src: src,
        x,
        y,
        size: staticAsset.size * stageRadius,
        rotation: staticAsset.rotation,
        isFlipped: staticAsset.isFlipped,
        zIndex: staticAsset.zIndex,
      };
    });
  }, [stageCenter.x, stageCenter.y, stageRadius, width, height]);

  if (isLoading) {
    return null;
  }

  return (
    <ForestCanvas
      assets={assets}
      loadedImages={loadedImages}
      width={width}
      height={height}
    />
  );
};

export default memo(ForestBackground);
