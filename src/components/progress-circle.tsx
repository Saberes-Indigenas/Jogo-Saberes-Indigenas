import type { ReactNode } from "react";
import { motion } from "framer-motion";
import "../css/ProgressCircle.css";

interface ProgressCircleProps {
  progress: number;
  size?: number;
  children?: ReactNode;
}

export function ProgressCircle({
  progress,
  size = 240,
  children,
}: ProgressCircleProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const waveOffset = `-${clampedProgress}%`;

  return (
    <div className="e-card playing" style={{ width: size, height: size }}>
      <div className="image"></div>

      <motion.div
        className="wave"
        style={{
          background:
            "linear-gradient(145deg, rgba(181,35,35,0.9), rgba(215,70,70,0.75))",
          opacity: 1,
        }}
        animate={{ marginTop: waveOffset }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      <motion.div
        className="wave"
        style={{
          background:
            "linear-gradient(145deg, rgba(15,15,15,0.95), rgba(50,50,50,0.8))",
          opacity: 0.8,
        }}
        animate={{ marginTop: waveOffset }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
      />
      {children ? <div className="e-card__content">{children}</div> : null}
    </div>
  );
}
