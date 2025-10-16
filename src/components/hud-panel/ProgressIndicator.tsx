import { motion } from "framer-motion";

import TexturaDeEsteira from "../TexturaDeEsteira";
import ProgressCircle from "../ProgressCircle";

import { VillageIcon } from "./HudIcons";

import "./ProgressIndicator.css";

interface ProgressIndicatorProps {
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
}

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
}: ProgressIndicatorProps) => {
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
        <strong className="hud-module__value">{getProgressLabel(progress)}</strong>
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

export default ProgressIndicator;
