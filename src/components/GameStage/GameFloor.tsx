import type { CSSProperties } from "react";
import "./GameFloor.css";

interface GameFloorProps {
  image: string;
  center: { x: number; y: number } | null;
  size: number;
}

const GameFloor = ({ image, center, size }: GameFloorProps) => {
  if (!center || size <= 0) {
    return null;
  }

  const style: CSSProperties = {
    width: size,
    height: size,
    left: center.x,
    top: center.y,
  };

  return (
    <img
      src={image}
      alt=""
      className="game-floor__image"
      style={style}
    />
  );
};

export default GameFloor;
