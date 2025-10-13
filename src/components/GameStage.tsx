/* Arquivo: src/components/GameStage.tsx */

import { useState, useMemo, useEffect, useRef } from "react";
import type { Clan, Item } from "../types";
import { useGameLogic } from "../hooks/useGameLogic";
import type { EnteringOffering } from "../hooks/useGameLogic";
import ItemTray from "./ItemTray";
import BororoStage from "./BororoStage";
import GameModals from "./GameModals";
import "../css/GameStage.css";
import ForestBackground from "./ForestBackground";
import GameHud from "./GameHud";
import LearningCard from "./LearningCard";
import RewardCelebration from "./RewardCelebration";
import ClanInfoBubble from "./ClanInfoBubble";
import ReturningItemOverlay from "./ReturningItemOverlay";
import LoadingScreen from "./LoadingScreen";
import { useGameAssetPreloader } from "../hooks/useGameAssetPreloader";

import chaoBororoFloresta from "../assets/chãoBororoFloresta.svg";

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

  useEffect(() => {
    const measureGameArea = () => {
      if (gameAreaWrapperRef.current) {
        const rect = gameAreaWrapperRef.current.getBoundingClientRect();
        setGameAreaRect({
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left,
        });
      }
    };
    measureGameArea();
    window.addEventListener("resize", measureGameArea);
    return () => window.removeEventListener("resize", measureGameArea);
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
    spotlightItem,
    celebration,
    clearFeedbackPulse,
    clearCelebration,
    onReturnAnimationComplete,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    clanInventories,
    recentDeliveries,
    registerOfferingArrival,
  } = useGameLogic(clans, initialItems, layout);

  const { isReady: areAssetsReady, progress: assetProgress } =
    useGameAssetPreloader();
  const [shouldRenderScene, setShouldRenderScene] = useState(false);
  const [isStageReady, setStageReady] = useState(false);
  const [isForestReady, setForestReady] = useState(false);
  const isGameReady = shouldRenderScene && isStageReady && isForestReady;
  const shouldShowLoader = !areAssetsReady || !isGameReady;
  const loaderLabel = areAssetsReady
    ? "Preparando a aldeia..."
    : "Carregando a aldeia...";

  useEffect(() => {
    if (!areAssetsReady) {
      setShouldRenderScene(false);
      return;
    }

    const frame = requestAnimationFrame(() => {
      setShouldRenderScene(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [areAssetsReady]);

  useEffect(() => {
    if (shouldRenderScene) {
      return;
    }
    setStageReady(false);
    setForestReady(false);
  }, [shouldRenderScene]);

  const [activeBubble, setActiveBubble] = useState<{
    clan: Clan;
    items: Item[];
    anchor: { x: number; y: number };
    orientation: { vertical: "above" | "below"; horizontal: "left" | "right" };
  } | null>(null);

  const closeBubble = () => setActiveBubble(null);

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

  const handleClanClick = (clanId: string) => {
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
  };

  const handleOfferingAnimationComplete = (offering: EnteringOffering) => {
    registerOfferingArrival(offering.key, offering.clanId, offering.item);
  };
  const chaoFlorestaSize = layout.raioPalco * 5;
  return (
    <div className="game-container" aria-busy={shouldShowLoader}>
      {shouldShowLoader && (
        <div className="game-loading-overlay">
          <LoadingScreen label={loaderLabel} progress={assetProgress} />
        </div>
      )}
      <div
        className={`game-content${isGameReady ? " game-content--visible" : ""}`}
        aria-hidden={!isGameReady}
      >
        {/* Só renderizamos quando o centro foi calculado para evitar um "pulo" */}
        {shouldRenderScene && layout.raioPalco > 0 && (
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
          {shouldRenderScene && (
            <ForestBackground
              stageCenter={backgroundCenter}
              stageRadius={layout.raioPalco}
              width={window.innerWidth}
              height={window.innerHeight}
              onReady={() => setForestReady(true)}
            />
          )}

          {isGameReady && (
            <ItemTray
              items={menuItems}
              draggingItemId={draggingItemId}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          )}
        </div>
        <div className="game-area-wrapper" ref={gameAreaWrapperRef}>
          {shouldRenderScene && (
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
          )}
        </div>
        {shouldRenderScene && (
          <ReturningItemOverlay
            returningItem={returningItem}
            layout={layout}
            containerRect={gameAreaRect}
            onComplete={onReturnAnimationComplete}
          />
        )}
        {shouldRenderScene && (
          <ClanInfoBubble
            activeBubble={activeBubble}
            containerRect={gameAreaRect}
            onClose={closeBubble}
          />
        )}
        <GameHud
          score={score}
          streak={streak}
          maxStreak={maxStreak}
          feathers={featherCount}
          completed={completedCount}
          total={totalItems}
        />
        <LearningCard
          item={spotlightItem}
          streak={streak}
          feathers={featherCount}
        />
        <RewardCelebration
          celebration={celebration}
          onDismiss={clearCelebration}
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
        />
      </div>
    </div>
  );
};

export default GameStage;
