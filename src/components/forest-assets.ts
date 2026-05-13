/* src/components/forest-assets.ts */

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

export const pieceForestUrls = [
  pieceForestUrl1,
  pieceForestUrl2,
  pieceForestUrl3,
  pieceForestUrl4,
];
export const treeAssetUrls = [tree1Url, tree2Url, tree3Url, tree4Url];
export const groundParticleUrls = [floorParticlesUrl, floorParticle2Url];
export { bushUrl, rockUrl };

export type AssetType = "PIECE_FOREST" | "TREE" | "BUSH" | "ROCK" | "GROUND_PARTICLE";

export interface StaticAsset {
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

export const createGroundParticleRing = (
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

export const STATIC_FOREST_ASSETS: StaticAsset[] = [
  { id: 1, type: "PIECE_FOREST", variant: 0, angle: 20, distance: 1.7, size: 1.5, rotation: 20, zIndex: 10 },
  { id: 2, type: "PIECE_FOREST", variant: 1, angle: 75, distance: 1.5, size: 2.6, rotation: -5, zIndex: 10 },
  { id: 100, type: "PIECE_FOREST", variant: 3, angle: 110, distance: 1.3, size: 1.5, rotation: -5, zIndex: 10 },
  { id: 3, type: "PIECE_FOREST", variant: 2, angle: 150, distance: 1.5, size: 1.7, rotation: 35, isFlipped: true, zIndex: 10 },
  { id: 4, type: "PIECE_FOREST", variant: 0, angle: 210, distance: 1.6, size: 1.3, rotation: 90, isFlipped: true, zIndex: 10 },
  { id: 5, type: "PIECE_FOREST", variant: 1, angle: 240, distance: 1.2, size: 1.4, rotation: 5, zIndex: 10 },
  { id: 6, type: "PIECE_FOREST", variant: 2, angle: 290, distance: 1.3, size: 1.4, rotation: -15, zIndex: 10 },
  { id: 7, type: "PIECE_FOREST", variant: 0, angle: 340, distance: 1.8, size: 1.6, rotation: 10, isFlipped: true, zIndex: 11 },
  { id: 8, type: "TREE", variant: 1, angle: 360, distance: 1.8, size: 0.6, rotation: 70, zIndex: 9 },
  { id: 101, type: "BUSH", variant: 1, angle: 360, distance: 1.4, size: 0.4, rotation: 10, zIndex: 8 },
  { id: 9, type: "TREE", variant: 0, angle: 355, distance: 1.5, size: 0.3, rotation: 0, zIndex: 8 },
  { id: 10, type: "TREE", variant: 0, angle: 180, distance: 1.4, size: 0.7, rotation: 0, zIndex: 11 },
  { id: 11, type: "BUSH", variant: 0, angle: -40, distance: 1.6, size: 0.8, rotation: 40, zIndex: 1 },
  { id: 12, type: "BUSH", variant: 0, angle: 180, distance: 1.6, size: 0.8, rotation: 100, zIndex: 1 },
  { id: 13, type: "TREE", variant: 2, angle: -40, distance: 1.3, size: 0.8, rotation: 190, zIndex: 11 },
  { id: 14, type: "BUSH", variant: 0, angle: 155, distance: 2, size: 0.9, rotation: 40, zIndex: -1 },
  { id: 15, type: "BUSH", variant: 0, angle: 190, distance: 1.7, size: 0.5, rotation: 90, zIndex: 1 },
  { id: 16, type: "TREE", variant: 1, angle: 30, distance: 1.8, size: 0.7, rotation: 150, zIndex: 13 },
  { id: 17, type: "BUSH", variant: 0, angle: 27, distance: 2.2, size: 0.7, rotation: 150, zIndex: 1 },
  { id: 18, type: "PIECE_FOREST", variant: 3, angle: 200, distance: 2.8, size: 2.5, rotation: 90, zIndex: 10 },
  { id: 19, type: "TREE", variant: 3, angle: 210, distance: 2.8, size: 1.5, rotation: 90, zIndex: 9 },
  { id: 20, type: "BUSH", variant: 0, angle: 160, distance: 2.3, size: 1.2, rotation: 50, zIndex: 1 },
  { id: 21, type: "TREE", variant: 2, angle: 180, distance: 2.4, size: 1.2, rotation: 50, zIndex: 11 },
  { id: 22, type: "PIECE_FOREST", variant: 2, angle: 160, distance: 2.6, size: 1.2, rotation: 50, zIndex: 10 },
  { id: 23, type: "TREE", variant: 1, angle: 205, distance: 2, size: 0.8, rotation: 50, zIndex: 10 },
  { id: 24, type: "TREE", variant: 1, angle: 10, distance: 2.1, size: 0.7, rotation: 50, zIndex: 10 },
];

export const FOREST_LAYOUT: StaticAsset[] = [
  ...createGroundParticleRing(1000, { step: 15, distance: 1.2, size: 0.9, zIndex: -50 }),
  ...createGroundParticleRing(1100, { step: 15, distance: 1.28, size: 0.85, zIndex: -51, angleOffset: 7.5 }),
  ...STATIC_FOREST_ASSETS,
];
