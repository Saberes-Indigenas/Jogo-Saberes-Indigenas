import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "../css/GameHud.css";

interface GameHudProps {
  score: number;
  streak: number;
  maxStreak: number;
  feathers: number;
  completed: number;
  total: number;
}

const GameHud = ({
  score,
  streak,
  maxStreak,
  feathers,
  completed,
  total,
}: GameHudProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const progress = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;

  return (
    <div className="hud-root" aria-live="polite">
      <motion.button
        type="button"
        className={`hud-toggle ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        whileTap={{ scale: 0.94 }}
        aria-expanded={isOpen}
        aria-controls="hud-panel"
        aria-label={isOpen ? "Fechar painel da jornada" : "Abrir painel da jornada"}
      >
        <span className="hud-toggle__badge">{score.toLocaleString("pt-BR")}</span>
        <span className="hud-toggle__label">Jornada</span>
        <span className="hud-toggle__hint">abrir</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            id="hud-panel"
            key="hud-panel"
            className="hud-panel"
            initial={{ opacity: 0, y: -20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <header className="hud-panel__header">
              <div className="hud-panel__title">Jornada Bororo</div>
              <p>Ganhe plumas ao ligar cada ser ao seu clã e celebrate com a aldeia.</p>
            </header>
            <div className="hud-panel__stats">
              <div className="hud-stat hud-stat--score">
                <span className="hud-stat__label">Pontos</span>
                <strong className="hud-stat__value">{score.toLocaleString("pt-BR")}</strong>
              </div>
              <div className="hud-stat">
                <span className="hud-stat__label">Sequência</span>
                <strong className="hud-stat__value">{streak}</strong>
                <small className="hud-stat__hint">máx. {maxStreak}</small>
              </div>
              <div className="hud-stat hud-stat--reward">
                <span className="hud-stat__label">Plumas</span>
                <strong className="hud-stat__value">{feathers}</strong>
              </div>
            </div>
            <div
              className="hud-progress"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="hud-progress__label">
                <span>Progresso da aldeia</span>
                <span>
                  {completed}/{total}
                </span>
              </div>
              <div className="hud-progress__track">
                <motion.span
                  className="hud-progress__value"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 180, damping: 18 }}
                />
              </div>
            </div>
            <footer className="hud-panel__footer">
              <p>
                Dica: Repita o nome em Bororo ao acertar e conte uma curiosidade sobre o clã
                para os amigos.
              </p>
            </footer>
            <button type="button" className="hud-panel__close" onClick={() => setIsOpen(false)}>
              Fechar
            </button>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameHud;
