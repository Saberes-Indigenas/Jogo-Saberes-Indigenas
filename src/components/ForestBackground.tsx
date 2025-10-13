/* Arquivo: src/components/ForestBackground.tsx */

import React, { useMemo, memo, useRef, useEffect } from "react";
import { useImageLoader } from "../hooks/useImageLoader";

// Importações das imagens (sem alterações)
import tree1Url from "../assets/tree1.svg";
import tree2Url from "../assets/tree2.svg";
import tree3Url from "../assets/tree3.svg";
import tree4Url from "../assets/tree4.svg";
import bushUrl from "../assets/bush.svg";
import rockUrl from "../assets/rock.svg";
import pieceForestUrl1 from "../assets/pieceForest1.svg";
import pieceForestUrl2 from "../assets/pieceForest2.svg";
import pieceForestUrl3 from "../assets/pieceForest3.svg";
import pieceForestUrl4 from "../assets/pieceForest4.svg";
import floorParticlesUrl from "../assets/floorparticles.svg";
import floorParticle2Url from "../assets/floorparticle2.svg";

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

const FOREST_LAYOUT: StaticAsset[] = [
  {
    id: 901,
    type: "GROUND_PARTICLE",
    variant: 0,
    angle: 0, // Direita
    distance: 1.2,
    size: 0.9,
    rotation: 0,
    zIndex: -50,
  },
  {
    id: 902,
    type: "GROUND_PARTICLE",
    variant: 1,
    angle: 45, // Diagonal superior-direita
    distance: 1.2,
    size: 0.9,
    rotation: 45,
    zIndex: -50,
  },
  {
    id: 903,
    type: "GROUND_PARTICLE",
    variant: 0,
    angle: 90, // Topo
    distance: 1.2,
    size: 0.9,
    rotation: 90,
    zIndex: -50,
  },
  {
    id: 904,
    type: "GROUND_PARTICLE",
    variant: 1,
    angle: 135, // Diagonal superior-esquerda
    distance: 1.2,
    size: 0.9,
    rotation: 135,
    zIndex: -50,
  },
  {
    id: 905,
    type: "GROUND_PARTICLE",
    variant: 0,
    angle: 180, // Esquerda
    distance: 1.2,
    size: 0.9,
    rotation: 180,
    zIndex: -50,
  },
  {
    id: 906,
    type: "GROUND_PARTICLE",
    variant: 1,
    angle: 225, // Diagonal inferior-esquerda
    distance: 1.2,
    size: 0.9,
    rotation: 225,
    zIndex: -50,
  },
  {
    id: 907,
    type: "GROUND_PARTICLE",
    variant: 0,
    angle: 270, // Fundo
    distance: 1.2,
    size: 0.9,
    rotation: 270,
    zIndex: -50,
  },
  {
    id: 908,
    type: "GROUND_PARTICLE",
    variant: 1,
    angle: 315, // Diagonal inferior-direita
    distance: 1.2,
    size: 0.9,
    rotation: 315,
    zIndex: -50,
  }, // ========================================================
  //     INÍCIO DA SEÇÃO DE PARTÍCULAS DE CHÃO (EXPANDIDA)
  // ========================================================
  // --- Anel Interno (Mais denso) ---
  {
    id: 901,
    type: "GROUND_PARTICLE",
    variant: 0,
    angle: 0,
    distance: 1.2,
    size: 0.9,
    rotation: 0,
    zIndex: -50,
  },
  {
    id: 902,
    type: "GROUND_PARTICLE",
    variant: 1,
    angle: 15,
    distance: 1.2,
    size: 0.9,
    rotation: 15,
    zIndex: -50,
  },
  {
    id: 903,
    type: "GROUND_PARTICLE",
    variant: 0,
    angle: 30,
    distance: 1.2,
    size: 0.9,
    rotation: 30,
    zIndex: -50,
  },
  {
    id: 904,
    type: "GROUND_PARTICLE",
    variant: 1,
    angle: 45,
    distance: 1.2,
    size: 0.9,
    rotation: 45,
    zIndex: -50,
  },
  {
    id: 905,
    type: "GROUND_PARTICLE",
    variant: 0,
    angle: 60,
    distance: 1.2,
    size: 0.9,
    rotation: 60,
    zIndex: -50,
  },
  {
    id: 906,
    type: "GROUND_PARTICLE",
    variant: 1,
    angle: 75,
    distance: 1.2,
    size: 0.9,
    rotation: 75,
    zIndex: -50,
  },
  {
    id: 907,
    type: "GROUND_PARTICLE",
    variant: 0,
    angle: 90,
    distance: 1.2,
    size: 0.9,
    rotation: 90,
    zIndex: -50,
  },
  {
    id: 908,
    type: "GROUND_PARTICLE",
    variant: 1,
    angle: 105,
    distance: 1.2,
    size: 0.9,
    rotation: 105,
    zIndex: -50,
  },
  {
    id: 909,
    type: "GROUND_PARTICLE",
    variant: 0,
    angle: 120,
    distance: 1.2,
    size: 0.9,
    rotation: 120,
    zIndex: -50,
  },
  {
    id: 910,
    type: "GROUND_PARTICLE",
    variant: 1,
    angle: 135,
    distance: 1.2,
    size: 0.9,
    rotation: 135,
    zIndex: -50,
  },
  {
    id: 911,
    type: "GROUND_PARTICLE",
    variant: 0,
    angle: 150,
    distance: 1.2,
    size: 0.9,
    rotation: 150,
    zIndex: -50,
  },
  {
    id: 912,
    type: "GROUND_PARTICLE",
    variant: 1,
    angle: 165,
    distance: 1.2,
    size: 0.9,
    rotation: 165,
    zIndex: -50,
  },
  {
    id: 913,
    type: "GROUND_PARTICLE",
    variant: 0,
    angle: 180,
    distance: 1.2,
    size: 0.9,
    rotation: 180,
    zIndex: -50,
  },
  {
    id: 914,
    type: "GROUND_PARTICLE",
    variant: 1,
    angle: 195,
    distance: 1.2,
    size: 0.9,
    rotation: 195,
    zIndex: -50,
  },
  {
    id: 915,
    type: "GROUND_PARTICLE",
    variant: 0,
    angle: 210,
    distance: 1.2,
    size: 0.9,
    rotation: 210,
    zIndex: -50,
  },
  {
    id: 916,
    type: "GROUND_PARTICLE",
    variant: 1,
    angle: 225,
    distance: 1.2,
    size: 0.9,
    rotation: 225,
    zIndex: -50,
  },
  {
    id: 917,
    type: "GROUND_PARTICLE",
    variant: 0,
    angle: 240,
    distance: 1.2,
    size: 0.9,
    rotation: 240,
    zIndex: -50,
  },
  {
    id: 918,
    type: "GROUND_PARTICLE",
    variant: 1,
    angle: 255,
    distance: 1.2,
    size: 0.9,
    rotation: 255,
    zIndex: -50,
  },
  {
    id: 919,
    type: "GROUND_PARTICLE",
    variant: 0,
    angle: 270,
    distance: 1.2,
    size: 0.9,
    rotation: 270,
    zIndex: -50,
  },
  {
    id: 920,
    type: "GROUND_PARTICLE",
    variant: 1,
    angle: 285,
    distance: 1.2,
    size: 0.9,
    rotation: 285,
    zIndex: -50,
  },
  {
    id: 921,
    type: "GROUND_PARTICLE",
    variant: 0,
    angle: 300,
    distance: 1.2,
    size: 0.9,
    rotation: 300,
    zIndex: -50,
  },
  {
    id: 922,
    type: "GROUND_PARTICLE",
    variant: 1,
    angle: 315,
    distance: 1.2,
    size: 0.9,
    rotation: 315,
    zIndex: -50,
  },
  {
    id: 923,
    type: "GROUND_PARTICLE",
    variant: 0,
    angle: 330,
    distance: 1.2,
    size: 0.9,
    rotation: 330,
    zIndex: -50,
  },
  {
    id: 924,
    type: "GROUND_PARTICLE",
    variant: 1,
    angle: 345,
    distance: 1.2,
    size: 0.9,
    rotation: 345,
    zIndex: -50,
  },

  // --- Anel Externo (Para profundidade) ---
  {
    id: 951,
    type: "GROUND_PARTICLE",
    variant: 1,
    angle: 7.5,
    distance: 1.28,
    size: 0.85,
    rotation: 7.5,
    zIndex: -51,
  },
  {
    id: 952,
    type: "GROUND_PARTICLE",
    variant: 0,
    angle: 22.5,
    distance: 1.28,
    size: 0.85,
    rotation: 22.5,
    zIndex: -51,
  },
  {
    id: 953,
    type: "GROUND_PARTICLE",
    variant: 1,
    angle: 37.5,
    distance: 1.28,
    size: 0.85,
    rotation: 37.5,
    zIndex: -51,
  },
  {
    id: 954,
    type: "GROUND_PARTICLE",
    variant: 0,
    angle: 52.5,
    distance: 1.28,
    size: 0.85,
    rotation: 52.5,
    zIndex: -51,
  },
  {
    id: 955,
    type: "GROUND_PARTICLE",
    variant: 1,
    angle: 67.5,
    distance: 1.28,
    size: 0.85,
    rotation: 67.5,
    zIndex: -51,
  },
  {
    id: 956,
    type: "GROUND_PARTICLE",
    variant: 0,
    angle: 82.5,
    distance: 1.28,
    size: 0.85,
    rotation: 82.5,
    zIndex: -51,
  },
  {
    id: 957,
    type: "GROUND_PARTICLE",
    variant: 1,
    angle: 97.5,
    distance: 1.28,
    size: 0.85,
    rotation: 97.5,
    zIndex: -51,
  },
  {
    id: 958,
    type: "GROUND_PARTICLE",
    variant: 0,
    angle: 112.5,
    distance: 1.28,
    size: 0.85,
    rotation: 112.5,
    zIndex: -51,
  },
  {
    id: 959,
    type: "GROUND_PARTICLE",
    variant: 1,
    angle: 127.5,
    distance: 1.28,
    size: 0.85,
    rotation: 127.5,
    zIndex: -51,
  },
  {
    id: 960,
    type: "GROUND_PARTICLE",
    variant: 0,
    angle: 142.5,
    distance: 1.28,
    size: 0.85,
    rotation: 142.5,
    zIndex: -51,
  },
  {
    id: 961,
    type: "GROUND_PARTICLE",
    variant: 1,
    angle: 157.5,
    distance: 1.28,
    size: 0.85,
    rotation: 157.5,
    zIndex: -51,
  },
  {
    id: 962,
    type: "GROUND_PARTICLE",
    variant: 0,
    angle: 172.5,
    distance: 1.28,
    size: 0.85,
    rotation: 172.5,
    zIndex: -51,
  },
  {
    id: 963,
    type: "GROUND_PARTICLE",
    variant: 1,
    angle: 187.5,
    distance: 1.28,
    size: 0.85,
    rotation: 187.5,
    zIndex: -51,
  },
  {
    id: 964,
    type: "GROUND_PARTICLE",
    variant: 0,
    angle: 202.5,
    distance: 1.28,
    size: 0.85,
    rotation: 202.5,
    zIndex: -51,
  },
  {
    id: 965,
    type: "GROUND_PARTICLE",
    variant: 1,
    angle: 217.5,
    distance: 1.28,
    size: 0.85,
    rotation: 217.5,
    zIndex: -51,
  },
  {
    id: 966,
    type: "GROUND_PARTICLE",
    variant: 0,
    angle: 232.5,
    distance: 1.28,
    size: 0.85,
    rotation: 232.5,
    zIndex: -51,
  },
  {
    id: 967,
    type: "GROUND_PARTICLE",
    variant: 1,
    angle: 247.5,
    distance: 1.28,
    size: 0.85,
    rotation: 247.5,
    zIndex: -51,
  },
  {
    id: 968,
    type: "GROUND_PARTICLE",
    variant: 0,
    angle: 262.5,
    distance: 1.28,
    size: 0.85,
    rotation: 262.5,
    zIndex: -51,
  },
  {
    id: 969,
    type: "GROUND_PARTICLE",
    variant: 1,
    angle: 277.5,
    distance: 1.28,
    size: 0.85,
    rotation: 277.5,
    zIndex: -51,
  },
  {
    id: 970,
    type: "GROUND_PARTICLE",
    variant: 0,
    angle: 292.5,
    distance: 1.28,
    size: 0.85,
    rotation: 292.5,
    zIndex: -51,
  },
  {
    id: 971,
    type: "GROUND_PARTICLE",
    variant: 1,
    angle: 307.5,
    distance: 1.28,
    size: 0.85,
    rotation: 307.5,
    zIndex: -51,
  },
  {
    id: 972,
    type: "GROUND_PARTICLE",
    variant: 0,
    angle: 322.5,
    distance: 1.28,
    size: 0.85,
    rotation: 322.5,
    zIndex: -51,
  },
  {
    id: 973,
    type: "GROUND_PARTICLE",
    variant: 1,
    angle: 337.5,
    distance: 1.28,
    size: 0.85,
    rotation: 337.5,
    zIndex: -51,
  },
  {
    id: 974,
    type: "GROUND_PARTICLE",
    variant: 0,
    angle: 352.5,
    distance: 1.28,
    size: 0.85,
    rotation: 352.5,
    zIndex: -51,
  },
  // ========================================================
  //     FIM DA SEÇÃO DE PARTÍCULAS DE CHÃO
  // ========================================================

  // ... (a sua lista de assets permanece exatamente a mesma)
  // ========================================================
  // CAMADA DE FUNDO (SEUS ITENS ORIGINAIS - INTOCADOS)
  // ========================================================
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

// ---- SUBCOMPONENTE OTIMIZADO PARA DESENHAR NO CANVAS ----
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
      if (!img || img.naturalWidth === 0) return; // Garante que a imagem carregou e tem dimensões

      ctx.save();
      ctx.translate(asset.x, asset.y);
      ctx.rotate((asset.rotation ?? 0) * (Math.PI / 180));
      ctx.scale(asset.isFlipped ? -1 : 1, 1);
      ctx.filter = "drop-shadow(2px 2px 4px rgba(0,0,0,0.4))";

      // *** A CORREÇÃO ESTÁ AQUI ***
      // 1. Calcula a proporção da imagem original (largura / altura)
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      // 2. Define a nova largura com base no 'size' do layout
      const drawWidth = asset.size;
      // 3. Calcula a nova altura mantendo a proporção original
      const drawHeight = drawWidth / aspectRatio;

      // 4. Desenha a imagem com as dimensões corrigidas, centralizando-a
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

// ------------------- COMPONENTE PRINCIPAL (ORQUESTRADOR) -------------------
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
