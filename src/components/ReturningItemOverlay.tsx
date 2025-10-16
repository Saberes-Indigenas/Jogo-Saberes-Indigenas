import { memo, useMemo } from "react";
import { Stage, Layer } from "react-konva";
import ReturningItem from "./ReturningItem";
import type { ReturningItemState } from "../types";
import "./ReturningItemOverlay.css";

interface ReturningItemOverlayProps {
  returningItem: ReturningItemState;
  layout: {
    gameAreaWidth: number;
    gameAreaHeight: number;
    centroX: number;
    centroY: number;
    raioPalco: number;
  };
  containerRect: {
    width: number;
    height: number;
    top: number;
    left: number;
  };
  onComplete: () => void;
}

const ReturningItemOverlay = ({
  returningItem,
  layout,
  containerRect,
  onComplete,
}: ReturningItemOverlayProps) => {
  const pixelRatio = useMemo(() => {
    if (typeof window === "undefined") {
      return 1;
    }
    return Math.min(window.devicePixelRatio || 1, 1.25);
  }, []);

  if (
    !returningItem ||
    layout.gameAreaWidth === 0 ||
    layout.gameAreaHeight === 0
  ) {
    return null;
  }

  return (
    <div className="returning-item-overlay" aria-hidden>
      <Stage
        width={layout.gameAreaWidth}
        height={layout.gameAreaHeight}
        pixelRatio={pixelRatio}
        className="returning-item-stage"
        style={{
          position: "absolute",
          left: `${containerRect.left}px`,
          top: `${containerRect.top}px`,
          pointerEvents: "none",
          width: `${layout.gameAreaWidth}px`,
          height: `${layout.gameAreaHeight}px`,
        }}
      >
        <Layer listening={false} hitGraphEnabled={false}>
          <ReturningItem
            itemData={returningItem.item}
            startPos={returningItem.startPos}
            endPos={returningItem.endPos}
            onComplete={onComplete}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default memo(ReturningItemOverlay);
