// src/components/ProgressCircle.tsx

import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface ProgressCircleProps {
  progress: number;
  size?: number;
  children?: ReactNode;
}

const ProgressCircle = ({
  progress,
  size = 128,
  children,
}: ProgressCircleProps) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div
      className="hud-progress-circle"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <div className="hud-progress-circle__track"></div>
      <motion.div
        className="hud-progress-circle__fill"
        initial={{ height: "0%" }}
        animate={{ height: `${clampedProgress}%` }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        <div className="hud-progress-circle__wave-container">
          <div className="wave wave--red"></div>
          <div className="wave wave--red"></div>
          <div className="wave wave--red"></div>
        </div>
        <div className="hud-progress-circle__wave-container">
          <div className="wave wave--black"></div>
          <div className="wave wave--black"></div>
          <div className="wave wave--black"></div>
        </div>
      </motion.div>
      <div className="hud-progress-circle__divider"></div>
      <div className="hud-progress-circle__icon">{children}</div>
    </div>
  );
};

export default ProgressCircle;
