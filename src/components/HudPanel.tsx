import { useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import "../css/HudPanel.css";
import {
  DEFAULT_MAX_ROUNDS,
  FEATHERS_PER_ROUND,
  getFeatherCapacity,
} from "../config/gameSession";

// Importações dos SVGs como antes
import basketSvg from "../assets/hud/basket.svg?raw";
import featherSvg from "../assets/hud/feather.svg?raw";
import streakSvg from "../assets/hud/streak.svg?raw";
import villageSvg from "../assets/hud/village.svg?raw";

// Importação dos novos componentes
import TexturaDeEsteira from "./TexturaDeEsteira";
import ProgressCircle from "./ProgressCircle"; // ✅ NOVO

// Props do painel
interface HudPanelProps {
  score: number;
  streak: number;
  maxStreak: number;
  feathers: number;
  completed: number;
  total: number;
  redCompleted: number;
  blackCompleted: number;
  redTotal: number;
  blackTotal: number;
  currentRound: number;
  maxRounds: number;
  stageCenter: { x: number; y: number } | null;
  onClose: () => void;
}

// --- COMPONENTES DE ÍCONES (Inalterados) ---
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
const BasketIcon = () => (
  <InlineHudIcon svg={basketSvg} className="hud-icon--basket" />
);
const FeatherIcon = () => (
  <InlineHudIcon svg={featherSvg} className="hud-icon--feather" />
);
const StreakIcon = () => (
  <InlineHudIcon svg={streakSvg} className="hud-icon--streak" />
);
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

// --- INDICADORES SEMÂNTICOS (Agora usando ProgressCircle) ---

const ScoreIndicator = ({ score }: { score: number }) => {
  const safeScore = Number.isFinite(score) ? score : 0;

  return (
    <article
      className="hud-module hud-module--score"
      aria-label="Sabedoria acumulada"
    >
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

const FeatherRack = ({
  feathers,
  maxRounds,
}: {
  feathers: number;
  maxRounds: number;
}) => {
  const totalSlots = useMemo(() => getFeatherCapacity(maxRounds), [maxRounds]);
  const filledSlots = Math.min(Math.max(feathers, 0), totalSlots);
  const slots = useMemo(() => Array.from({ length: totalSlots }), [totalSlots]);

  return (
    <article
      className="hud-module hud-module--feather-rack"
      aria-label={`Painel de plumas: ${filledSlots} de ${totalSlots}`}
    >
      <TexturaDeEsteira />
      <header className="hud-feather-rack__header">
        <div className="hud-feather-rack__crest" aria-hidden="true">
          <FeatherIcon />
        </div>
        <div className="hud-feather-rack__legend">
          <span className="hud-module__label">Painel de Plumas</span>
          <strong className="hud-module__value">
            {filledSlots}
            <span className="hud-feather-rack__total">/{totalSlots}</span>
          </strong>
          <span className="hud-module__hint">
            {FEATHERS_PER_ROUND} pluma por rodada concluída
          </span>
        </div>
      </header>
      <ul
        className="hud-feather-rack__slots"
        role="list"
        aria-label="Plumas conquistadas até agora"
      >
        {slots.map((_, index) => {
          const isFilled = index < filledSlots;
          const slotKey = `feather-slot-${index}-${
            isFilled ? "filled" : "empty"
          }`;
          const entryDelay = 0.18 + index * 0.06;
          const initialState = isFilled
            ? { opacity: 0, y: -18, rotate: -12 }
            : { opacity: 0, y: -10, rotate: 0 };
          const animateState = isFilled
            ? { opacity: 1, y: 0, rotate: [-12, 7, -4, 2, -1, 0] }
            : { opacity: 0.45, y: 0, rotate: 0 };
          const transition = isFilled
            ? {
                delay: entryDelay,
                opacity: { duration: 0.35, ease: "easeOut" },
                y: { duration: 0.62, ease: [0.24, 0.82, 0.21, 0.99] },
                rotate: {
                  duration: 1.1,
                  ease: [0.24, 0.82, 0.21, 0.99],
                  times: [0, 0.3, 0.55, 0.75, 0.9, 1],
                },
              }
            : {
                delay: entryDelay,
                opacity: { duration: 0.28, ease: "easeOut" },
                y: { duration: 0.42, ease: [0.33, 1, 0.68, 1] },
              };

          return (
            <motion.li
              key={slotKey}
              className={`hud-feather-rack__slot ${
                isFilled ? "is-filled" : "is-empty"
              }`}
              initial={initialState}
              animate={animateState}
              transition={transition}
              style={{ transformOrigin: "50% 10px" }}
            >
              <span className="hud-feather-rack__pin" aria-hidden="true" />
              <div
                className="hud-feather-rack__pendant"
                aria-hidden={!isFilled}
                data-filled={isFilled ? "true" : "false"}
              >
                {isFilled ? <FeatherIcon /> : null}
              </div>
            </motion.li>
          );
        })}
      </ul>
    </article>
  );
};

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
      aria-label="Ritmo ritual de acertos"
    >
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

const ProgressIndicator = ({
  progress,
  completed,
  total,
  redCompleted,
  blackCompleted,
  redTotal,
  blackTotal,
  currentRound,
  maxRounds,
  circleSize = 196,
}: {
  progress: number;
  completed: number;
  total: number;
  redCompleted: number;
  blackCompleted: number;
  redTotal: number;
  blackTotal: number;
  currentRound: number;
  maxRounds: number;
  circleSize?: number;
}) => {
  const getProgressLabel = (progressValue: number): string => {
    if (progressValue === 100) return "Círculo Completo";
    if (progressValue >= 75) return "Harmonia Próxima";
    if (progressValue >= 50) return "O Círculo se Fortalece";
    if (progressValue >= 25) return "Tecendo as Relações";
    return "Iniciando o Círculo";
  };

  const displayMaxRounds = Math.max(maxRounds, 1);
  const displayCurrentRound = Math.min(
    currentRound > 0 ? currentRound : 1,
    displayMaxRounds
  );

  return (
    <section
      className="hud-module hud-module--progress"
      role="group"
      aria-label="Progresso do Círculo da Aldeia"
    >
      <TexturaDeEsteira />
      <motion.div
        className="hud-module__icon hud-module__icon--village"
        aria-hidden="true"
        initial={{ scale: 0.85 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 240,
          damping: 18,
          delay: 0.08,
        }}
      >
        <ProgressCircle progress={progress} size={circleSize}>
          <motion.span
            className="hud-progress-circle__crest"
            initial={{ scale: 0.85, rotate: -6 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 18,
              delay: 0.18,
            }}
          >
            <VillageIcon />
          </motion.span>
        </ProgressCircle>
      </motion.div>
      <div className="hud-module__content">
        <span className="hud-module__label">Círculo da Aldeia</span>
        <strong className="hud-module__value">
          {getProgressLabel(progress)}
        </strong>
        <span className="hud-module__hint">
          {completed} de {total} seres reunidos
        </span>
        <span className="hud-module__hint hud-module__hint--rounds">
          Rodada atual: {displayCurrentRound} de {displayMaxRounds}
        </span>
        <div className="hud-module__breakdown" aria-hidden="true">
          <span className="hud-module__breakdown-item hud-module__breakdown-item--red">
            Vermelho: {redCompleted}/{redTotal}
          </span>
          <span className="hud-module__breakdown-item hud-module__breakdown-item--black">
            Preto: {blackCompleted}/{blackTotal}
          </span>
        </div>
      </div>
    </section>
  );
};

// --- COMPONENTE PRINCIPAL (HudPanel) ---
const HudPanel = ({
  score,
  streak,
  maxStreak,
  feathers,
  completed,
  total,
  redCompleted,
  blackCompleted,
  redTotal,
  blackTotal,
  currentRound,
  maxRounds,
  stageCenter,
  onClose,
}: HudPanelProps) => {
  const progress =
    total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const panelStyle = useMemo(() => {
    if (!stageCenter) {
      return { opacity: 0, pointerEvents: "none" as const };
    }
    return {
      left: `${stageCenter.x}px`,
      top: `${stageCenter.y}px`,
      opacity: 1,
    };
  }, [stageCenter]);

  const effectiveMaxRounds =
    maxRounds && maxRounds > 0 ? maxRounds : DEFAULT_MAX_ROUNDS;

  // Animações
  const panelVariants = {
    hidden: { opacity: 0, scale: 0.9, x: "-50%", y: "-45%" },
    visible: {
      opacity: 1,
      scale: 1,
      x: "-50%",
      y: "-50%",
      transition: { duration: 0.42, ease: [0.17, 0.67, 0.32, 0.97] },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 18,
      transition: { duration: 0.28, ease: [0.19, 0.57, 0.3, 0.98] },
    },
  };
  const modulesWrapperVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delayChildren: 0.12, staggerChildren: 0.08 },
    },
  };
  const moduleVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.94 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 220, damping: 22 },
    },
  };

  return (
    <>
      <motion.button
        type="button"
        className="hud-panel__backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        aria-label="Fechar painel da jornada"
        onClick={onClose}
      />
      <motion.section
        id="hud-panel"
        ref={panelRef}
        key="hud-panel"
        className="hud-panel"
        style={panelStyle}
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hud-panel-title"
      >
        <TexturaDeEsteira className="hud-panel__texture" tone="clay" />

        <motion.div
          className="hud-panel__body"
          variants={modulesWrapperVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="hud-panel__module hud-panel__module--score"
            variants={moduleVariants}
          >
            <ScoreIndicator score={score} />
          </motion.div>
          <motion.div
            className="hud-panel__module hud-panel__module--progress"
            variants={moduleVariants}
          >
            <ProgressIndicator
              progress={progress}
              completed={completed}
              total={total}
              redCompleted={redCompleted}
              blackCompleted={blackCompleted}
              redTotal={redTotal}
              blackTotal={blackTotal}
              currentRound={currentRound}
              maxRounds={maxRounds}
              circleSize={196}
            />
          </motion.div>
          <motion.div
            className="hud-panel__module hud-panel__module--feather"
            variants={moduleVariants}
          >
            <FeatherRack feathers={feathers} maxRounds={effectiveMaxRounds} />
          </motion.div>
          <motion.div
            className="hud-panel__module hud-panel__module--streak"
            variants={moduleVariants}
          >
            <StreakIndicator streak={streak} maxStreak={maxStreak} />
          </motion.div>
        </motion.div>
      </motion.section>
    </>
  );
};

export default HudPanel;
