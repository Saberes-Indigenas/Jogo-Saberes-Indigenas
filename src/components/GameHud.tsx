import { useMemo } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import "../css/GameHud.css";

import villageSvg from "../assets/hud/village.svg?raw";

interface GameHudProps {
  score: number;
  total: number;
  completed: number;
  stageCenter: { x: number; y: number } | null;
  isOpen: boolean; // Recebe o estado de visibilidade
  onToggle: () => void; // Recebe a função para alternar a visibilidade
}

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

const VillageIcon = () => (
  <InlineHudIcon svg={villageSvg} className="hud-icon--village" />
);

interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  trackWidth?: number;
  className?: string;
  children?: ReactNode;
}

const ProgressRing = ({
  value,
  size = 128,
  strokeWidth = 10,
  trackWidth = strokeWidth + 2,
  className = "",
  children,
}: ProgressRingProps) => {
  const radius = useMemo(() => {
    const maxStroke = Math.max(strokeWidth, trackWidth);
    return Math.max(12, (size - maxStroke) / 2);
  }, [size, strokeWidth, trackWidth]);

  const centerRadius = useMemo(() => {
    const reduction = Math.max(trackWidth * 0.7, 18);
    return Math.max(8, radius - reduction);
  }, [radius, trackWidth]);

  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.max(0, Math.min(100, value));
  const dashOffset = useMemo(
    () => circumference - (clampedValue / 100) * circumference,
    [circumference, clampedValue]
  );

  return (
    <div
      className={`hud-progress-ring ${className}`.trim()}
      aria-hidden="true"
      style={{ width: size, height: size }}
    >
      <svg
        className="hud-progress-ring__svg"
        viewBox={`0 0 ${size} ${size}`}
        role="img"
      >
        <defs>
          <filter id="hud-earth-texture">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="3"
              seed="10"
              result="noise"
            />
            <feDiffuseLighting
              in="noise"
              lightingColor="#d7b47b"
              surfaceScale="2"
              result="lighting"
            >
              <feDistantLight azimuth="235" elevation="60" />
            </feDiffuseLighting>
            <feComposite
              in="lighting"
              in2="SourceGraphic"
              operator="in"
              result="textured"
            />
            <feBlend in="SourceGraphic" in2="textured" mode="multiply" />
          </filter>
          <linearGradient
            id="hud-progress-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgba(181, 35, 35, 0.95)" />
            <stop offset="65%" stopColor="rgba(15, 15, 15, 0.9)" />
          </linearGradient>
        </defs>
        <circle
          className="hud-progress-ring__track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={trackWidth}
          filter="url(#hud-earth-texture)"
        />
        <motion.circle
          className="hud-progress-ring__value"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ type: "spring", stiffness: 180, damping: 24 }}
        />
        <circle
          className="hud-progress-ring__center"
          cx={size / 2}
          cy={size / 2}
          r={centerRadius}
          filter="url(#hud-earth-texture)"
        />
      </svg>
      <div className="hud-progress-ring__totem">{children}</div>
    </div>
  );
};

const GameHud = ({
  score,
  total,
  completed,
  stageCenter,
  isOpen,
  onToggle,
}: GameHudProps) => {
  const progress =
    total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;

  // A lógica de posicionamento do totem permanece a mesma.
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
    // A âncora agora contém APENAS o botão.
    <div
      className={`hud-stage-anchor ${isOpen ? "hud-stage-anchor--open" : ""}`}
      style={hudStyle}
      aria-live="polite"
    >
      <motion.button
        type="button"
        className={`hud-totem-button ${isOpen ? "is-open" : ""}`}
        onClick={onToggle} // Chama a função do componente pai
        aria-expanded={isOpen}
        aria-controls="hud-panel"
        aria-label={
          isOpen ? "Fechar painel da jornada" : "Abrir painel da jornada"
        }
      >
        <span className="hud-totem-button__pulse" aria-hidden="true" />
        <ProgressRing
          value={progress}
          size={180}
          strokeWidth={12}
          trackWidth={16}
          className="hud-progress-ring--totem"
        >
          <span className="hud-totem-button__icon" aria-hidden="true">
            <VillageIcon />
          </span>
        </ProgressRing>
        <span className="hud-totem-button__label">Jornada Boe</span>
        <span className="hud-totem-button__score">
          {score.toLocaleString("pt-BR")}
        </span>
      </motion.button>
    </div>
  );
};

export default GameHud;
