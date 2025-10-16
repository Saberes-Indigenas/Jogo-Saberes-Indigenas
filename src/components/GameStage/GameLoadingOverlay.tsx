import LoadingScreen from "../LoadingScreen";

interface GameLoadingOverlayProps {
  isVisible: boolean;
}

const GameLoadingOverlay = ({ isVisible }: GameLoadingOverlayProps) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="game-loading-overlay">
      <LoadingScreen />
    </div>
  );
};

export default GameLoadingOverlay;
