import type { Clan, Item } from "../types";
import { useGameLogic } from "../hooks/useGameLogic";
import ItemTray from "./ItemTray";
import BororoStage from "./BororoStage";
import GameModals from "./GameModals";
import "../css/GameStage.css";

interface GameStageProps {
  clans: Clan[];
  initialItems: Item[];
}

const GameStage = ({ clans, initialItems }: GameStageProps) => {
  const {
    menuItems,
    stageItems,
    clanTargets,
    isGameOver,
    isMessageVisible,
    message,
    draggingItemId,
    feedbackPulse,
    returningItem,
    clearFeedbackPulse,
    onReturnAnimationComplete,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
  } = useGameLogic(clans, initialItems);

  return (
    <div className="game-container">
      <ItemTray
        items={menuItems}
        draggingItemId={draggingItemId}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />
      <div className="game-area-wrapper">
        <header className="header">
          <h1>Arraste os Artefatos para seus Clãs</h1>
        </header>
        <BororoStage
          clans={clans}
          clanTargets={clanTargets}
          stageItems={stageItems}
          feedbackPulse={feedbackPulse}
          returningItem={returningItem}
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
      />
    </div>
  );
};

export default GameStage;
