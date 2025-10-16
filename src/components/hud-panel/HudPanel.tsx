import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";

import { DEFAULT_MAX_ROUNDS } from "../../config/gameSession";
import TexturaDeEsteira from "../TexturaDeEsteira";

import FeatherRack from "./FeatherRack";
import ProgressIndicator from "./ProgressIndicator";
import ScoreIndicator from "./ScoreIndicator";
import StreakIndicator from "./StreakIndicator";

import "./HudPanel.css";

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
  const progress = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
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

  const effectiveMaxRounds = maxRounds && maxRounds > 0 ? maxRounds : DEFAULT_MAX_ROUNDS;

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
          <motion.div className="hud-panel__module hud-panel__module--score" variants={moduleVariants}>
            <ScoreIndicator score={score} />
          </motion.div>
          <motion.div className="hud-panel__module hud-panel__module--progress" variants={moduleVariants}>
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
          <motion.div className="hud-panel__module hud-panel__module--feather" variants={moduleVariants}>
            <FeatherRack feathers={feathers} maxRounds={effectiveMaxRounds} />
          </motion.div>
          <motion.div className="hud-panel__module hud-panel__module--streak" variants={moduleVariants}>
            <StreakIndicator streak={streak} maxStreak={maxStreak} />
          </motion.div>
        </motion.div>
      </motion.section>
    </>
  );
};

export default HudPanel;
