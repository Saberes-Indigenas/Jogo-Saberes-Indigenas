import TexturaDeEsteira from "../TexturaDeEsteira";

import { BasketIcon } from "./HudIcons";

import "./ScoreIndicator.css";

interface ScoreIndicatorProps {
  score: number;
}

const ScoreIndicator = ({ score }: ScoreIndicatorProps) => {
  const safeScore = Number.isFinite(score) ? score : 0;

  return (
    <article className="hud-module hud-module--score" aria-label="Sabedoria acumulada">
      <TexturaDeEsteira />
      <div className="hud-module__icon">
        <BasketIcon />
      </div>
      <div className="hud-module__content">
        <span className="hud-module__label">Sabedoria</span>
        <strong className="hud-module__value">
          {safeScore.toLocaleString("pt-BR")}
        </strong>
        <span className="hud-module__hint">Sementes de Urucum (Nonogo)</span>
      </div>
    </article>
  );
};

export default ScoreIndicator;
