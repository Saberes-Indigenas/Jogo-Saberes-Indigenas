import React from "react";
import { Stage, Layer, Circle as KonvaCircle, Arc, Line } from "react-konva";
import type { Clan, Item, PulseState, ReturningItemState } from "../types";
import ClanTarget from "./ClanTarget";
import ItemBall from "./ItemBall";
import FeedbackPulse from "./FeedbackPulse";
import ReturningItem from "./ReturningItem";
import {
  GAME_AREA_WIDTH,
  GAME_AREA_HEIGHT,
  HEADER_HEIGHT,
  CENTRO_X,
  CENTRO_Y,
  RAIO_PALCO,
} from "../config/layoutConstants";

interface BororoStageProps {
  clans: Clan[];
  clanTargets: { [key: string]: { x: number; y: number } };
  stageItems: Item[];
  feedbackPulse: PulseState;
  returningItem: ReturningItemState;
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
  onDragOver,
  onDrop,
  onPulseComplete,
  onReturnAnimationComplete,
}: BororoStageProps) => {
  return (
    <main className="game-area" onDragOver={onDragOver} onDrop={onDrop}>
      <Stage width={GAME_AREA_WIDTH} height={GAME_AREA_HEIGHT - HEADER_HEIGHT}>
        <Layer>
          {/* --- CENÁRIO DE FUNDO --- */}
          <KonvaCircle
            x={CENTRO_X}
            y={CENTRO_Y - HEADER_HEIGHT / 2}
            radius={RAIO_PALCO}
            fillRadialGradientStartPoint={{ x: 0, y: 0 }}
            fillRadialGradientStartRadius={0}
            fillRadialGradientEndPoint={{ x: 0, y: 0 }}
            fillRadialGradientEndRadius={RAIO_PALCO}
            fillRadialGradientColorStops={[0, "#6e6d5a", 1, "#4a493a"]}
            stroke="#f5f5f5"
            strokeWidth={4}
            shadowColor="black"
            shadowBlur={20}
            shadowOpacity={0.5}
          />
          <Arc
            x={CENTRO_X}
            y={CENTRO_Y - HEADER_HEIGHT / 2}
            innerRadius={0}
            outerRadius={RAIO_PALCO}
            angle={180}
            fill="rgba(181, 35, 35, 0.2)"
            rotation={-90}
          />
          <Arc
            x={CENTRO_X}
            y={CENTRO_Y - HEADER_HEIGHT / 2}
            innerRadius={0}
            outerRadius={RAIO_PALCO}
            angle={180}
            fill="rgba(0, 0, 0, 0.2)"
            rotation={90}
          />
          <KonvaCircle
            x={CENTRO_X}
            y={CENTRO_Y - HEADER_HEIGHT / 2}
            radius={RAIO_PALCO * 0.25}
            stroke="#f5f5f5"
            strokeWidth={2}
            opacity={0.8}
          />
          <Line
            points={[
              CENTRO_X,
              CENTRO_Y - HEADER_HEIGHT / 2 - RAIO_PALCO,
              CENTRO_X,
              CENTRO_Y - HEADER_HEIGHT / 2 + RAIO_PALCO,
            ]}
            stroke="#f5f5f5"
            strokeWidth={2}
            opacity={0.8}
            dash={[10, 6]}
          />
          {Object.keys(clanTargets).map((clanId) => {
            const pos = clanTargets[clanId];
            const angle = Math.atan2(pos.y - CENTRO_Y, pos.x - CENTRO_X);
            const startX = CENTRO_X + RAIO_PALCO * 0.25 * Math.cos(angle);
            const startY =
              CENTRO_Y -
              HEADER_HEIGHT / 2 +
              RAIO_PALCO * 0.25 * Math.sin(angle);
            const endX = CENTRO_X + RAIO_PALCO * Math.cos(angle);
            const endY =
              CENTRO_Y - HEADER_HEIGHT / 2 + RAIO_PALCO * Math.sin(angle);
            return (
              <Line
                key={`line-${clanId}`}
                points={[startX, startY, endX, endY]}
                stroke="#f5f5f5"
                strokeWidth={1}
                opacity={0.5}
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

          {/* --- ANIMAÇÕES DE FEEDBACK --- */}
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
