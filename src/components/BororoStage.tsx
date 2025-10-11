/* Arquivo: src/components/BororoStage.tsx */

import React, { useState, useEffect } from "react"; // Importe useState e useEffect
import { Stage, Layer, Image as KonvaImage } from "react-konva"; // Importe KonvaImage
import type { Clan, Item, PulseState, ReturningItemState } from "../types";
import ClanTarget from "./ClanTarget";
import FeedbackPulse from "./FeedbackPulse";
import ReturningItem from "./ReturningItem";
import EnteringOffering from "./EnteringOffering";
import type { EnteringOffering as EnteringOfferingState } from "../hooks/useGameLogic";
import ChaoBororo from "../assets/chãoBororo.svg"; // Seu SVG

interface BororoStageProps {
  clans: Clan[];
  clanTargets: { [key: string]: { x: number; y: number } };
  enteringOfferings: EnteringOfferingState[];
  feedbackPulse: PulseState;
  returningItem: ReturningItemState;
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
  onReturnAnimationComplete: () => void;
  onOfferingComplete: (offering: EnteringOfferingState) => void;
  clanInventories: Map<string, Item[]>;
  recentDeliveries: { [clanId: string]: number };
  onClanClick: (clanId: string) => void;
}

const BororoStage = ({
  clans,
  clanTargets,
  enteringOfferings,
  feedbackPulse,
  returningItem,
  layout,
  onDragOver,
  onDrop,
  onPulseComplete,
  onReturnAnimationComplete,
  onOfferingComplete,
  clanInventories,
  recentDeliveries,
  onClanClick,
}: BororoStageProps) => {
  const clanEntries = Object.entries(clanTargets);
  const clearingRadius = layout.raioPalco * 1.04;

  // --- NOVO: Estado para a imagem SVG ---
  const [chaoImage, setChaoImage] = useState<HTMLImageElement | undefined>(
    undefined
  );

  // --- NOVO: Efeito para carregar a imagem SVG ---
  useEffect(() => {
    const image = new window.Image();
    image.src = ChaoBororo;
    image.onload = () => {
      setChaoImage(image);
    };
    image.onerror = (err) => {
      console.error("Erro ao carregar a imagem do chão Bororo:", err);
    };
  }, []); // O array vazio garante que o efeito só roda uma vez ao montar o componente

  // O tamanho do SVG será o diâmetro do círculo, que é 2 * raio.
  const svgSize = clearingRadius * 2;

  return (
    <main className="game-area" onDragOver={onDragOver} onDrop={onDrop}>
      <Stage width={layout.gameAreaWidth} height={layout.gameAreaHeight}>
        <Layer>
          {/* --- CHÃO DA MATA AO REDOR DA ALDEIA (AGORA SVG) --- */}
          {chaoImage && ( // Só renderiza a imagem depois que ela for carregada
            <KonvaImage
              image={chaoImage}
              x={layout.centroX}
              y={layout.centroY}
              width={svgSize}
              height={svgSize}
              offsetX={svgSize / 2} // Define o centro da imagem como ponto de origem
              offsetY={svgSize / 2} // para que a rotação e posicionamento sejam corretos
              rotation={90} // Rotação de 90 graus
            />
          )}

          {/* O restante do seu código permanece o mesmo */}
          {/* --- TOTENS DE CLÃ --- */}
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
                hasOfferings={inventory.length > 0}
                deliveryTrigger={recentDeliveries[clan.id] ?? 0}
                onClick={() => onClanClick(clan.id)}
              />
            );
          })}

          {enteringOfferings.map((offering) => (
            <EnteringOffering
              key={offering.key}
              offering={offering}
              onComplete={onOfferingComplete}
            />
          ))}

          {/* --- FEEDBACKS E ANIMAÇÕES --- */}
          {feedbackPulse && (
            <FeedbackPulse
              key={feedbackPulse.key}
              x={feedbackPulse.x}
              y={feedbackPulse.y}
              color={feedbackPulse.color}
              onComplete={onPulseComplete}
            />
          )}
          {returningItem && (
            <ReturningItem
              itemData={returningItem.item}
              startPos={{
                x: returningItem.startPos.x,
                y: returningItem.startPos.y,
              }}
              endPos={returningItem.endPos}
              onComplete={onReturnAnimationComplete}
            />
          )}
        </Layer>
      </Stage>
    </main>
  );
};

export default BororoStage;
