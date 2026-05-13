import { useMemo, memo, useRef, useEffect } from "react";
import { useImageLoader } from "../hooks/useImageLoader";
import {
  pieceForestUrls,
  treeAssetUrls,
  groundParticleUrls,
  bushUrl,
  rockUrl,
  FOREST_LAYOUT,
} from "./forest-assets";

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

interface ForestCanvasProps {
  assets: RenderableAsset[];
  loadedImages: Map<string, HTMLImageElement>;
  width: number;
  height: number;
}

const ForestCanvas = memo(function ForestCanvas({
  assets,
  loadedImages,
  width,
  height,
}: ForestCanvasProps) {
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

interface ForestBackgroundProps {
  stageCenter: { x: number; y: number };
  stageRadius: number;
  width: number;
  height: number;
  onReady?: () => void;
}

export const ForestBackground = memo(function ForestBackground({
  stageCenter,
  stageRadius,
  width,
  height,
  onReady,
}: ForestBackgroundProps) {
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
});
