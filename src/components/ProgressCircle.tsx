import type { ReactNode } from "react";
import { motion } from "framer-motion";
import "../css/ProgressCircle.css";

interface ProgressCircleProps {
  progress: number;
  size?: number;
  children?: ReactNode;
}

const ProgressCircle = ({
  progress,
  size = 240,
  children,
}: ProgressCircleProps) => {
  // Limita o progresso entre 0 e 100
  const clampedProgress = Math.max(0, Math.min(100, progress));

  // Calcula o margin-top proporcional ao progresso
  // Ex: 60% de progresso => marginTop = "-60%"
  const waveOffset = `-${clampedProgress}%`;

  return (
    <div className="e-card playing" style={{ width: size, height: size }}>
      {/* Fundo dividido (opcionalmente pode adicionar background aqui) */}
      <div className="image"></div>

      {/* Waves animadas, mas com altura controlada pelo progresso */}
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
};

export default ProgressCircle;
