import TexturaDeEsteira from "../TexturaDeEsteira";

import { StreakIcon } from "./HudIcons";

import "./StreakIndicator.css";

interface StreakIndicatorProps {
  streak: number;
  maxStreak: number;
}

const PaintMark = ({ isActive }: { isActive: boolean }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    role="presentation"
    className={`hud-streak__mark-svg ${isActive ? "is-active" : ""}`}
  >
    <path d="M2 6L6 10 10 6 6 2Z" />
  </svg>
);

const StreakIndicator = ({ streak, maxStreak }: StreakIndicatorProps) => {
  const marks = 6;
  const activeMarks = Math.max(0, Math.min(marks, streak));

  return (
    <article className="hud-module hud-module--streak" aria-label="Ritmo ritual de acertos">
      <TexturaDeEsteira />
      <div className="hud-module__icon">
        <StreakIcon />
      </div>
      <div className="hud-module__content">
        <span className="hud-module__label">Ritmo Ritual</span>
        <strong className="hud-module__value">{streak}</strong>
        <span className="hud-module__hint">Foco Máximo: {maxStreak}</span>
        <div className="hud-streak__marks" aria-hidden="true">
          {Array.from({ length: marks }).map((_, index) => (
            <PaintMark key={index} isActive={index < activeMarks} />
          ))}
        </div>
      </div>
    </article>
  );
};

export default StreakIndicator;
