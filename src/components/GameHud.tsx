import { useMemo } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import "../css/GameHud.css";

import villageSvg from "../assets/hud/bororo.svg?raw";

interface GameHudProps {
  redCompleted: number;
  blackCompleted: number;
  redTotal: number;
  blackTotal: number;
  currentRound: number;
  maxRounds: number;
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

const clampPercentage = (value: number) => Math.min(100, Math.max(0, value));

const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const describeArc = (
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  sweepFlag: 0 | 1
) => {
  const start = polarToCartesian(centerX, centerY, radius, startAngle);
  const end = polarToCartesian(centerX, centerY, radius, endAngle);
  const largeArcFlag = Math.abs(endAngle - startAngle) >= 180 ? 1 : 0;

  if (Math.abs(endAngle - startAngle) < 0.001) {
    return `M ${start.x} ${start.y}`;
  }

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}`;
};

interface DualProgressRingProps {
  redPercent: number;
  blackPercent: number;
  size?: number;
  strokeWidth?: number;
  trackWidth?: number;
  className?: string;
  children?: ReactNode;
}

const DualProgressRing = ({
  redPercent,
  blackPercent,
  size = 128,
  strokeWidth = 10,
  trackWidth = strokeWidth + 2,
  className = "",
  children,
}: DualProgressRingProps) => {
  const radius = useMemo(() => {
    const maxStroke = Math.max(strokeWidth, trackWidth);
    return Math.max(12, (size - maxStroke) / 2);
  }, [size, strokeWidth, trackWidth]);

  const centerRadius = useMemo(() => {
    const reduction = Math.max(trackWidth * 0.7, 18);
    return Math.max(8, radius - reduction);
  }, [radius, trackWidth]);

  const cx = size / 2;
  const cy = size / 2;
  const startAngle = 180;

  const safeRed = clampPercentage(redPercent) / 100;
  const safeBlack = clampPercentage(blackPercent) / 100;

  const redAngle = useMemo(
    () => Math.max(0, startAngle - safeRed * 180),
    [safeRed]
  );

  const blackAngle = useMemo(
    () => Math.min(360, startAngle + safeBlack * 180),
    [safeBlack]
  );

  const redPath = useMemo(
    () => describeArc(cx, cy, radius, startAngle, redAngle, 0),
    [cx, cy, radius, redAngle]
  );

  const blackPath = useMemo(
    () => describeArc(cx, cy, radius, startAngle, blackAngle, 1),
    [cx, cy, radius, blackAngle]
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
              baseFrequency="0.035" /* Levemente ajustado para um grão mais orgânico */
              numOctaves="3"
              seed="10"
              result="noise"
            />
            <feDiffuseLighting
              in="noise"
              lightingColor="#532804" /* A sua nova cor */
              surfaceScale="3" /* Aumentado para dar mais profundidade */
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
            {/* O modo "overlay" funciona melhor com cores escuras, misturando a textura sem escurecer demais */}
            <feBlend in="SourceGraphic" in2="textured" mode="overlay" />
          </filter>
        </defs>
        <circle
          className="hud-progress-ring__track"
          cx={cx}
          cy={cy}
          r={radius}
          strokeWidth={trackWidth}
          filter="url(#hud-earth-texture)"
        />
        <motion.path
          className="hud-progress-ring__value hud-progress-ring__value--black"
          strokeWidth={strokeWidth}
          d={blackPath}
          fill="none"
          strokeLinecap="round"
          animate={{ d: blackPath }}
          transition={{ type: "spring", stiffness: 200, damping: 26 }}
        />
        <motion.path
          className="hud-progress-ring__value hud-progress-ring__value--red"
          strokeWidth={strokeWidth}
          d={redPath}
          fill="none"
          strokeLinecap="round"
          animate={{ d: redPath }}
          transition={{ type: "spring", stiffness: 200, damping: 26 }}
        />
        <circle
          className="hud-progress-ring__center"
          cx={cx}
          cy={cy}
          r={centerRadius}
          filter="url(#hud-earth-texture)"
        />
      </svg>
      <div className="hud-progress-ring__totem">{children}</div>
    </div>
  );
};

const GameHud = ({
  redCompleted,
  blackCompleted,
  redTotal,
  blackTotal,
  stageCenter,
  isOpen,
  onToggle,
}: GameHudProps) => {
  const redPercent = useMemo(
    () => (redTotal > 0 ? (redCompleted / redTotal) * 100 : 0),
    [redCompleted, redTotal]
  );

  const blackPercent = useMemo(
    () => (blackTotal > 0 ? (blackCompleted / blackTotal) * 100 : 0),
    [blackCompleted, blackTotal]
  );

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
        <DualProgressRing
          redPercent={redPercent}
          blackPercent={blackPercent}
          size={215}
          strokeWidth={12}
          trackWidth={16}
          className="hud-progress-ring--totem"
        >
          <span className="hud-totem-button__icon" aria-hidden="true">
            <VillageIcon />
          </span>
        </DualProgressRing>
      </motion.button>
    </div>
  );
};

export default GameHud;
