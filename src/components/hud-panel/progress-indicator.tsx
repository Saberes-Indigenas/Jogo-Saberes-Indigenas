import { motion } from "framer-motion";
import { ProgressCircle } from "../progress-circle";
import "../../css/ProgressIndicator.css";

interface ProgressIndicatorProps {
  progress: number;
  circleSize?: number;
}

export function ProgressIndicator({
  progress,
  circleSize = 240,
}: ProgressIndicatorProps) {
  return (
    <section
      className="hud-module--progress"
      role="group"
      aria-label="Progresso do Círculo da Aldeia"
    >
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
        <ProgressCircle progress={progress} size={circleSize} />
      </motion.div>
    </section>
  );
}
