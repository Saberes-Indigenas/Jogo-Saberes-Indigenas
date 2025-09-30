/* Arquivo: src/components/GameStage.tsx */

import { useState, useMemo, useEffect } from "react";
import type { Clan, Item } from "../types";
import { useGameLogic } from "../hooks/useGameLogic";
import ItemTray from "./ItemTray";
import BororoStage from "./BororoStage";
import GameModals from "./GameModals";
import "../css/GameStage.css";
import { ITEM_TRAY_WIDTH } from "../config/layoutConstants";

interface GameStageProps {
  clans: Clan[];
  initialItems: Item[];
}

const GameStage = ({ clans, initialItems }: GameStageProps) => {
  // --- LÓGICA DE LAYOUT RESPONSIVO ---
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const layout = useMemo(() => {
    const gameAreaWidth = windowSize.width - ITEM_TRAY_WIDTH;
    const gameAreaHeight = windowSize.height;
    const centroX = gameAreaWidth / 2;
    const centroY = gameAreaHeight / 2;
    const raioPalco = Math.min(gameAreaWidth, gameAreaHeight) * 0.45;
    return { gameAreaWidth, gameAreaHeight, centroX, centroY, raioPalco };
  }, [windowSize]);

  // --- LÓGICA DO JOGO ---
  // MODIFICAÇÃO: Adicionamos 'messageType' aos valores retornados pelo seu hook.
  // Você precisará garantir que seu hook 'useGameLogic' também retorne este estado.
  const {
    menuItems,
    stageItems,
    clanTargets,
    isGameOver,
    isMessageVisible,
    message,
    messageType, // <<-- ADICIONADO AQUI
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
      <ItemTray
        items={menuItems}
        draggingItemId={draggingItemId}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />
      <div className="game-area-wrapper">
        <BororoStage
          clans={clans}
          clanTargets={clanTargets}
          stageItems={stageItems}
          feedbackPulse={feedbackPulse}
          returningItem={returningItem}
          layout={layout}
          onDragOver={handleDragOver}
          onDrop={(e) => {
            const stageRect = (
              e.currentTarget as HTMLElement
            ).getBoundingClientRect();
            handleDrop(e, stageRect);
          }}
          onPulseComplete={clearFeedbackPulse}
          onReturnAnimationComplete={onReturnAnimationComplete}
        />
      </div>
      {/* MODIFICAÇÃO: Passamos a nova prop 'messageType' para o componente GameModals. */}
      <GameModals
        isGameOver={isGameOver}
        isMessageVisible={isMessageVisible}
        message={message}
        messageType={messageType} // <<-- ADICIONADO AQUI
      />
    </div>
  );
};

export default GameStage;
