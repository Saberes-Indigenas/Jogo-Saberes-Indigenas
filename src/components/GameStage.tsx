/* Arquivo: src/components/GameStage.tsx */

import { useState, useMemo, useEffect, useRef } from "react";
import type { Clan, Item } from "../types";
import { useGameLogic } from "../hooks/useGameLogic";
import ItemTray from "./ItemTray";
import BororoStage from "./BororoStage";
import GameModals from "./GameModals";
import "../css/GameStage.css";
import ForestBackground from "./ForestBackground";

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
    const centroX = gameAreaWidth / 2;
    const centroY = gameAreaHeight / 2;
    const raioPalco = Math.min(gameAreaWidth, gameAreaHeight) * 0.4;
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

  const {
    menuItems,
    stageItems,
    clanTargets,
    isGameOver,
    isMessageVisible,
    message,
    messageType,
    draggingItemId,
    feedbackPulse,
    returningItem,
    clearFeedbackPulse,
    onReturnAnimationComplete,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
  } = useGameLogic(clans, initialItems, layout);

  return (
    <div className="game-container">
      <ForestBackground
        stageCenter={backgroundCenter}
        stageRadius={layout.raioPalco}
        width={window.innerWidth}
        height={window.innerHeight}
      />
      <ItemTray
        items={menuItems}
        draggingItemId={draggingItemId}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />
      <div className="game-area-wrapper" ref={gameAreaWrapperRef}>
        <BororoStage
          clans={clans}
          clanTargets={clanTargets}
          stageItems={stageItems}
          feedbackPulse={feedbackPulse}
          returningItem={returningItem}
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
          onReturnAnimationComplete={onReturnAnimationComplete}
        />
      </div>
      <GameModals
        isGameOver={isGameOver}
        isMessageVisible={isMessageVisible}
        message={message}
        messageType={messageType}
      />
    </div>
  );
};

export default GameStage;
