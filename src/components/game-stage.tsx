import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import type { Clan, Item } from "../types";
import { useGameLogic } from "../hooks/useGameLogic";
import { useGameStore } from "../store/useGameStore";
import { useElementRect } from "../hooks/use-element-rect";
import { ItemTray } from "./item-tray";
import { BororoStage } from "./bororo-stage";
import { GameModals } from "./game-modals";
import { ForestBackground } from "./forest-background";
import { GameHud } from "./game-hud";
import { ClanInfoBubble } from "./clan-info-bubble";
import { ReturningItemDom } from "./returning-item-dom";
import { LoadingScreen } from "./loading-screen";
import { HudPanel } from "./hud-panel/hud-panel";
import { EnteringOfferingDom } from "./entering-offering-dom";
import { CustomDragLayer } from "./custom-drag-layer";

import chaoBororoFloresta from "../assets/chãoBororoFloresta.svg";
import "../css/GameStage.css";

interface GameStageProps {
  clans: Clan[];
  initialItems: Item[];
}

export function GameStage({ clans, initialItems }: GameStageProps) {
  const gameAreaWrapperRef = useRef<HTMLDivElement>(null);
  const gameAreaRect = useElementRect(gameAreaWrapperRef);

  const layout = useMemo(() => {
    const gameAreaWidth = gameAreaRect.width;
    const gameAreaHeight = gameAreaRect.height;
    const centroX = gameAreaWidth * 0.62;
    const centroY = gameAreaHeight / 2;
    const raioPalco = Math.min(gameAreaWidth, gameAreaHeight) * 0.45;
    return { gameAreaWidth, gameAreaHeight, centroX, centroY, raioPalco };
  }, [gameAreaRect]);

  const backgroundCenter = useMemo(
    () => ({
      x: gameAreaRect.left + layout.centroX,
      y: gameAreaRect.top + gameAreaRect.height / 2,
    }),
    [gameAreaRect, layout.centroX]
  );

  useEffect(() => {
    if (backgroundCenter.x && backgroundCenter.y) {
      const cxPercent = (backgroundCenter.x / window.innerWidth) * 100;
      const cyPercent = (backgroundCenter.y / window.innerHeight) * 100;

      document.documentElement.style.setProperty("--cx", `${cxPercent}%`);
      document.documentElement.style.setProperty("--cy", `${cyPercent}%`);
    }
  }, [backgroundCenter]);

  // Inicializa o game logic apenas atuando como vinculador
  useGameLogic(clans, initialItems, layout);

  const clanInventories = useGameStore((state) => state.clanInventories);
  const clanTargets = useGameStore((state) => state.clanTargets);
  const returningItem = useGameStore((state) => state.returningItem);
  const isGameOver = useGameStore((state) => state.isGameOver);
  const isMessageVisible = useGameStore((state) => state.isMessageVisible);
  const enteringOfferings = useGameStore((state) => state.enteringOfferings);
  const celebration = useGameStore((state) => state.celebration);

  const [isStageReady, setStageReady] = useState(false);
  const [isForestReady, setForestReady] = useState(false);
  const [isHudPanelOpen, setIsHudPanelOpen] = useState(false);
  const isGameReady = isStageReady && isForestReady;

  const [activeBubble, setActiveBubble] = useState<{
    clan: Clan;
    items: Item[];
    anchor: { x: number; y: number };
    orientation: { vertical: "above" | "below"; horizontal: "left" | "right" };
  } | null>(null);

  const closeBubble = useCallback(() => setActiveBubble(null), []);

  const handleDragOver = useGameStore((s) => s.handleDragOver);
  const handleDrop = useGameStore((s) => s.handleDrop);

  const handleStageDrop = useCallback((e: React.DragEvent) => {
    if (gameAreaWrapperRef.current) {
      const stageRect = gameAreaWrapperRef.current.getBoundingClientRect();
      handleDrop(e, stageRect);
    }
  }, [handleDrop]);

  useEffect(() => {
    if (!activeBubble) return;
    const storedItems = clanInventories.get(activeBubble.clan.id) || [];
    if (storedItems.length === 0) {
      setActiveBubble(null);
    } else if (storedItems.length !== activeBubble.items.length) {
      setActiveBubble((prev) =>
        prev
          ? {
              ...prev,
              items: storedItems,
            }
          : null
      );
    }
  }, [activeBubble, clanInventories]);

  const handleClanClick = useCallback(
    (clanId: string) => {
      const storedItems = clanInventories.get(clanId) || [];
      if (storedItems.length === 0) {
        setActiveBubble(null);
        return;
      }

      const clan = clans.find((c) => c.id === clanId);
      const anchor = clanTargets[clanId];
      if (!clan || !anchor) return;

      setActiveBubble((prev) => {
        if (prev?.clan.id === clanId) {
          return null;
        }

        const vertical = anchor.y < layout.centroY ? "below" : "above";
        const horizontal = anchor.x < layout.centroX ? "right" : "left";

        return {
          clan,
          items: storedItems,
          anchor,
          orientation: { vertical, horizontal },
        };
      });
    },
    [clanInventories, clans, clanTargets, layout.centroX, layout.centroY]
  );

  const chaoFlorestaSize = layout.raioPalco * 5;

  return (
    <div className="game-container" aria-busy={!isGameReady}>
      {!isGameReady && (
        <div className="game-loading-overlay">
          <LoadingScreen />
        </div>
      )}
      <div
        className={`game-content${isGameReady ? " game-content--visible" : ""}`}
        aria-hidden={!isGameReady}
        onDragOver={handleDragOver}
        onDrop={handleStageDrop}
      >
        {layout.raioPalco > 0 && (
          <img
            src={chaoBororoFloresta}
            alt=""
            className="chao-floresta-background"
            style={{
              width: chaoFlorestaSize,
              height: chaoFlorestaSize,
              left: backgroundCenter.x,
              top: backgroundCenter.y,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
        <div className="fg-overlay">
          <ForestBackground
            stageCenter={backgroundCenter}
            stageRadius={layout.raioPalco}
            width={window.innerWidth}
            height={window.innerHeight}
            onReady={() => setForestReady(true)}
          />
          <GameHud
            isOpen={isHudPanelOpen}
            onToggle={() => setIsHudPanelOpen((prev) => !prev)}
            stageCenter={layout.raioPalco > 0 ? backgroundCenter : null}
          />
          <AnimatePresence>
            {isHudPanelOpen && (
              <HudPanel
                key="hud-panel"
                onClose={() => setIsHudPanelOpen(false)}
                stageCenter={layout.raioPalco > 0 ? backgroundCenter : null}
              />
            )}
          </AnimatePresence>

          {isGameReady && <ItemTray />}
        </div>
        <div className="game-area-wrapper" ref={gameAreaWrapperRef}>
          <BororoStage
            onClanClick={handleClanClick}
            onReady={() => setStageReady(true)}
            gameAreaWrapperRef={gameAreaWrapperRef}
          />
        </div>

        {returningItem && (
          <ReturningItemDom
            returningItem={returningItem}
            onComplete={() => useGameStore.getState().onReturnAnimationComplete()}
          />
        )}

        <ClanInfoBubble
          activeBubble={activeBubble}
          containerRect={gameAreaRect}
          onClose={closeBubble}
        />

        {(isGameOver || isMessageVisible || celebration) && <GameModals />}
        {enteringOfferings.map((offering) => (
          <EnteringOfferingDom
            key={offering.key}
            offering={offering}
            onComplete={(off) =>
              useGameStore.getState().registerOfferingArrival(off.key, off.clanId, off.item)
            }
          />
        ))}
      </div>
      <CustomDragLayer />
    </div>
  );
}
