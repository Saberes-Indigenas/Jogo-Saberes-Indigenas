import { useMemo, useState } from "react";
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

const BasketIcon = () => (
  <svg viewBox="0 0 64 64" role="img" aria-hidden="true" className="hud-icon hud-icon--basket">
    <rect x="12" y="26" width="40" height="28" rx="6" ry="6" fill="none" />
    <path d="M18 26c2-10 9-18 14-18s12 8 14 18" fill="none" strokeWidth="6" />
    <path d="M18 40h28M16 48h32" fill="none" strokeWidth="4" />
  </svg>
);

const FeatherIcon = () => (
  <svg viewBox="0 0 64 64" role="img" aria-hidden="true" className="hud-icon hud-icon--feather">
    <path d="M20 52c0-18 12-36 26-40-2 12-12 30-26 40z" fill="none" />
    <path d="M18 42c12 0 20-12 26-24" fill="none" strokeWidth="4" />
  </svg>
);

const StreakIcon = () => (
  <svg viewBox="0 0 64 64" role="img" aria-hidden="true" className="hud-icon hud-icon--streak">
    <path d="M12 44l20-32 20 32" fill="none" />
    <path d="M24 44l8-12 8 12" fill="none" />
  </svg>
);

const VillageIcon = () => (
  <svg viewBox="0 0 72 72" role="img" aria-hidden="true" className="hud-icon hud-icon--village">
    <circle cx="36" cy="36" r="30" />
    <path d="M20 44l16-20 16 20" />
    <rect x="30" y="36" width="12" height="14" rx="2" />
  </svg>
);

const ProgressRing = ({ value }: { value: number }) => {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.max(0, Math.min(100, value));
  const dashOffset = useMemo(
    () => circumference - (clampedValue / 100) * circumference,
    [circumference, clampedValue],
  );

  return (
    <div className="hud-progress-ring" aria-hidden="true">
      <svg className="hud-progress-ring__svg" viewBox="0 0 128 128" role="img">
        <defs>
          <linearGradient id="hud-progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(181, 35, 35, 0.95)" />
            <stop offset="65%" stopColor="rgba(15, 15, 15, 0.9)" />
          </linearGradient>
        </defs>
        <circle
          className="hud-progress-ring__track"
          cx="64"
          cy="64"
          r={radius}
          strokeWidth="8"
        />
        <motion.circle
          className="hud-progress-ring__value"
          cx="64"
          cy="64"
          r={radius}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ type: "spring", stiffness: 180, damping: 24 }}
        />
        <circle className="hud-progress-ring__center" cx="64" cy="64" r="38" />
      </svg>
      <div className="hud-progress-ring__totem">
        <VillageIcon />
      </div>
    </div>
  );
};

const ScoreIndicator = ({ score }: { score: number }) => (
  <article className="hud-module hud-module--score" aria-label="Pontuação acumulada">
    <div className="hud-module__icon">
      <BasketIcon />
    </div>
    <div className="hud-module__content">
      <span className="hud-module__label">Pontos</span>
      <strong className="hud-module__value">{score.toLocaleString("pt-BR")}</strong>
      <span className="hud-module__hint">Cesto de honrarias</span>
    </div>
  </article>
);

const FeatherIndicator = ({ feathers }: { feathers: number }) => (
  <article className="hud-module hud-module--feathers" aria-label="Plumas conquistadas">
    <div className="hud-module__icon">
      <FeatherIcon />
    </div>
    <div className="hud-module__content">
      <span className="hud-module__label">Plumas</span>
      <strong className="hud-module__value">{feathers}</strong>
      <span className="hud-module__hint">Celebrações compartilhadas</span>
    </div>
  </article>
);

const StreakIndicator = ({ streak, maxStreak }: { streak: number; maxStreak: number }) => {
  const marks = 6;
  const activeMarks = Math.max(0, Math.min(marks, streak));

  return (
    <article className="hud-module hud-module--streak" aria-label="Sequência de acertos">
      <div className="hud-module__icon">
        <StreakIcon />
      </div>
      <div className="hud-module__content">
        <span className="hud-module__label">Sequência</span>
        <strong className="hud-module__value">{streak}</strong>
        <span className="hud-module__hint">máx. {maxStreak}</span>
        <div className="hud-streak__marks" aria-hidden="true">
          {Array.from({ length: marks }).map((_, index) => (
            <span
              key={index}
              className={`hud-streak__mark ${index < activeMarks ? "is-active" : ""}`}
            />
          ))}
        </div>
      </div>
    </article>
  );
};

const ProgressIndicator = ({
  progress,
  completed,
  total,
}: {
  progress: number;
  completed: number;
  total: number;
}) => (
  <section
    className="hud-module hud-module--progress"
    role="group"
    aria-label="Progresso da aldeia"
  >
    <div className="hud-module__icon" aria-hidden="true">
      <ProgressRing value={progress} />
    </div>
    <div className="hud-module__content">
      <span className="hud-module__label">Aldeia</span>
      <strong className="hud-module__value">{progress}%</strong>
      <span className="hud-module__hint">
        {completed}/{total} encontros
      </span>
    </div>
  </section>
);

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

  const rootClassName = `hud-root ${isOpen ? "hud-root--open" : ""}`;

  return (
    <div className={rootClassName} aria-live="polite">
      <motion.button
        type="button"
        className={`hud-toggle ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        whileTap={{ scale: 0.94 }}
        aria-expanded={isOpen}
        aria-controls="hud-panel"
        aria-label={isOpen ? "Fechar painel da jornada" : "Abrir painel da jornada"}
      >
        <span className="hud-toggle__icon" aria-hidden="true">
          <BasketIcon />
        </span>
        <span className="hud-toggle__label">Jornada</span>
        <span className="hud-toggle__badge">{score.toLocaleString("pt-BR")}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            id="hud-panel"
            key="hud-panel"
            className="hud-panel"
            initial={{ opacity: 0, y: -16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
          >
            <header className="hud-panel__header">
              <div className="hud-panel__badge" aria-hidden="true">
                <VillageIcon />
              </div>
              <div>
                <h2 className="hud-panel__title">Jornada Boe</h2>
                <p>
                  Conduza cada ser ao seu clã. As texturas e ícones deste painel aguardam os
                  grafismos oficiais do povo Boe.
                </p>
              </div>
            </header>

            <div className="hud-panel__modules">
              <ScoreIndicator score={score} />
              <div className="hud-panel__row">
                <FeatherIndicator feathers={feathers} />
                <StreakIndicator streak={streak} maxStreak={maxStreak} />
              </div>
              <ProgressIndicator progress={progress} completed={completed} total={total} />
            </div>

            <footer className="hud-panel__footer">
              <p>
                Dica: repita o nome em Bororo a cada acerto e compartilhe uma história sobre o
                clã correspondente.
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
