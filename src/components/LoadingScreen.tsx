import React from "react";

const LoadingScreen: React.FC = () => {
  const groups = ["item1", "item2", "item3"] as const;

  return (
    <div className="game-loader" role="status" aria-live="polite">
      <span className="game-loader__sr">Carregando cenário...</span>
      <div className="game-loader__balls">
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
      <p className="game-loader__label">Carregando a aldeia...</p>
    </div>
  );
};

export default LoadingScreen;
