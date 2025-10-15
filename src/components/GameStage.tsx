import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import type { Clan, Item } from "../types";
import { useGameLogic } from "../hooks/useGameLogic";
import type { EnteringOffering } from "../hooks/useGameLogic";
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
import HudPanel from "./HudPanel";

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

  // --- CÁLCULO DO CENTRO ABSOLUTO CORRIGIDO ---
  const backgroundCenter = useMemo(
    () => ({
      // A posição do centro do palco na TELA (eixo X)
      x: gameAreaRect.left + layout.centroX,
      // CORREÇÃO: A posição Y é simplesmente a metade da altura total do container.
      // O `centroY` do layout já lida com o offset do header internamente para o palco.
      y: gameAreaRect.top + gameAreaRect.height / 2,
    }),
    [gameAreaRect, layout.centroX] // Removida a dependência de layout.centroY
  );

  useEffect(() => {
    if (backgroundCenter.x && backgroundCenter.y) {
      const cxPercent = (backgroundCenter.x / window.innerWidth) * 100;
      const cyPercent = (backgroundCenter.y / window.innerHeight) * 100;

      document.documentElement.style.setProperty("--cx", `${cxPercent}%`);
      document.documentElement.style.setProperty("--cy", `${cyPercent}%`);
    }
  }, [backgroundCenter]);

  const {
    menuItems,
    enteringOfferings,
    clanTargets,
    isGameOver,
    currentRound,
    maxRounds,
    isMessageVisible,
    message,
    messageType,
    draggingItemId,
    feedbackPulse,
    returningItem,
    score,
    streak,
    maxStreak,
    featherCount,
    completedCount,
    totalItems,
    completedByColor,
    totalItemsByColor,
    spotlightItem,
    clearFeedbackPulse,
    onReturnAnimationComplete,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    clanInventories,
    recentDeliveries,
    registerOfferingArrival,
  } = useGameLogic(clans, initialItems, layout);

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

  const handleOfferingAnimationComplete = useCallback(
    (offering: EnteringOffering) => {
      registerOfferingArrival(offering.key, offering.clanId, offering.item);
    },
    [registerOfferingArrival]
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
        {/* Só renderizamos quando o centro foi calculado para evitar um "pulo" */}
        {layout.raioPalco > 0 && (
          <img
            src={chaoBororoFloresta}
            alt="" // Imagem puramente decorativa, alt vazio é apropriado
            className="chao-floresta-background"
            style={{
              width: chaoFlorestaSize,
              height: chaoFlorestaSize,
              // A mágica da centralização acontece aqui:
              // Pegamos o ponto central (backgroundCenter) e subtraímos metade
              // do tamanho da imagem para encontrar o ponto top-left correto.
              left: backgroundCenter.x,
              top: backgroundCenter.y,
              // 2. Usamos 'transform' para que o CSS mova a imagem para trás
              //    em 50% da sua própria largura e altura, centralizando-a perfeitamente.
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
            redCompleted={completedByColor.red}
            blackCompleted={completedByColor.black}
            redTotal={totalItemsByColor.red}
            blackTotal={totalItemsByColor.black}
            currentRound={currentRound}
            maxRounds={maxRounds}
            isOpen={isHudPanelOpen}
            onToggle={() => setIsHudPanelOpen((prev) => !prev)} // Função para abrir/fechar
            stageCenter={layout.raioPalco > 0 ? backgroundCenter : null}
          />
          <AnimatePresence>
            {isHudPanelOpen && (
              <HudPanel
                key="hud-panel" // Chave é importante para AnimatePresence
                score={score}
                streak={streak}
                maxStreak={maxStreak}
                feathers={featherCount}
                completed={completedCount}
                total={totalItems}
                redCompleted={completedByColor.red}
                blackCompleted={completedByColor.black}
                redTotal={totalItemsByColor.red}
                blackTotal={totalItemsByColor.black}
                currentRound={currentRound}
                maxRounds={maxRounds}
                onClose={() => setIsHudPanelOpen(false)} // Função para fechar
                stageCenter={layout.raioPalco > 0 ? backgroundCenter : null}
              />
            )}
          </AnimatePresence>

          {isGameReady && (
            <ItemTray
              items={menuItems}
              draggingItemId={draggingItemId}
              spotlightItem={spotlightItem}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          )}
        </div>
        <div className="game-area-wrapper" ref={gameAreaWrapperRef}>
          <BororoStage
            clans={clans}
            clanTargets={clanTargets}
            enteringOfferings={enteringOfferings}
            feedbackPulse={feedbackPulse}
            layout={layout}
            onDragOver={handleDragOver}
            onDrop={(e) => {
              if (gameAreaWrapperRef.current) {
                const stageRect =
                  gameAreaWrapperRef.current.getBoundingClientRect();
                handleDrop(e, stageRect);
              }
            }}
            onPulseComplete={clearFeedbackPulse}
            onOfferingComplete={handleOfferingAnimationComplete}
            clanInventories={clanInventories}
            recentDeliveries={recentDeliveries}
            onClanClick={handleClanClick}
            onReady={() => setStageReady(true)}
          />
        </div>
        <ReturningItemOverlay
          returningItem={returningItem}
          layout={layout}
          containerRect={gameAreaRect}
          onComplete={onReturnAnimationComplete}
        />
        <ClanInfoBubble
          activeBubble={activeBubble}
          containerRect={gameAreaRect}
          onClose={closeBubble}
        />

        <GameModals
          isGameOver={isGameOver}
          isMessageVisible={isMessageVisible}
          message={message}
          messageType={messageType}
          score={score}
          feathers={featherCount}
          maxStreak={maxStreak}
          completed={completedCount}
          total={totalItems}
          currentRound={currentRound}
          maxRounds={maxRounds}
        />
      </div>
    </div>
  );
};

export default GameStage;
