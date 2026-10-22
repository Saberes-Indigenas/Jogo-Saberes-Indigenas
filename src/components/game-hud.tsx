import { useMemo } from "react";
import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "../store/useGameStore";
import { ProgressCircle } from "./progress-circle";
import "../css/GameHud.css";

import bororoImg from "../assets/hud/bororo.png";

interface GameHudProps {
  stageCenter: { x: number; y: number } | null;
  /** Raio da aldeia (layout.raioPalco) — os elementos centrais escalam com ele. */
  stageRadius: number;
  isOpen: boolean;
  onToggle: () => void;
}

export function GameHud({
  stageCenter,
  stageRadius,
  isOpen,
  onToggle,
}: GameHudProps) {
  const redCompleted = useGameStore((s) => s.completedByColor.red);
  const blackCompleted = useGameStore((s) => s.completedByColor.black);
  const redTotal = useGameStore((s) => s.sessionTotalByColor.red);
  const blackTotal = useGameStore((s) => s.sessionTotalByColor.black);

  const completed = redCompleted + blackCompleted;
  const total = redTotal + blackTotal;
  
  const progress = useMemo(() => {
    return total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
  }, [completed, total]);

  /*
    Tamanhos proporcionais ao raio da aldeia, para o conjunto central escalar
    junto com ela em qualquer tela. As casas dos clãs ficam a 82% do raio e
    ocupam ~12% dele, então o miolo livre vai até ~0,70 do raio: a oca (60%
    do raio de largura) mais o círculo (30%) terminam em ~0,57.
    O gap é pequeno porque o viewBox do SVG já tem ~5,5% de área vazia
    embaixo da oca, que sozinha já afasta o círculo.
  */
  const totem = useMemo(
    () => ({
      iconWidth: stageRadius * 0.42,
      circleSize: stageRadius * 0.25,
      gap: stageRadius * 0.01,
    }),
    [stageRadius]
  );

  const hudStyle = useMemo(() => {
    const sizes = {
      "--totem-icon-w": `${totem.iconWidth}px`,
      "--totem-circle": `${totem.circleSize}px`,
      "--totem-gap": `${totem.gap}px`,
    } as CSSProperties;

    if (!stageCenter) {
      return { ...sizes, left: "50%", top: "50%", opacity: 0 };
    }
    return {
      ...sizes,
      left: `${stageCenter.x}px`,
      top: `${stageCenter.y}px`,
      opacity: 1,
    };
  }, [stageCenter, totem]);

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
        {/*
          A oca (ícone) preenche o botão e fica centrada no meio da aldeia.
          O círculo "Bororo" — que cresce e enche conforme o progresso — é um
          elemento separado, pendurado logo abaixo dela.
        */}
        <img
          src={bororoImg}
          alt=""
          aria-hidden="true"
          className="hud-totem-button__icon"
        />
        <span className="hud-totem-button__circle-wrap">
          <span className="hud-totem-button__pulse" aria-hidden="true" />
          <ProgressCircle progress={progress} size={totem.circleSize}>
            <span className="hud-totem-button__label">Bororo</span>
          </ProgressCircle>
        </span>
      </motion.button>
    </div>
  );
}
