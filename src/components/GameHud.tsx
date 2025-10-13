import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "../css/GameHud.css";

import basketSvg from "../assets/hud/basket.svg?raw";
import featherSvg from "../assets/hud/feather.svg?raw";
import streakSvg from "../assets/hud/streak.svg?raw";
import villageSvg from "../assets/hud/village.svg?raw";
import TexturaDeEsteira from "./TexturaDeEsteira";
interface GameHudProps {
  score: number;
  streak: number;
  maxStreak: number;
  feathers: number;
  completed: number;
  total: number;
  stageCenter: { x: number; y: number } | null;
}

const InlineHudIcon = ({
  svg,
  className = "",
}: {
  svg: string;
  className?: string;
}) => (
  <span
    aria-hidden="true"
    role="img"
    className={`hud-icon ${className}`.trim()}
    dangerouslySetInnerHTML={{ __html: svg }}
  />
);

const BasketIcon = () => <InlineHudIcon svg={basketSvg} className="hud-icon--basket" />;

const FeatherIcon = () => (
  <InlineHudIcon svg={featherSvg} className="hud-icon--feather" />
);

const StreakIcon = () => <InlineHudIcon svg={streakSvg} className="hud-icon--streak" />;

const VillageIcon = () => (
  <InlineHudIcon svg={villageSvg} className="hud-icon--village" />
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

interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  trackWidth?: number;
  className?: string;
  children?: ReactNode;
}

const ProgressRing = ({
  value,
  size = 128,
  strokeWidth = 10,
  trackWidth = strokeWidth + 2,
  className = "",
  children,
}: ProgressRingProps) => {
  const radius = useMemo(() => {
    const maxStroke = Math.max(strokeWidth, trackWidth);
    return Math.max(12, (size - maxStroke) / 2);
  }, [size, strokeWidth, trackWidth]);

  const centerRadius = useMemo(() => {
    const reduction = Math.max(trackWidth * 0.7, 18);
    return Math.max(8, radius - reduction);
  }, [radius, trackWidth]);

  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.max(0, Math.min(100, value));
  const dashOffset = useMemo(
    () => circumference - (clampedValue / 100) * circumference,
    [circumference, clampedValue]
  );

  return (
    <div
      className={`hud-progress-ring ${className}`.trim()}
      aria-hidden="true"
      style={{ width: size, height: size }}
    >
      <svg
        className="hud-progress-ring__svg"
        viewBox={`0 0 ${size} ${size}`}
        role="img"
      >
        <defs>
          <filter id="hud-earth-texture">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="3"
              seed="10"
              result="noise"
            />
            <feDiffuseLighting
              in="noise"
              lightingColor="#d7b47b"
              surfaceScale="2"
              result="lighting"
            >
              <feDistantLight azimuth="235" elevation="60" />
            </feDiffuseLighting>
            <feComposite in="lighting" in2="SourceGraphic" operator="in" result="textured" />
            <feBlend in="SourceGraphic" in2="textured" mode="multiply" />
          </filter>
          <linearGradient
            id="hud-progress-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgba(181, 35, 35, 0.95)" />
            <stop offset="65%" stopColor="rgba(15, 15, 15, 0.9)" />
          </linearGradient>
        </defs>
        <circle
          className="hud-progress-ring__track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={trackWidth}
          filter="url(#hud-earth-texture)"
        />
        <motion.circle
          className="hud-progress-ring__value"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ type: "spring", stiffness: 180, damping: 24 }}
        />
        <circle
          className="hud-progress-ring__center"
          cx={size / 2}
          cy={size / 2}
          r={centerRadius}
          filter="url(#hud-earth-texture)"
        />
      </svg>
      <div className="hud-progress-ring__totem">
        {children}
      </div>
    </div>
  );
};

const ScoreIndicator = ({ score }: { score: number }) => (
  <article
    className="hud-module hud-module--score"
    aria-label="Pontuação acumulada"
  >
    <TexturaDeEsteira />
    <div className="hud-module__icon">
      <BasketIcon />
    </div>
    <div className="hud-module__content">
      <span className="hud-module__label">Pontos</span>
      <strong className="hud-module__value">
        {score.toLocaleString("pt-BR")}
      </strong>
      <span className="hud-module__hint">Cesto de honrarias</span>
    </div>
  </article>
);

const FeatherIndicator = ({ feathers }: { feathers: number }) => (
  <article
    className="hud-module hud-module--feathers"
    aria-label="Plumas conquistadas"
  >
    <TexturaDeEsteira />
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

const StreakIndicator = ({
  streak,
  maxStreak,
}: {
  streak: number;
  maxStreak: number;
}) => {
  const marks = 6;
  const activeMarks = Math.max(0, Math.min(marks, streak));

  return (
    <article
      className="hud-module hud-module--streak"
      aria-label="Sequência de acertos"
    >
      <TexturaDeEsteira />
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
    <TexturaDeEsteira />
    <div className="hud-module__icon" aria-hidden="true">
      <ProgressRing
        value={progress}
        size={108}
        strokeWidth={8}
        trackWidth={11}
      >
        <VillageIcon />
      </ProgressRing>
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
  stageCenter,
}: GameHudProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const progress =
    total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;

  const hudStyle = useMemo(() => {
    if (!stageCenter) {
      return { left: "50%", top: "50%" };
    }
    return { left: `${stageCenter.x}px`, top: `${stageCenter.y}px` };
  }, [stageCenter]);

  const moduleVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.92 },
    visible: { opacity: 1, y: 0, scale: 1 },
  } as const;

  return (
    <div
      className={`hud-stage-anchor ${isOpen ? "hud-stage-anchor--open" : ""}`}
      style={hudStyle}
      aria-live="polite"
    >
      <motion.button
        type="button"
        className={`hud-totem-button ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.06, rotate: isOpen ? 2 : -2 }}
        whileTap={{ scale: 0.95 }}
        aria-expanded={isOpen}
        aria-controls="hud-panel"
        aria-label={
          isOpen ? "Fechar painel da jornada" : "Abrir painel da jornada"
        }
      >
        <span className="hud-totem-button__pulse" aria-hidden="true" />
        <ProgressRing
          value={progress}
          size={180}
          strokeWidth={12}
          trackWidth={16}
          className="hud-progress-ring--totem"
        >
          <span className="hud-totem-button__icon" aria-hidden="true">
            <VillageIcon />
          </span>
        </ProgressRing>
        <span className="hud-totem-button__label">Jornada Boe</span>
        <span className="hud-totem-button__score">
          {score.toLocaleString("pt-BR")}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            id="hud-panel"
            key="hud-panel"
            className="hud-panel"
            initial={{ opacity: 0, y: 40, scale: 0.92, rotate: -2 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: 30, scale: 0.9, rotate: 2 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
          >
            <TexturaDeEsteira className="hud-panel__texture" tone="clay" />
            <header className="hud-panel__header">
              <div className="hud-panel__crest" aria-hidden="true">
                <VillageIcon />
              </div>
              <div className="hud-panel__legend">
                <h2 className="hud-panel__title">Ritual da Aldeia</h2>
                <p className="hud-panel__subtitle">
                  Celebre cada encontro correto e fortaleça os laços do povo Boe.
                </p>
              </div>
              <motion.button
                type="button"
                className="hud-panel__close"
                onClick={() => setIsOpen(false)}
                whileHover={{ scale: 1.08, rotate: 3 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Fechar painel da jornada"
              >
                ✕
              </motion.button>
            </header>

            <motion.div
              className="hud-panel__modules"
              initial="hidden"
              animate="visible"
            >
              {[<ScoreIndicator score={score} key="score" />,
              <FeatherIndicator feathers={feathers} key="feathers" />,
              <StreakIndicator streak={streak} maxStreak={maxStreak} key="streak" />,
              <ProgressIndicator
                progress={progress}
                completed={completed}
                total={total}
                key="progress"
              />].map((module, index) => (
                <motion.div
                  key={`hud-module-${index}`}
                  className="hud-panel__module"
                  variants={moduleVariants}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.08 * index,
                  }}
                >
                  {module}
                </motion.div>
              ))}
            </motion.div>

            <footer className="hud-panel__footer">
              <p>
                Repita o nome em Bororo a cada acerto e compartilhe uma história
                com a aldeia para ganhar novas plumas.
              </p>
            </footer>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameHud;
