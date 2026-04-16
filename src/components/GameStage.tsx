import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import type { Clan, Item } from "../types";
import { useGameLogic } from "../hooks/useGameLogic";
import { useGameStore } from "../store/useGameStore";
import ItemTray from "./ItemTray";
import BororoStage from "./BororoStage";
import GameModals from "./GameModals";
import "../css/GameStage.css";
import ForestBackground from "./ForestBackground";
import GameHud from "./GameHud";
import ClanInfoBubble from "./ClanInfoBubble";
import ReturningItemOverlay from "./ReturningItemOverlay";
import LoadingScreen from "./LoadingScreen";

import chaoBororoFloresta from "../assets/chãoBororoFloresta.svg";
import { AnimatePresence } from "framer-motion";
import HudPanel from "./hud-panel/HudPanel";

interface GameStageProps {
  clans: Clan[];
  initialItems: Item[];
}

const GameStage = ({ clans, initialItems }: GameStageProps) => {
  const [gameAreaRect, setGameAreaRect] = useState({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  });
  const gameAreaWrapperRef = useRef<HTMLDivElement>(null);
  const latestRectRef = useRef(gameAreaRect);

  useEffect(() => {
    const element = gameAreaWrapperRef.current;
    if (!element) {
      return;
    }

    let rafId: number | null = null;

    const updateRect = () => {
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const nextRect = {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
      };

      const prevRect = latestRectRef.current;
      const hasChanged =
        prevRect.width !== nextRect.width ||
        prevRect.height !== nextRect.height ||
        prevRect.top !== nextRect.top ||
        prevRect.left !== nextRect.left;

      if (hasChanged) {
        latestRectRef.current = nextRect;
        setGameAreaRect(nextRect);
      }
    };

    const scheduleUpdate = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(updateRect);
    };

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(element);
    window.addEventListener("scroll", scheduleUpdate, true);
    scheduleUpdate();

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate, true);
    };
  }, []);

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

          {isGameReady && (
            <ItemTray />
          )}
        </div>
        <div className="game-area-wrapper" ref={gameAreaWrapperRef}>
          <BororoStage
            onClanClick={handleClanClick}
            onReady={() => setStageReady(true)}
            gameAreaWrapperRef={gameAreaWrapperRef}
          />
        </div>
        
        {returningItem && (
          <ReturningItemOverlay
            returningItem={returningItem}
            layout={layout}
            containerRect={gameAreaRect}
            onComplete={() => useGameStore.getState().onReturnAnimationComplete()}
          />
        )}
        
        <ClanInfoBubble
          activeBubble={activeBubble}
          containerRect={gameAreaRect}
          onClose={closeBubble}
        />

        {(isGameOver || isMessageVisible || celebration) && (
          <GameModals />
        )}
      </div>
    </div>
  );
};

export default GameStage;
