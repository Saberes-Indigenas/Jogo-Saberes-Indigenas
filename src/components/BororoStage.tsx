/* Arquivo: src/components/BororoStage.tsx */

import React from "react";
import { Stage, Layer, Circle as KonvaCircle, Arc, Line } from "react-konva";
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
  return (
    // Os eventos onDragOver e onDrop são aplicados aqui
    <main className="game-area" onDragOver={onDragOver} onDrop={onDrop}>
      <Stage
        width={layout.gameAreaWidth}
        // A altura do Stage considera o espaço real, descontando o Header
        height={layout.gameAreaHeight}
      >
        <Layer>
          {/* --- FUNDO DO PALCO (cartoon com borda grossa) --- */}
          {/* CORREÇÃO: O 'y' agora usa diretamente layout.centroY, sem subtrações */}
          <KonvaCircle
            x={layout.centroX}
            y={layout.centroY}
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
            strokeWidth={6}
            shadowColor="#000"
            shadowBlur={15}
            shadowOpacity={0.4}
          />

          {/* --- METADE VERMELHA E PRETA --- */}
          {/* CORREÇÃO: O 'y' agora usa diretamente layout.centroY */}
          <Arc
            x={layout.centroX}
            y={layout.centroY}
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
            y={layout.centroY}
            innerRadius={0}
            outerRadius={layout.raioPalco}
            angle={180}
            fill="rgba(40, 40, 40, 0.3)"
            rotation={90}
            stroke="#2a2a2a"
            strokeWidth={3}
          />

          {/* --- CÍRCULO INTERNO --- */}
          {/* CORREÇÃO: O 'y' agora usa diretamente layout.centroY */}
          <KonvaCircle
            x={layout.centroX}
            y={layout.centroY}
            radius={layout.raioPalco * 0.25}
            stroke="#2a2a2a"
            strokeWidth={4}
            fill="rgba(255,255,255,0.05)"
            shadowColor="#fff"
            shadowBlur={10}
            dash={[12, 6]}
          />

          {/* --- LINHA CENTRAL --- */}
          <Line
            points={[
              layout.centroX,
              layout.centroY - layout.raioPalco,
              layout.centroX,
              layout.centroY + layout.raioPalco,
            ]}
            stroke="#2a2a2a"
            strokeWidth={3}
            dash={[15, 8]}
            opacity={0.9}
          />

          {/* --- RAIOS PARA OS CLÃS --- */}
          {Object.keys(clanTargets).map((clanId) => {
            const pos = clanTargets[clanId];
            const angle = Math.atan2(
              pos.y - layout.centroY,
              pos.x - layout.centroX
            );
            const startX =
              layout.centroX + layout.raioPalco * 0.25 * Math.cos(angle);
            const startY =
              layout.centroY + layout.raioPalco * 0.25 * Math.sin(angle);
            const endX = layout.centroX + layout.raioPalco * Math.cos(angle);
            const endY = layout.centroY + layout.raioPalco * Math.sin(angle);

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
                // CORREÇÃO: O 'y' já vem correto do hook, não precisa de ajuste
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
