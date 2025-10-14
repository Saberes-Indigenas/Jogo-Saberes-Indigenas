import { useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import "../css/GameHud.css";

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

const ScoreIndicator = ({ score }: { score: number }) => (
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
        {score.toLocaleString("pt-BR")}
      </strong>
      <span className="hud-module__hint">Sementes de Urucum (Nonogo)</span>
    </div>
  </article>
);

const FeatherIndicator = ({ feathers }: { feathers: number }) => (
  <article
    className="hud-module hud-module--feathers"
    aria-label="Plumas recebidas"
  >
    <TexturaDeEsteira />
    <div className="hud-module__icon">
      <FeatherIcon />
    </div>
    <div className="hud-module__content">
      <span className="hud-module__label">Plumas</span>
      <strong className="hud-module__value">{feathers}</strong>
      <span className="hud-module__hint">Honras das Almas (Aroe)</span>
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
}: {
  progress: number;
  completed: number;
  total: number;
}) => {
  const getProgressLabel = (progressValue: number): string => {
    if (progressValue === 100) return "Círculo Completo";
    if (progressValue >= 75) return "Harmonia Próxima";
    if (progressValue >= 50) return "O Círculo se Fortalece";
    if (progressValue >= 25) return "Tecendo as Relações";
    return "Iniciando o Círculo";
  };

  return (
    <section
      className="hud-module hud-module--progress"
      role="group"
      aria-label="Progresso do Círculo da Aldeia"
    >
      <TexturaDeEsteira />
      <div className="hud-module__icon" aria-hidden="true">
        {/* ✅ SUBSTITUIÇÃO AQUI */}
        <ProgressCircle progress={progress} size={80}>
          <VillageIcon />
        </ProgressCircle>
      </div>
      <div className="hud-module__content">
        <span className="hud-module__label">Círculo da Aldeia</span>
        <strong className="hud-module__value">
          {getProgressLabel(progress)}
        </strong>
        <span className="hud-module__hint">
          {completed} de {total} seres reunidos
        </span>
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
        <header className="hud-panel__header">
          <div className="hud-panel__crest" aria-hidden="true">
            <VillageIcon />
          </div>
          <div className="hud-panel__legend">
            <h2 id="hud-panel-title" className="hud-panel__title">
              Ritual da Aldeia
            </h2>
            <p className="hud-panel__subtitle">
              Una os seres da terra aos seus clãs guardiões e restaure a
              harmonia do Bororo.
            </p>
          </div>
          <motion.button
            type="button"
            className="hud-panel__close"
            onClick={onClose}
            whileHover={{ scale: 1.08, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Fechar painel da jornada"
          >
            ✕
          </motion.button>
        </header>
        <motion.div
          className="hud-panel__body"
          variants={modulesWrapperVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="hud-panel__summary">
            <motion.div className="hud-panel__module" variants={moduleVariants}>
              <ScoreIndicator score={score} />
            </motion.div>
            <motion.div className="hud-panel__module" variants={moduleVariants}>
              <FeatherIndicator feathers={feathers} />
            </motion.div>
          </div>
          <div className="hud-panel__summary">
            <motion.div className="hud-panel__module" variants={moduleVariants}>
              <StreakIndicator streak={streak} maxStreak={maxStreak} />
            </motion.div>
            <motion.div className="hud-panel__module" variants={moduleVariants}>
              <ProgressIndicator
                progress={progress}
                completed={completed}
                total={total}
              />
            </motion.div>
          </div>
        </motion.div>
        <footer className="hud-panel__footer">
          <p>
            A cada acerto, entoe o nome Boé. A cada história compartilhada, as
            almas (Aroe) honram a sua sabedoria.
          </p>
        </footer>
      </motion.section>
    </>
  );
};

export default HudPanel;
