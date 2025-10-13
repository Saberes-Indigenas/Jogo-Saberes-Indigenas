import { useId, useMemo, useState } from "react";
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

const BasketIcon = () => {
  const patternId = useId();

  return (
    <svg viewBox="0 0 64 64" role="img" aria-hidden="true" className="hud-icon hud-icon--basket">
      <defs>
        <pattern id={`basket-weave-${patternId}`} patternUnits="userSpaceOnUse" width="8" height="8">
          <path d="M0 0L8 8M8 0L0 8" stroke="rgba(15, 15, 15, 0.2)" strokeWidth="1" />
        </pattern>
      </defs>
      <path
        d="M12 28C12 22 16 20 22 20H42C48 20 52 22 52 28V52C52 56 48 58 42 58H22C16 58 12 56 12 52Z"
        fill="var(--hud-sand)"
        strokeWidth="3.5"
        stroke="var(--hud-secondary)"
      />
      <rect
        x="12"
        y="28"
        width="40"
        height="30"
        rx="4"
        ry="4"
        fill={`url(#basket-weave-${patternId})`}
      />
      <path d="M18 28C16 16 24 10 32 10S48 16 46 28" fill="none" strokeWidth="6" stroke="var(--hud-secondary)" />
    </svg>
  );
};

const FeatherIcon = () => (
  <svg viewBox="0 0 64 64" role="img" aria-hidden="true" className="hud-icon hud-icon--feather">
    <path
      d="M20 60C30 30 45 20 54 8 48 22 38 42 20 60Z"
      fill="var(--hud-primary)"
      stroke="var(--hud-secondary)"
      strokeWidth="3"
    />
    <path d="M42 24C40 32 34 45 22 58" fill="none" stroke="#3498db" strokeWidth="2.5" />
    <line x1="20" y1="60" x2="54" y2="8" stroke="rgba(15, 15, 15, 0.4)" strokeWidth="1.5" />
  </svg>
);

const StreakIcon = () => (
  <svg viewBox="0 0 64 64" role="img" aria-hidden="true" className="hud-icon hud-icon--streak">
    <line x1="12" y1="32" x2="52" y2="32" strokeWidth="4" />
    <circle cx="22" cy="32" r="5" fill="var(--hud-primary)" />
    <circle cx="32" cy="32" r="5" fill="var(--hud-secondary)" />
    <circle cx="42" cy="32" r="5" fill="var(--hud-primary)" />
    <path d="M16 22L32 42 48 22" fill="none" strokeWidth="3.5" />
  </svg>
);

const VillageIcon = () => (
  <svg viewBox="0 0 64 64" role="img" aria-hidden="true" className="hud-icon hud-icon--village">
    <path
      d="M12 48 32 16 52 48H12Z"
      fill="var(--hud-sand)"
      strokeWidth="3.5"
      stroke="var(--hud-secondary)"
    />
    <rect x="28" y="36" width="8" height="12" fill="var(--hud-secondary)" />
    <line x1="12" y1="48" x2="52" y2="48" strokeWidth="4" stroke="var(--hud-secondary)" />
  </svg>
);

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
          <filter id="hud-earth-texture">
            <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="2" result="noise" />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="0.6 0 0 0 0  0 0.48 0 0 0  0 0 0.3 0 0  0 0 0 1 0"
              result="earthy"
            />
            <feBlend in="SourceGraphic" in2="earthy" mode="multiply" />
          </filter>
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
          strokeWidth="12"
          filter="url(#hud-earth-texture)"
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
        <circle className="hud-progress-ring__center" cx="64" cy="64" r="38" filter="url(#hud-earth-texture)" />
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
            <PaintMark key={index} isActive={index < activeMarks} />
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
