import React from "react";

interface LoadingScreenProps {
  label?: string;
  progress?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  label = "Carregando a aldeia...",
  progress,
}) => {
  const groups = ["item1", "item2", "item3"] as const;
  const hasProgress = Number.isFinite(progress);
  const clampedProgress = hasProgress
    ? Math.round(Math.min(100, Math.max(0, (progress ?? 0) * 100)))
    : undefined;

  return (
    <div
      className="game-loader"
      role="progressbar"
      aria-live="polite"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clampedProgress}
    >
      <span className="game-loader__sr">
        {clampedProgress !== undefined
          ? `Carregando cenário... ${clampedProgress}%`
          : "Carregando cenário..."}
      </span>
      <div className="game-loader__balls" aria-hidden>
        {groups.map((group) => (
          <div className="game-loader__group" key={group}>
            {[0, 1, 2].map((ballIndex) => (
              <div
                key={`${group}-${ballIndex}`}
                className={`game-loader__ball game-loader__ball--${group} game-loader__ball--index-${ballIndex}`}
              />
            ))}
          </div>
        ))}
      </div>
      <p className="game-loader__label" aria-hidden>
        {label}
        {clampedProgress !== undefined ? ` ${clampedProgress}%` : ""}
      </p>
    </div>
  );
};

export default LoadingScreen;
