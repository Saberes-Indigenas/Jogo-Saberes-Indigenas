/* Arquivo: src/components/BororoStage.tsx */

import React from "react";
import { Stage, Layer, Circle as KonvaCircle } from "react-konva";
import type { Clan, Item, PulseState, ReturningItemState } from "../types";
import ClanTarget from "./ClanTarget";
import ItemBall from "./ItemBall";
import FeedbackPulse from "./FeedbackPulse";
import ReturningItem from "./ReturningItem";

interface BororoStageProps {
  clans: Clan[];
  clanTargets: { [key: string]: { x: number; y: number } };
  stageItems: Item[];
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
}

const BororoStage = ({
  clans,
  clanTargets,
  stageItems,
  feedbackPulse,
  returningItem,
  layout,
  onDragOver,
  onDrop,
  onPulseComplete,
  onReturnAnimationComplete,
}: BororoStageProps) => {
  const clanEntries = Object.entries(clanTargets);
  const clearingRadius = layout.raioPalco * 1.04;

  return (
    // Os eventos onDragOver e onDrop são aplicados aqui
    <main className="game-area" onDragOver={onDragOver} onDrop={onDrop}>
      <Stage
        width={layout.gameAreaWidth}
        // A altura do Stage considera o espaço real, descontando o Header
        height={layout.gameAreaHeight}
      >
        <Layer>
          {/* --- CHÃO DA MATA AO REDOR DA ALDEIA --- */}

          <KonvaCircle
            x={layout.centroX}
            y={layout.centroY}
            radius={clearingRadius}
            fillLinearGradientStartPoint={{
              x: -layout.raioPalco,
              y: -layout.raioPalco * 0.8,
            }}
            fillLinearGradientEndPoint={{
              x: layout.raioPalco,
              y: layout.raioPalco * 0.8,
            }}
            fillLinearGradientColorStops={[
              0,
              "#e8c489",
              0.45,
              "#f3d8a7",
              1,
              "#d9a86a",
            ]}
            stroke="rgba(112, 63, 20, 0.45)"
            strokeWidth={Math.max(layout.raioPalco * 0.025, 6)}
            shadowColor="rgba(0,0,0,0.35)"
            shadowBlur={32}
            shadowOffsetY={18}
          />

          {/* --- TOTENS DE CLÃ --- */}
          {clanEntries.map(([clanId, pos]) => {
            const clan = clans.find((c) => c.id === clanId);
            if (!clan) return null;
            return (
              <ClanTarget
                key={clan.id}
                clanName={clan.name}
                x={pos.x}
                y={pos.y}
                stageRadius={layout.raioPalco}
              />
            );
          })}

          {stageItems.map((item) => (
            <ItemBall
              key={item.id}
              item={item}
              initial_pos={{
                x: item.initial_pos.x,
                // CORREÇÃO: O 'y' já vem correto do hook
                y: item.initial_pos.y,
              }}
              isDraggable={false}
            />
          ))}

          {/* --- FEEDBACKS E ANIMAÇÕES --- */}
          {feedbackPulse && (
            <FeedbackPulse
              key={feedbackPulse.key}
              x={feedbackPulse.x}
              // CORREÇÃO: O 'y' já vem correto do hook
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
                // CORREÇÃO: O 'y' já vem correto do hook
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
