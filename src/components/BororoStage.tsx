/* Arquivo: src/components/BororoStage.tsx */

import React from "react";
import { Stage, Layer, Circle as KonvaCircle, Line, Group, RegularPolygon, Rect } from "react-konva";
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
  const clearingRadius = layout.raioPalco * 1.05;
  const pathStrokeWidth = Math.max(layout.raioPalco * 0.06, 12);
  const outerRingStroke = Math.max(layout.raioPalco * 0.05, 10);
  const innerRingStroke = Math.max(layout.raioPalco * 0.04, 8);
  const fireOuterRadius = Math.max(layout.raioPalco * 0.08, 22);
  const fireInnerRadius = Math.max(layout.raioPalco * 0.05, 12);
  const innerPathRadius = layout.raioPalco * 0.25;

  return (
    // Os eventos onDragOver e onDrop são aplicados aqui
    <main className="game-area" onDragOver={onDragOver} onDrop={onDrop}>
      <Stage
        width={layout.gameAreaWidth}
        // A altura do Stage considera o espaço real, descontando o Header
        height={layout.gameAreaHeight}
      >
        <Layer>
          {/* --- CLAREIRA DA ALDEIA --- */}
          <KonvaCircle
            x={layout.centroX}
            y={layout.centroY}
            radius={clearingRadius}
            fillLinearGradientStartPoint={{ x: -layout.raioPalco, y: -layout.raioPalco }}
            fillLinearGradientEndPoint={{ x: layout.raioPalco, y: layout.raioPalco }}
            fillLinearGradientColorStops={[0, "#fef3c7", 0.45, "#f6d48f", 1, "#e5a95c"]}
            stroke="#8d5524"
            strokeWidth={6}
            shadowColor="rgba(0,0,0,0.35)"
            shadowBlur={25}
            shadowOffsetY={12}
          />

          {/* --- CAMINHOS PRINCIPAIS --- */}
          {clanEntries.map(([clanId, pos]) => {
            const angle = Math.atan2(pos.y - layout.centroY, pos.x - layout.centroX);
            return (
              <Line
                key={`path-${clanId}`}
                points={[
                  layout.centroX + innerPathRadius * Math.cos(angle),
                  layout.centroY + innerPathRadius * Math.sin(angle),
                  layout.centroX + layout.raioPalco * 0.82 * Math.cos(angle),
                  layout.centroY + layout.raioPalco * 0.82 * Math.sin(angle),
                ]}
                stroke="#f4dba5"
                strokeWidth={pathStrokeWidth}
                lineCap="round"
                shadowColor="rgba(0,0,0,0.1)"
                shadowBlur={20}
              />
            );
          })}

          {/* --- ANEL DECORATIVO --- */}
          <KonvaCircle
            x={layout.centroX}
            y={layout.centroY}
            radius={layout.raioPalco * 0.82}
            stroke="#d39344"
            strokeWidth={outerRingStroke}
            dash={[20, 18]}
            dashEnabled
            opacity={0.7}
          />

          <KonvaCircle
            x={layout.centroX}
            y={layout.centroY}
            radius={layout.raioPalco * 0.32}
            stroke="#c67c2c"
            strokeWidth={innerRingStroke}
            fill="rgba(255, 240, 200, 0.7)"
          />

          <KonvaCircle
            x={layout.centroX}
            y={layout.centroY}
            radius={layout.raioPalco * 0.18}
            fillLinearGradientStartPoint={{ x: -40, y: -40 }}
            fillLinearGradientEndPoint={{ x: 40, y: 40 }}
            fillLinearGradientColorStops={[0, "#ffb347", 0.6, "#ff7f50", 1, "#d14900"]}
            shadowColor="rgba(0,0,0,0.3)"
            shadowBlur={20}
          />

          {/* --- FOGO CENTRAL --- */}
          <Group x={layout.centroX} y={layout.centroY}>
            <KonvaCircle
              radius={fireOuterRadius}
              fillLinearGradientStartPoint={{ x: 0, y: -40 }}
              fillLinearGradientEndPoint={{ x: 0, y: 40 }}
              fillLinearGradientColorStops={[0, "#ff9f1c", 0.7, "#ffbf69", 1, "#ffe66d"]}
            />
            <KonvaCircle
              radius={fireInnerRadius}
              fillLinearGradientStartPoint={{ x: 0, y: -30 }}
              fillLinearGradientEndPoint={{ x: 0, y: 30 }}
              fillLinearGradientColorStops={[0, "#ffecd1", 1, "#ff9f1c"]}
              opacity={0.9}
            />
          </Group>

          {/* --- HUTS DO CLÃ --- */}
          {clanEntries.map(([clanId, pos]) => {
            const clan = clans.find((c) => c.id === clanId);
            if (!clan) return null;
            const hutDistance = layout.raioPalco * 0.92;
            const angle = Math.atan2(pos.y - layout.centroY, pos.x - layout.centroX);
            const hutX = layout.centroX + hutDistance * Math.cos(angle);
            const hutY = layout.centroY + hutDistance * Math.sin(angle);
            const hutWidth = Math.max(layout.raioPalco * 0.14, 46);
            const hutBodyHeight = Math.max(layout.raioPalco * 0.18, 58);
            const rotation = (Math.atan2(layout.centroY - hutY, layout.centroX - hutX) * 180) / Math.PI - 90;
            return (
              <Group key={`hut-${clanId}`} x={hutX} y={hutY} rotation={rotation} offsetY={hutBodyHeight * 0.5}>
                <RegularPolygon
                  x={0}
                  y={-hutBodyHeight * 0.65}
                  sides={3}
                  radius={hutWidth * 0.9}
                  fillLinearGradientStartPoint={{ x: -hutWidth, y: -hutWidth }}
                  fillLinearGradientEndPoint={{ x: hutWidth, y: hutWidth }}
                  fillLinearGradientColorStops={[0, "#8d5524", 1, "#c68642"]}
                  shadowColor="rgba(0,0,0,0.25)"
                  shadowBlur={10}
                />
                <Rect
                  x={-hutWidth * 0.85}
                  y={-hutBodyHeight * 0.5}
                  width={hutWidth * 1.7}
                  height={hutBodyHeight}
                  fillLinearGradientStartPoint={{ x: -hutWidth, y: 0 }}
                  fillLinearGradientEndPoint={{ x: hutWidth, y: hutBodyHeight }}
                  fillLinearGradientColorStops={[0, "#d9a066", 1, "#a47138"]}
                  cornerRadius={hutWidth * 0.2}
                  shadowColor="rgba(0,0,0,0.2)"
                  shadowBlur={12}
                />
                <KonvaCircle
                  x={0}
                  y={hutBodyHeight * 0.1}
                  radius={hutWidth * 0.35}
                  fill="#4a2c1a"
                  shadowColor="rgba(0,0,0,0.3)"
                  shadowBlur={8}
                />
              </Group>
            );
          })}

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
