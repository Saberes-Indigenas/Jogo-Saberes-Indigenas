import { memo } from "react";
import type { DragEvent } from "react";
import { AnimatePresence } from "framer-motion";
import type { Item } from "../../types";
import ForestBackground from "../ForestBackground";
import GameHud from "../GameHud";
import HudPanel from "../HudPanel";
import ItemTray from "../ItemTray";
import "./HudLayer.css";

interface HudProgressSnapshot {
  redCompleted: number;
  blackCompleted: number;
  redTotal: number;
  blackTotal: number;
  currentRound: number;
  maxRounds: number;
}

interface HudStatsSnapshot {
  score: number;
  streak: number;
  maxStreak: number;
  feathers: number;
  completed: number;
  total: number;
}

interface ItemTraySnapshot {
  items: Item[];
  draggingItemId: string | null;
  spotlightItem: Item | null;
  onDragStart: (e: DragEvent, item: Item, rect: DOMRect) => void;
  onDragEnd: () => void;
}

interface HudLayerProps {
  stageCenter: { x: number; y: number } | null;
  stageRadius: number;
  isGameReady: boolean;
  isHudPanelOpen: boolean;
  onToggleHudPanel: () => void;
  onCloseHudPanel: () => void;
  onForestReady: () => void;
  progress: HudProgressSnapshot;
  hudStats: HudStatsSnapshot;
  itemTray: ItemTraySnapshot;
}

const HudLayer = ({
  stageCenter,
  stageRadius,
  isGameReady,
  isHudPanelOpen,
  onToggleHudPanel,
  onCloseHudPanel,
  onForestReady,
  progress,
  hudStats,
  itemTray,
}: HudLayerProps) => {
  const viewportWidth = typeof window === "undefined" ? 0 : window.innerWidth;
  const viewportHeight =
    typeof window === "undefined" ? 0 : window.innerHeight;

  const safeStageCenter = stageCenter ?? { x: 0, y: 0 };

  return (
    <div className="hud-layer">
      <ForestBackground
        stageCenter={safeStageCenter}
        stageRadius={stageRadius}
        width={viewportWidth}
        height={viewportHeight}
        onReady={onForestReady}
      />
      <GameHud
        redCompleted={progress.redCompleted}
        blackCompleted={progress.blackCompleted}
        redTotal={progress.redTotal}
        blackTotal={progress.blackTotal}
        currentRound={progress.currentRound}
        maxRounds={progress.maxRounds}
        isOpen={isHudPanelOpen}
        onToggle={onToggleHudPanel}
        stageCenter={stageCenter}
      />
      <AnimatePresence>
        {isHudPanelOpen && (
          <HudPanel
            key="hud-panel"
            score={hudStats.score}
            streak={hudStats.streak}
            maxStreak={hudStats.maxStreak}
            feathers={hudStats.feathers}
            completed={hudStats.completed}
            total={hudStats.total}
            redCompleted={progress.redCompleted}
            blackCompleted={progress.blackCompleted}
            redTotal={progress.redTotal}
            blackTotal={progress.blackTotal}
            currentRound={progress.currentRound}
            maxRounds={progress.maxRounds}
            onClose={onCloseHudPanel}
            stageCenter={stageCenter}
          />
        )}
      </AnimatePresence>
      {isGameReady && (
        <ItemTray
          items={itemTray.items}
          draggingItemId={itemTray.draggingItemId}
          spotlightItem={itemTray.spotlightItem}
          onDragStart={itemTray.onDragStart}
          onDragEnd={itemTray.onDragEnd}
        />
      )}
    </div>
  );
};

export default memo(HudLayer);
