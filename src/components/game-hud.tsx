import { useMemo } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "../store/useGameStore";
import { ProgressCircle } from "./progress-circle";
import "../css/GameHud.css";

import villageSvg from "../assets/hud/bororo.svg?raw";

interface GameHudProps {
  stageCenter: { x: number; y: number } | null;
  isOpen: boolean;
  onToggle: () => void;
}

function InlineHudIcon({
  svg,
  className = "",
}: {
  svg: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      role="img"
      className={`hud-icon ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

function VillageIcon() {
  return <InlineHudIcon svg={villageSvg} className="hud-icon--village" />;
}

export function GameHud({ stageCenter, isOpen, onToggle }: GameHudProps) {
  const redCompleted = useGameStore((s) => s.completedByColor.red);
  const blackCompleted = useGameStore((s) => s.completedByColor.black);
  const redTotal = useGameStore((s) => s.sessionTotalByColor.red);
  const blackTotal = useGameStore((s) => s.sessionTotalByColor.black);

  const completed = redCompleted + blackCompleted;
  const total = redTotal + blackTotal;
  
  const progress = useMemo(() => {
    return total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
  }, [completed, total]);

  const hudStyle = useMemo(() => {
    if (!stageCenter) {
      return { left: "50%", top: "50%", opacity: 0 };
    }
    return {
      left: `${stageCenter.x}px`,
      top: `${stageCenter.y}px`,
      opacity: 1,
    };
  }, [stageCenter]);

  return (
    <div
      className={`hud-stage-anchor ${isOpen ? "hud-stage-anchor--open" : ""}`}
      style={hudStyle}
      aria-live="polite"
    >
      <motion.button
        type="button"
        className={`hud-totem-button ${isOpen ? "is-open" : ""}`}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls="hud-panel"
        aria-label={
          isOpen ? "Fechar painel da jornada" : "Abrir painel da jornada"
        }
      >
        <span className="hud-totem-button__pulse" aria-hidden="true" />
        <ProgressCircle progress={progress} size={196}>
          <span
            className="hud-totem-button__icon"
            aria-hidden="true"
          >
            <VillageIcon />
          </span>
        </ProgressCircle>
      </motion.button>
    </div>
  );
}
