import {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import type { DragEvent } from "react";
import type { Clan, Item } from "../../types";
import { useGameLogic } from "../../hooks/useGameLogic";
import type { EnteringOffering } from "../../hooks/useGameLogic";
import { useElementRect } from "../../hooks/useElementRect";
import BororoStage from "../BororoStage";
import ClanInfoBubble from "../ClanInfoBubble";
import GameModals from "../GameModals";
import ReturningItemOverlay from "../ReturningItemOverlay";
import GameFloor from "./GameFloor";
import GameLoadingOverlay from "./GameLoadingOverlay";
import HudLayer from "./HudLayer";
import chaoBororoFloresta from "../../assets/chãoBororoFloresta.svg";
import "./GameStage.css";

type BubbleOrientation = {
  vertical: "above" | "below";
  horizontal: "left" | "right";
};

interface GameStageProps {
  clans: Clan[];
  initialItems: Item[];
}

const GameStage = ({ clans, initialItems }: GameStageProps) => {
  const { rect: gameAreaRect, ref: measureGameArea } =
    useElementRect<HTMLDivElement>();
  const gameAreaWrapperRef = useRef<HTMLDivElement | null>(null);
  const setGameAreaWrapperRef = useCallback(
    (node: HTMLDivElement | null) => {
      gameAreaWrapperRef.current = node;
      measureGameArea(node);
    },
    [measureGameArea]
  );

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
    resetClanAnimationsKey,
  } = useGameLogic(clans, initialItems, layout);

  const [isStageReady, setStageReady] = useState(false);
  const [isForestReady, setForestReady] = useState(false);
  const [isHudPanelOpen, setIsHudPanelOpen] = useState(false);
  const isGameReady = isStageReady && isForestReady;

  const [activeBubble, setActiveBubble] = useState<{
    clan: Clan;
    items: Item[];
    anchor: { x: number; y: number };
    orientation: BubbleOrientation;
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

  const handleStageDrop = useCallback(
    (event: DragEvent) => {
      const wrapper = gameAreaWrapperRef.current;
      if (!wrapper) {
        return;
      }
      const stageRect = wrapper.getBoundingClientRect();
      handleDrop(event, stageRect);
    },
    [handleDrop]
  );

  const stageCenter = layout.raioPalco > 0 ? backgroundCenter : null;
  const chaoFlorestaSize = layout.raioPalco * 5;

  return (
    <div className="game-container" aria-busy={!isGameReady}>
      <GameLoadingOverlay isVisible={!isGameReady} />
      <div
        className={`game-content${isGameReady ? " game-content--visible" : ""}`}
        aria-hidden={!isGameReady}
      >
        <GameFloor
          image={chaoBororoFloresta}
          center={stageCenter}
          size={chaoFlorestaSize}
        />
        <HudLayer
          stageCenter={stageCenter}
          stageRadius={layout.raioPalco}
          isGameReady={isGameReady}
          isHudPanelOpen={isHudPanelOpen}
          onToggleHudPanel={() => setIsHudPanelOpen((prev) => !prev)}
          onCloseHudPanel={() => setIsHudPanelOpen(false)}
          onForestReady={() => setForestReady(true)}
          progress={{
            redCompleted: completedByColor.red,
            blackCompleted: completedByColor.black,
            redTotal: totalItemsByColor.red,
            blackTotal: totalItemsByColor.black,
            currentRound,
            maxRounds,
          }}
          hudStats={{
            score,
            streak,
            maxStreak,
            feathers: featherCount,
            completed: completedCount,
            total: totalItems,
          }}
          itemTray={{
            items: menuItems,
            draggingItemId,
            spotlightItem,
            onDragStart: handleDragStart,
            onDragEnd: handleDragEnd,
          }}
        />
        <div
          className="game-area-wrapper"
          ref={setGameAreaWrapperRef}
        >
          <BororoStage
            resetClanAnimationsKey={resetClanAnimationsKey}
            clans={clans}
            clanTargets={clanTargets}
            enteringOfferings={enteringOfferings}
            feedbackPulse={feedbackPulse}
            layout={layout}
            onDragOver={handleDragOver}
            onDrop={handleStageDrop}
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
