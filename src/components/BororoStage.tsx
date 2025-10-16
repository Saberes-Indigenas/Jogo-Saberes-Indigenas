/* Arquivo: src/components/BororoStage.tsx */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import type { Clan, Item, PulseState } from "../types";
import ClanTarget from "./ClanTarget";
import FeedbackPulse from "./FeedbackPulse";
import EnteringOffering from "./EnteringOffering";
import type { EnteringOffering as EnteringOfferingState } from "../hooks/useGameLogic";
import ChaoBororo from "../assets/chãoBororo.svg";

interface BororoStageProps {
  clans: Clan[];
  clanTargets: { [key: string]: { x: number; y: number } };
  enteringOfferings: EnteringOfferingState[];
  feedbackPulse: PulseState;
  layout: {
    gameAreaWidth: number;
    gameAreaHeight: number;
    centroX: number;
    centroY: number;
    raioPalco: number;
  };
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onPulseComplete: () => void;
  onOfferingComplete: (offering: EnteringOfferingState) => void;
  clanInventories: Map<string, Item[]>;
  recentDeliveries: { [clanId: string]: number };
  onClanClick: (clanId: string) => void;
  onReady?: () => void;
  resetClanAnimationsKey: number;
}

const BororoStage = ({
  clans,
  clanTargets,
  enteringOfferings,
  feedbackPulse,
  layout,
  onDragOver,
  onDrop,
  onPulseComplete,
  onOfferingComplete,
  clanInventories,
  recentDeliveries,
  onClanClick,
  onReady,
  resetClanAnimationsKey,
}: BororoStageProps) => {
  const clanEntries = Object.entries(clanTargets);
  const clearingRadius = layout.raioPalco * 1.04;

  const stagePixelRatio = useMemo(() => {
    if (typeof window === "undefined") return 1;
    return Math.min(window.devicePixelRatio || 1, 1.5);
  }, []);

  // --- ESTADOS DE IMAGEM E CONTROLE ---
  const [chaoImage, setChaoImage] = useState<HTMLImageElement | null>(null);
  const [isGroundReady, setIsGroundReady] = useState(false);
  const hasSignaledReadyRef = useRef(false);

  // --- CARREGAMENTO ROBUSTO DO SVG (EVITA WIDTH/HEIGHT = 0) ---
  useEffect(() => {
    let url: string | null = null;

    const loadSvg = async () => {
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
    };

    loadSvg();

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, []);

  // --- AVISO AO GAMESTAGE QUANDO ESTIVER PRONTO ---
  useEffect(() => {
    if (!isGroundReady || hasSignaledReadyRef.current) return;
    hasSignaledReadyRef.current = true;
    onReady?.();
  }, [isGroundReady, onReady]);

  // --- TAMANHO FINAL DO CHÃO ---
  const svgSize = clearingRadius * 2;

  return (
    <main className="game-area" onDragOver={onDragOver} onDrop={onDrop}>
      <Stage
        width={layout.gameAreaWidth}
        height={layout.gameAreaHeight}
        pixelRatio={stagePixelRatio}
      >
        <Layer>
          {/* --- CHÃO BORORO (SEGURANÇA ADICIONAL) --- */}
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

          {/* --- TOTENS DOS CLÃS --- */}
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

          {/* --- ANIMAÇÕES DE OFERENDAS --- */}
          {enteringOfferings.map((offering) => (
            <EnteringOffering
              key={offering.key}
              offering={offering}
              onComplete={onOfferingComplete}
            />
          ))}

          {/* --- FEEDBACK VISUAL (PULSO DE COR) --- */}
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
};

export default BororoStage;
