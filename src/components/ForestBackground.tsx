/* src/components/ForestBackground.tsx */

import React, { useMemo, memo } from "react";
// Importe todas as suas imagens de cenário
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

// --- MAPA DE RECURSOS (ASSETS) ---
const pieceForestUrls = [
  pieceForestUrl1,
  pieceForestUrl2,
  pieceForestUrl3,
  pieceForestUrl4,
];
const treeAssetUrls = [tree1Url, tree2Url, tree3Url, tree4Url];

// --- INTERFACES PARA O LAYOUT ESTÁTICO (USANDO COORDENADAS POLARES) ---
type AssetType = "PIECE_FOREST" | "TREE" | "BUSH" | "ROCK";

interface StaticAsset {
  id: number;
  type: AssetType;
  variant?: number;
  // MUDANÇA: Substituímos x/y por ângulo e distância
  angle: number; // Ângulo em graus (0-360) a partir do centro do palco
  distance: number; // Multiplicador do raio do palco (1.0 = na borda)
  size: number; // Tamanho, relativo ao raio do palco
  rotation?: number;
  isFlipped?: boolean;
  zIndex?: number;
}

// --- A PLANTA DA FLORESTA (AGORA RELATIVA AO PALCO) ---
// Edite aqui para desenhar sua floresta em volta do palco Bororo
// --- NOVA COMPOSIÇÃO VISUAL DE FLORESTA ---
// --- A PLANTA DA FLORESTA (AGORA RELATIVA AO PALCO) ---
// Edite aqui para desenhar sua floresta em volta do palco Bororo
// --- NOVA COMPOSIÇÃO VISUAL DE FLORESTA (MAIS DENSA) ---
const FOREST_LAYOUT: StaticAsset[] = [
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
    zIndex: 10,
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
    id: 8,
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
];
// Interface para o asset final, com posições em pixels
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

// ------------------- COMPONENTE DE RENDERIZAÇÃO -------------------
const ForestBackground: React.FC<{
  stageCenter: { x: number; y: number };
  stageRadius: number;
  width: number;
  height: number;
}> = ({ stageCenter, stageRadius, width, height }) => {
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
        case "BUSH":
          src = bushUrl;
          break;
        case "ROCK":
          src = rockUrl;
          break;
      }

      // MUDANÇA: Converte coordenadas polares (ângulo/distância) para pixels (x/y)
      const angleInRadians = staticAsset.angle * (Math.PI / 180);
      const pixelDistance = staticAsset.distance * stageRadius;

      const x = stageCenter.x + Math.cos(angleInRadians) * pixelDistance;
      const y = stageCenter.y + Math.sin(angleInRadians) * pixelDistance;

      return {
        id: staticAsset.id,
        src: src,
        x: x,
        y: y,
        size: staticAsset.size * stageRadius,
        rotation: staticAsset.rotation,
        isFlipped: staticAsset.isFlipped,
        zIndex: staticAsset.zIndex,
      };
    });
  }, [stageCenter.x, stageCenter.y, stageRadius, width, height]);

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      {assets
        .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))
        .map((asset) => (
          <img
            key={asset.id}
            src={asset.src}
            alt=""
            style={{
              position: "absolute",
              left: `${asset.x}px`,
              top: `${asset.y}px`,
              width: `${asset.size}px`,
              transform: `translate(-50%, -50%) rotate(${
                asset.rotation ?? 0
              }deg) scaleX(${asset.isFlipped ? -1 : 1})`,
              filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.4))",
              zIndex: asset.zIndex,
            }}
          />
        ))}
    </div>
  );
};

export default memo(ForestBackground);
