import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { FeatherRack } from "./feather-rack";
import { ScoreIndicator } from "./score-indicator";
import { useGameStore } from "../../store/useGameStore";
import "../../css/HudPanel.css";

interface HudPanelProps {
  stageCenter: { x: number; y: number } | null;
  onClose: () => void;
}

export function HudPanel({ stageCenter, onClose }: HudPanelProps) {
  const score = useGameStore((s) => s.score);
  const feathers = useGameStore((s) => s.featherCount);
  const maxFeathers = useGameStore((s) => s.maxFeatherCapacity);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

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
        <motion.div
          className="hud-panel__body"
          variants={modulesWrapperVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="hud-panel__module--score"
            variants={moduleVariants}
          >
            <ScoreIndicator score={score} maxScore={useGameStore((s) => s.maxUrucumSeeds)} />
          </motion.div>
          <motion.div
            className="hud-panel__module--feather"
            variants={moduleVariants}
          >
            <FeatherRack feathers={feathers} maxFeathers={maxFeathers} />
          </motion.div>
        </motion.div>
      </motion.section>
    </>
  );
}
