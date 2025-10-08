/* Arquivo: src/components/GameStage.tsx */

// Adicione 'useRef' aos seus imports do React
import { useState, useMemo, useEffect, useRef } from "react";
import type { Clan, Item } from "../types";
import { useGameLogic } from "../hooks/useGameLogic";
import ItemTray from "./ItemTray";
import BororoStage from "./BororoStage";
import GameModals from "./GameModals";
import "../css/GameStage.css";
import { ITEM_TRAY_WIDTH } from "../config/layoutConstants";
import ForestBackground from "./ForestBackground";

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

  // PASSO 1: Criar a referência e o estado para o deslocamento
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const [gameAreaOffsetLeft, setGameAreaOffsetLeft] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);

    // PASSO 2: Medir a posição da área de jogo após a montagem/redimensionamento
    if (gameAreaRef.current) {
      setGameAreaOffsetLeft(gameAreaRef.current.offsetLeft);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [windowSize]); // Executa no início e quando a janela muda de tamanho

  const layout = useMemo(() => {
    // A lógica do layout do jogo em si não precisa mudar
    const gameAreaWidth = windowSize.width - ITEM_TRAY_WIDTH; // Isso pode precisar de ajuste se a bandeja não for mais fixa
    const gameAreaHeight = windowSize.height;
    const centroX = gameAreaWidth / 2;
    const centroY = gameAreaHeight / 2;
    const raioPalco = Math.min(gameAreaWidth, gameAreaHeight) * 0.45;
    return { gameAreaWidth, gameAreaHeight, centroX, centroY, raioPalco };
  }, [windowSize]);

  // PASSO 3: Usar o valor medido para calcular o centro do background
  const backgroundCenter = useMemo(
    () => ({
      // A nova fórmula: Posição real da área de jogo + metade da largura da área de jogo
      x: gameAreaOffsetLeft + layout.centroX,
      y: layout.centroY,
    }),
    [layout.centroX, layout.centroY, gameAreaOffsetLeft] // Adiciona o offset como dependência
  );

  // --- LÓGICA DO JOGO ---
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
    // A estrutura JSX agora inclui a referência (ref)
    <div className="game-container">
      {/* CORREÇÃO ADICIONAL: Garantir que o ForestBackground receba a largura total da janela */}
      <ForestBackground
        stageCenter={backgroundCenter}
        stageRadius={layout.raioPalco}
        width={windowSize.width} // <-- CORRIGIDO!
        height={windowSize.height} // A altura já estava correta
      />

      <ItemTray
        items={menuItems}
        draggingItemId={draggingItemId}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />

      {/* Anexamos a referência aqui para que possamos medir este elemento */}
      <div className="game-area-wrapper" ref={gameAreaRef}>
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
