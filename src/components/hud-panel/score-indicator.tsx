import { BasketIcon, BasketBackgroundIcon } from "./hud-icons";
import urucumSeedsImg from "../../assets/hud_panel/urucum_seeds.jpg";

import "../../css/ScoreIndicator.css";

interface ScoreIndicatorProps {
  score: number;
  maxScore: number;
}

export function ScoreIndicator({ score, maxScore }: ScoreIndicatorProps) {
  const safeScore = Number.isFinite(score) ? score : 0;
  // Using an even steeper power function (0.4) to make every hit feel very significant visually
  const percentage = maxScore > 0
    ? Math.min(100, Math.round(Math.pow(safeScore / maxScore, 0.2) * 100))
    : 0;

  return (
    <article className="hud-module--score" aria-label="Sabedoria acumulada">
      <div className="hud-module__icon hud-module__icon--basket-wrapper">
        <div className="basket-background-wrapper">
          <BasketBackgroundIcon />
        </div>
        <div className="basket-fill-container">
          <div
            className="basket-fill-texture"
            style={{
              height: `${percentage}%`,
              backgroundImage: `url(${urucumSeedsImg})`
            }}
          />
        </div>
        <div className="basket-icon-wrapper">
          <BasketIcon />
        </div>
      </div>
    </article>
  );
}
