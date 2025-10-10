/* Arquivo: src/components/BororoStage.tsx */

import React from "react";
import {
  Stage,
  Layer,
  Circle as KonvaCircle,
  Line,
  Group,
  RegularPolygon,
  Rect,
  Ellipse,
  Ring,
} from "react-konva";
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
  const outerForestRadius = layout.raioPalco * 1.18;
  const pathStrokeWidth = Math.max(layout.raioPalco * 0.055, 12);
  const fireOuterRadius = Math.max(layout.raioPalco * 0.09, 24);
  const fireInnerRadius = Math.max(layout.raioPalco * 0.055, 14);
  const innerPathRadius = layout.raioPalco * 0.3;
  const logCount = 14;
  const logDistance = layout.raioPalco * 0.94;
  const logLength = Math.max(layout.raioPalco * 0.28, 78);
  const logThickness = Math.max(layout.raioPalco * 0.09, 26);
  const pebbleRadius = Math.max(layout.raioPalco * 0.022, 6);

  const floorDetails = [
    { angle: -22, distance: layout.raioPalco * 0.44, width: layout.raioPalco * 0.32, height: layout.raioPalco * 0.14, rotation: -28 },
    { angle: 48, distance: layout.raioPalco * 0.38, width: layout.raioPalco * 0.28, height: layout.raioPalco * 0.12, rotation: 18 },
    { angle: 110, distance: layout.raioPalco * 0.33, width: layout.raioPalco * 0.26, height: layout.raioPalco * 0.11, rotation: 32 },
    { angle: 175, distance: layout.raioPalco * 0.41, width: layout.raioPalco * 0.29, height: layout.raioPalco * 0.13, rotation: -12 },
    { angle: 230, distance: layout.raioPalco * 0.36, width: layout.raioPalco * 0.27, height: layout.raioPalco * 0.12, rotation: 26 },
    { angle: 290, distance: layout.raioPalco * 0.4, width: layout.raioPalco * 0.31, height: layout.raioPalco * 0.14, rotation: -18 },
    { angle: 330, distance: layout.raioPalco * 0.34, width: layout.raioPalco * 0.25, height: layout.raioPalco * 0.1, rotation: 8 },
  ];

  const pebbleAngles = [10, 55, 95, 140, 188, 230, 272, 315, 350];

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
            radius={outerForestRadius}
            fillRadialGradientStartPoint={{ x: 0, y: 0 }}
            fillRadialGradientStartRadius={outerForestRadius * 0.25}
            fillRadialGradientEndPoint={{ x: 0, y: 0 }}
            fillRadialGradientEndRadius={outerForestRadius}
            fillRadialGradientColorStops={[0, "#4a8445", 0.6, "#2f5d30", 1, "#1f3820"]}
            shadowColor="rgba(0,0,0,0.45)"
            shadowBlur={48}
            shadowOffsetY={28}
            opacity={0.95}
          />

          <KonvaCircle
            x={layout.centroX}
            y={layout.centroY}
            radius={clearingRadius}
            fillLinearGradientStartPoint={{ x: -layout.raioPalco, y: -layout.raioPalco * 0.8 }}
            fillLinearGradientEndPoint={{ x: layout.raioPalco, y: layout.raioPalco * 0.8 }}
            fillLinearGradientColorStops={[0, "#e8c489", 0.45, "#f3d8a7", 1, "#d9a86a"]}
            stroke="rgba(112, 63, 20, 0.45)"
            strokeWidth={Math.max(layout.raioPalco * 0.025, 6)}
            shadowColor="rgba(0,0,0,0.35)"
            shadowBlur={32}
            shadowOffsetY={18}
          />

          <Ring
            x={layout.centroX}
            y={layout.centroY}
            innerRadius={layout.raioPalco * 0.75}
            outerRadius={layout.raioPalco * 0.83}
            fillLinearGradientStartPoint={{ x: -layout.raioPalco * 0.8, y: -layout.raioPalco * 0.4 }}
            fillLinearGradientEndPoint={{ x: layout.raioPalco * 0.8, y: layout.raioPalco * 0.4 }}
            fillLinearGradientColorStops={[0, "#b87a3a", 0.5, "#dba86b", 1, "#a5672f"]}
            opacity={0.9}
            shadowColor="rgba(0,0,0,0.2)"
            shadowBlur={18}
          />

          <KonvaCircle
            x={layout.centroX}
            y={layout.centroY}
            radius={layout.raioPalco * 0.62}
            fillLinearGradientStartPoint={{ x: -layout.raioPalco * 0.5, y: -layout.raioPalco * 0.4 }}
            fillLinearGradientEndPoint={{ x: layout.raioPalco * 0.5, y: layout.raioPalco * 0.4 }}
            fillLinearGradientColorStops={[0, "#f6e2bc", 0.55, "#f7d49a", 1, "#edc077"]}
            opacity={0.96}
          />

          <KonvaCircle
            x={layout.centroX}
            y={layout.centroY}
            radius={layout.raioPalco * 0.32}
            fillLinearGradientStartPoint={{ x: -layout.raioPalco * 0.2, y: -layout.raioPalco * 0.2 }}
            fillLinearGradientEndPoint={{ x: layout.raioPalco * 0.2, y: layout.raioPalco * 0.2 }}
            fillLinearGradientColorStops={[0, "#fbe8c8", 1, "#f3d09a"]}
            shadowColor="rgba(0,0,0,0.15)"
            shadowBlur={16}
          />

          {/* --- TEXTURAS DO CHÃO --- */}
          {floorDetails.map((detail, index) => {
            const angleRad = (detail.angle * Math.PI) / 180;
            const x = layout.centroX + Math.cos(angleRad) * detail.distance;
            const y = layout.centroY + Math.sin(angleRad) * detail.distance;
            return (
              <Group key={`detail-${index}`} x={x} y={y} rotation={detail.rotation} opacity={0.65}>
                <Ellipse
                  x={0}
                  y={0}
                  radiusX={detail.width / 2}
                  radiusY={detail.height / 2}
                  fillLinearGradientStartPoint={{ x: -detail.width / 2, y: 0 }}
                  fillLinearGradientEndPoint={{ x: detail.width / 2, y: detail.height / 2 }}
                  fillLinearGradientColorStops={[0, "#f0c98b", 1, "#d59c54"]}
                  shadowColor="rgba(0,0,0,0.2)"
                  shadowBlur={12}
                />
                <Ellipse
                  x={detail.width * 0.08}
                  y={-detail.height * 0.08}
                  radiusX={detail.width / 3}
                  radiusY={detail.height / 3}
                  fillLinearGradientStartPoint={{ x: -detail.width / 3, y: 0 }}
                  fillLinearGradientEndPoint={{ x: detail.width / 3, y: detail.height / 3 }}
                  fillLinearGradientColorStops={[0, "#ffe8c7", 1, "#f2c37c"]}
                  opacity={0.8}
                />
              </Group>
            );
          })}

          {pebbleAngles.map((angle, index) => {
            const angleRad = (angle * Math.PI) / 180;
            const distance = layout.raioPalco * 0.24 + (index % 3) * layout.raioPalco * 0.04;
            const x = layout.centroX + Math.cos(angleRad) * distance;
            const y = layout.centroY + Math.sin(angleRad) * distance;
            return (
              <KonvaCircle
                key={`pebble-${angle}-${index}`}
                x={x}
                y={y}
                radius={pebbleRadius * (1 + (index % 2) * 0.2)}
                fillLinearGradientStartPoint={{ x: -pebbleRadius, y: -pebbleRadius }}
                fillLinearGradientEndPoint={{ x: pebbleRadius, y: pebbleRadius }}
                fillLinearGradientColorStops={[0, "#d3ab6d", 0.6, "#b98545", 1, "#9f7034"]}
                shadowColor="rgba(0,0,0,0.25)"
                shadowBlur={8}
              />
            );
          })}

          {/* --- CAMINHOS PRINCIPAIS --- */}
          {clanEntries.map(([clanId, pos]) => {
            const angle = Math.atan2(pos.y - layout.centroY, pos.x - layout.centroX);
            const startX = layout.centroX + innerPathRadius * Math.cos(angle);
            const startY = layout.centroY + innerPathRadius * Math.sin(angle);
            const endX = layout.centroX + layout.raioPalco * 0.8 * Math.cos(angle);
            const endY = layout.centroY + layout.raioPalco * 0.8 * Math.sin(angle);
            const stoneStart = innerPathRadius + layout.raioPalco * 0.08;
            const stoneEnd = layout.raioPalco * 0.76;
            const stoneSteps = 3;

            return (
              <Group key={`path-${clanId}`}>
                <Line
                  points={[startX, startY, endX, endY]}
                  strokeLinearGradientStartPoint={{ x: startX, y: startY }}
                  strokeLinearGradientEndPoint={{ x: endX, y: endY }}
                  strokeLinearGradientColorStops={[0, "#b57732", 0.5, "#e7bf7c", 1, "#a35f21"]}
                  strokeWidth={pathStrokeWidth}
                  lineCap="round"
                  shadowColor="rgba(0,0,0,0.2)"
                  shadowBlur={22}
                />
                {Array.from({ length: stoneSteps }).map((_, idx) => {
                  const t = (idx + 1) / (stoneSteps + 1);
                  const radius = stoneStart + (stoneEnd - stoneStart) * t;
                  const stoneX = layout.centroX + radius * Math.cos(angle);
                  const stoneY = layout.centroY + radius * Math.sin(angle);
                  return (
                    <Ellipse
                      key={`stone-${clanId}-${idx}`}
                      x={stoneX}
                      y={stoneY}
                      radiusX={Math.max(layout.raioPalco * 0.07, 18)}
                      radiusY={Math.max(layout.raioPalco * 0.04, 12)}
                      fillLinearGradientStartPoint={{ x: -layout.raioPalco * 0.05, y: 0 }}
                      fillLinearGradientEndPoint={{ x: layout.raioPalco * 0.05, y: layout.raioPalco * 0.05 }}
                      fillLinearGradientColorStops={[0, "#f8e0b6", 1, "#d8ae6a"]}
                      shadowColor="rgba(0,0,0,0.2)"
                      shadowBlur={16}
                      opacity={0.9}
                    />
                  );
                })}
              </Group>
            );
          })}

          {/* --- TRONCOS PROTETORES DA ALDEIA --- */}
          {Array.from({ length: logCount }).map((_, index) => {
            const angle = (index / logCount) * Math.PI * 2;
            const logX = layout.centroX + Math.cos(angle) * logDistance;
            const logY = layout.centroY + Math.sin(angle) * logDistance;
            const rotation = (angle * 180) / Math.PI + 90;

            return (
              <Group key={`log-${index}`} x={logX} y={logY} rotation={rotation} opacity={0.92}>
                <Rect
                  x={-logLength / 2}
                  y={-logThickness / 2}
                  width={logLength}
                  height={logThickness}
                  cornerRadius={logThickness / 2}
                  fillLinearGradientStartPoint={{ x: -logLength / 2, y: 0 }}
                  fillLinearGradientEndPoint={{ x: logLength / 2, y: logThickness / 2 }}
                  fillLinearGradientColorStops={[0, "#7a4a21", 0.5, "#9c6632", 1, "#5a3415"]}
                  shadowColor="rgba(0,0,0,0.3)"
                  shadowBlur={16}
                />
                <KonvaCircle
                  x={-logLength / 2}
                  y={0}
                  radius={logThickness / 2}
                  fillLinearGradientStartPoint={{ x: -logThickness / 2, y: 0 }}
                  fillLinearGradientEndPoint={{ x: logThickness / 2, y: logThickness / 2 }}
                  fillLinearGradientColorStops={[0, "#b67a44", 1, "#8d5628"]}
                />
                <KonvaCircle
                  x={logLength / 2}
                  y={0}
                  radius={logThickness / 2}
                  fillLinearGradientStartPoint={{ x: -logThickness / 2, y: 0 }}
                  fillLinearGradientEndPoint={{ x: logThickness / 2, y: logThickness / 2 }}
                  fillLinearGradientColorStops={[0, "#b67a44", 1, "#8d5628"]}
                />
              </Group>
            );
          })}

          {/* --- FOGO CENTRAL --- */}
          <Group x={layout.centroX} y={layout.centroY}>
            <RegularPolygon
              sides={6}
              radius={fireOuterRadius * 1.6}
              rotation={30}
              fillLinearGradientStartPoint={{ x: -fireOuterRadius, y: -fireOuterRadius }}
              fillLinearGradientEndPoint={{ x: fireOuterRadius, y: fireOuterRadius }}
              fillLinearGradientColorStops={[0, "#8c4e24", 1, "#4f2f12"]}
              opacity={0.85}
              shadowColor="rgba(0,0,0,0.25)"
              shadowBlur={18}
            />
            <RegularPolygon
              sides={4}
              radius={fireOuterRadius * 1.05}
              rotation={45}
              fillLinearGradientStartPoint={{ x: -fireOuterRadius, y: -fireOuterRadius }}
              fillLinearGradientEndPoint={{ x: fireOuterRadius, y: fireOuterRadius }}
              fillLinearGradientColorStops={[0, "#a05f2c", 1, "#6b3715"]}
              opacity={0.8}
            />
            <KonvaCircle
              radius={fireOuterRadius}
              fillLinearGradientStartPoint={{ x: 0, y: -fireOuterRadius }}
              fillLinearGradientEndPoint={{ x: 0, y: fireOuterRadius }}
              fillLinearGradientColorStops={[0, "#ffac33", 0.6, "#ffcc66", 1, "#ff9330"]}
              shadowColor="rgba(255,176,0,0.45)"
              shadowBlur={30}
              shadowOpacity={0.8}
            />
            <KonvaCircle
              radius={fireInnerRadius}
              fillLinearGradientStartPoint={{ x: 0, y: -fireInnerRadius }}
              fillLinearGradientEndPoint={{ x: 0, y: fireInnerRadius }}
              fillLinearGradientColorStops={[0, "#fff2cc", 1, "#ffac33"]}
              opacity={0.95}
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
