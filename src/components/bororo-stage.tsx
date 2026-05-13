import { useEffect, useMemo, useRef, useState } from "react";
import type { RefObject, DragEvent } from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import { useGameStore } from "../store/useGameStore";
import { ClanTarget } from "./clan-target";
import { FeedbackPulse } from "./feedback-pulse";
import ChaoBororo from "../assets/chãoBororo.svg";

interface BororoStageProps {
  onClanClick: (clanId: string) => void;
  onReady?: () => void;
  gameAreaWrapperRef: RefObject<HTMLDivElement | null>;
}

export function BororoStage({
  onClanClick,
  onReady,
  gameAreaWrapperRef,
}: BororoStageProps) {
  const clans = useGameStore((s) => s.clans);
  const clanTargets = useGameStore((s) => s.clanTargets);
  const feedbackPulse = useGameStore((s) => s.feedbackPulse);
  const layout = useGameStore((s) => s.layout);
  const clanInventories = useGameStore((s) => s.clanInventories);
  const recentDeliveries = useGameStore((s) => s.recentDeliveries);
  const resetClanAnimationsKey = useGameStore((s) => s.resetClanAnimationsKey);
  const handleDragOver = useGameStore((s) => s.handleDragOver);
  const handleDrop = useGameStore((s) => s.handleDrop);
  const onPulseComplete = useGameStore((s) => s.clearFeedbackPulse);

  const clanEntries = Object.entries(clanTargets);
  const clearingRadius = layout.raioPalco * 1.04;

  const stagePixelRatio = useMemo(() => {
    if (typeof window === "undefined") return 1;
    return Math.min(window.devicePixelRatio || 1, 1.5);
  }, []);

  const [chaoImage, setChaoImage] = useState<HTMLImageElement | null>(null);
  const [isGroundReady, setIsGroundReady] = useState(false);
  const hasSignaledReadyRef = useRef(false);

  useEffect(() => {
    let url: string | null = null;

    async function loadSvg() {
      try {
        const response = await fetch(ChaoBororo);
        const svgText = await response.text();
        const blob = new Blob([svgText], { type: "image/svg+xml" });
        url = URL.createObjectURL(blob);

        const img = new Image();
        img.onload = () => {
          if (img.width > 0 && img.height > 0) {
            setChaoImage(img);
          } else {
            console.warn("⚠️ SVG carregado mas sem dimensões válidas.");
          }
          setIsGroundReady(true);
          URL.revokeObjectURL(url!);
        };
        img.onerror = (err) => {
          console.error("❌ Erro ao carregar imagem SVG:", err);
          setIsGroundReady(true);
          if (url) URL.revokeObjectURL(url);
        };
        img.src = url;
      } catch (err) {
        console.error("❌ Falha ao processar o SVG:", err);
        setIsGroundReady(true);
        if (url) URL.revokeObjectURL(url);
      }
    }

    loadSvg();

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, []);

  useEffect(() => {
    if (!isGroundReady || hasSignaledReadyRef.current) return;
    hasSignaledReadyRef.current = true;
    onReady?.();
  }, [isGroundReady, onReady]);

  const svgSize = clearingRadius * 2;

  function handleStageDrop(e: DragEvent) {
    if (gameAreaWrapperRef.current) {
      const stageRect = gameAreaWrapperRef.current.getBoundingClientRect();
      handleDrop(e, stageRect);
    }
  }

  return (
    <main
      className="game-area"
      onDragOver={(e) => {
        if (gameAreaWrapperRef.current) {
          const stageRect = gameAreaWrapperRef.current.getBoundingClientRect();
          handleDragOver(e, stageRect);
        }
      }}
      onDrop={handleStageDrop}
    >
      <Stage
        width={layout.gameAreaWidth}
        height={layout.gameAreaHeight}
        pixelRatio={stagePixelRatio}
      >
        <Layer>
          {chaoImage && chaoImage.width > 0 && chaoImage.height > 0 && (
            <KonvaImage
              image={chaoImage}
              x={layout.centroX}
              y={layout.centroY}
              width={svgSize}
              height={svgSize}
              offsetX={svgSize / 2}
              offsetY={svgSize / 2}
              rotation={90}
              listening={false}
            />
          )}

          {clanEntries.map(([clanId, pos]) => {
            const clan = clans.find((c) => c.id === clanId);
            if (!clan) return null;
            const inventory = clanInventories.get(clan.id) || [];
            return (
              <ClanTarget
                key={clan.id}
                clanId={clan.id}
                clanName={clan.name}
                x={pos.x}
                y={pos.y}
                stageRadius={layout.raioPalco}
                centerX={layout.centroX}
                resetTrigger={resetClanAnimationsKey}
                hasOfferings={inventory.length > 0}
                deliveryTrigger={recentDeliveries[clan.id] ?? 0}
                onClick={() => onClanClick(clan.id)}
              />
            );
          })}


          {feedbackPulse && (
            <FeedbackPulse
              key={feedbackPulse.key}
              x={feedbackPulse.x}
              y={feedbackPulse.y}
              color={feedbackPulse.color}
              onComplete={onPulseComplete}
            />
          )}
        </Layer>
      </Stage>
    </main>
  );
}
