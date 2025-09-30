import React from "react";
import {
  Stage,
  Layer,
  Circle as KonvaCircle,
  Arc,
  Line,
  Star,
} from "react-konva";
import type { Clan, Item, PulseState, ReturningItemState } from "../types";
import ClanTarget from "./ClanTarget";
import ItemBall from "./ItemBall";
import FeedbackPulse from "./FeedbackPulse";
import ReturningItem from "./ReturningItem";
import { HEADER_HEIGHT } from "../config/layoutConstants";

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
  return (
    <main className="game-area" onDragOver={onDragOver} onDrop={onDrop}>
      <Stage
        width={layout.gameAreaWidth}
        height={layout.gameAreaHeight - HEADER_HEIGHT}
      >
        <Layer>
          {/* --- FUNDO DO PALCO (cartoon com borda grossa) --- */}
          <KonvaCircle
            x={layout.centroX}
            y={layout.centroY - HEADER_HEIGHT / 2}
            radius={layout.raioPalco}
            fillLinearGradientStartPoint={{
              x: -layout.raioPalco,
              y: -layout.raioPalco,
            }}
            fillLinearGradientEndPoint={{
              x: layout.raioPalco,
              y: layout.raioPalco,
            }}
            fillLinearGradientColorStops={[
              0,
              "#7a7860",
              0.5,
              "#5c5b46",
              1,
              "#3d3b2e",
            ]}
            stroke="#2a2a2a"
            strokeWidth={6} // borda grossa cartoon
            shadowColor="#000"
            shadowBlur={15}
            shadowOpacity={0.4}
          />

          {/* --- METADE VERMELHA E PRETA (mas cartoon, cores chapadas com opacidade) --- */}
          <Arc
            x={layout.centroX}
            y={layout.centroY - HEADER_HEIGHT / 2}
            innerRadius={0}
            outerRadius={layout.raioPalco}
            angle={180}
            fill="rgba(220, 60, 60, 0.3)"
            rotation={-90}
            stroke="#2a2a2a"
            strokeWidth={3}
          />
          <Arc
            x={layout.centroX}
            y={layout.centroY - HEADER_HEIGHT / 2}
            innerRadius={0}
            outerRadius={layout.raioPalco}
            angle={180}
            fill="rgba(40, 40, 40, 0.3)"
            rotation={90}
            stroke="#2a2a2a"
            strokeWidth={3}
          />

          {/* --- CÍRCULO INTERNO (como uma borda cartoon decorativa) --- */}
          <KonvaCircle
            x={layout.centroX}
            y={layout.centroY - HEADER_HEIGHT / 2}
            radius={layout.raioPalco * 0.25}
            stroke="#2a2a2a"
            strokeWidth={4}
            fill="rgba(255,255,255,0.05)"
            shadowColor="#fff"
            shadowBlur={10}
            dash={[12, 6]}
          />

          {/* --- LINHA CENTRAL (cartoon tracejada) --- */}
          <Line
            points={[
              layout.centroX,
              layout.centroY - HEADER_HEIGHT / 2 - layout.raioPalco,
              layout.centroX,
              layout.centroY - HEADER_HEIGHT / 2 + layout.raioPalco,
            ]}
            stroke="#2a2a2a"
            strokeWidth={3}
            dash={[15, 8]}
            opacity={0.9}
          />

          {/* --- RAIOS PARA OS CLÃS (bem estilizados) --- */}
          {Object.keys(clanTargets).map((clanId) => {
            const pos = clanTargets[clanId];
            const angle = Math.atan2(
              pos.y - layout.centroY,
              pos.x - layout.centroX
            );
            const startX =
              layout.centroX + layout.raioPalco * 0.25 * Math.cos(angle);
            const startY =
              layout.centroY -
              HEADER_HEIGHT / 2 +
              layout.raioPalco * 0.25 * Math.sin(angle);
            const endX = layout.centroX + layout.raioPalco * Math.cos(angle);
            const endY =
              layout.centroY -
              HEADER_HEIGHT / 2 +
              layout.raioPalco * Math.sin(angle);

            return (
              <Line
                key={`line-${clanId}`}
                points={[startX, startY, endX, endY]}
                stroke="#2a2a2a"
                strokeWidth={2}
                dash={[10, 5]}
                opacity={0.6}
              />
            );
          })}

          {/* --- ELEMENTOS DINÂMICOS --- */}
          {Object.keys(clanTargets).map((clanId) => {
            const clan = clans.find((c) => c.id === clanId);
            const pos = clanTargets[clanId];
            if (!clan || !pos) return null;
            return (
              <ClanTarget
                key={clan.id}
                clanName={clan.name}
                x={pos.x}
                y={pos.y - HEADER_HEIGHT / 2}
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
                y: item.initial_pos.y - HEADER_HEIGHT / 2,
              }}
              isDraggable={false}
            />
          ))}

          {/* --- FEEDBACKS E ANIMAÇÕES --- */}
          {feedbackPulse && (
            <FeedbackPulse
              key={feedbackPulse.key}
              x={feedbackPulse.x}
              y={feedbackPulse.y - HEADER_HEIGHT / 2}
              color={feedbackPulse.color}
              onComplete={onPulseComplete}
            />
          )}
          {returningItem && (
            <ReturningItem
              itemData={returningItem.item}
              startPos={{
                x: returningItem.startPos.x,
                y: returningItem.startPos.y - HEADER_HEIGHT / 2,
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
