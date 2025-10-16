import { useMemo } from "react";
import { motion } from "framer-motion";

import {
  FEATHERS_PER_ROUND,
  getFeatherCapacity,
} from "../../config/gameSession";
import TexturaDeEsteira from "../TexturaDeEsteira";

import { FeatherIcon } from "./HudIcons";

import "./FeatherRack.css";

interface FeatherRackProps {
  feathers: number;
  maxRounds: number;
}

const FeatherRack = ({ feathers, maxRounds }: FeatherRackProps) => {
  const totalSlots = useMemo(() => getFeatherCapacity(maxRounds), [maxRounds]);
  const filledSlots = Math.min(Math.max(feathers, 0), totalSlots);
  const slots = useMemo(() => Array.from({ length: totalSlots }), [totalSlots]);

  return (
    <article
      className="hud-module hud-module--feather-rack"
      aria-label={`Painel de plumas: ${filledSlots} de ${totalSlots}`}
    >
      <TexturaDeEsteira />
      <header className="hud-feather-rack__header">
        <div className="hud-feather-rack__crest" aria-hidden="true">
          <FeatherIcon />
        </div>
        <div className="hud-feather-rack__legend">
          <span className="hud-module__label">Painel de Plumas</span>
          <strong className="hud-module__value">
            {filledSlots}
            <span className="hud-feather-rack__total">/{totalSlots}</span>
          </strong>
          <span className="hud-module__hint">
            {FEATHERS_PER_ROUND} pluma por rodada concluída
          </span>
        </div>
      </header>
      <ul className="hud-feather-rack__slots" role="list" aria-label="Plumas conquistadas até agora">
        {slots.map((_, index) => {
          const isFilled = index < filledSlots;
          const slotKey = `feather-slot-${index}-${isFilled ? "filled" : "empty"}`;
          const entryDelay = 0.18 + index * 0.06;
          const initialState = isFilled
            ? { opacity: 0, y: -18, rotate: -12 }
            : { opacity: 0, y: -10, rotate: 0 };
          const animateState = isFilled
            ? { opacity: 1, y: 0, rotate: [-12, 7, -4, 2, -1, 0] }
            : { opacity: 0.45, y: 0, rotate: 0 };
          const transition = isFilled
            ? {
                delay: entryDelay,
                opacity: { duration: 0.35, ease: "easeOut" },
                y: { duration: 0.62, ease: [0.24, 0.82, 0.21, 0.99] },
                rotate: {
                  duration: 1.1,
                  ease: [0.24, 0.82, 0.21, 0.99],
                  times: [0, 0.3, 0.55, 0.75, 0.9, 1],
                },
              }
            : {
                delay: entryDelay,
                opacity: { duration: 0.28, ease: "easeOut" },
                y: { duration: 0.42, ease: [0.33, 1, 0.68, 1] },
              };

          return (
            <motion.li
              key={slotKey}
              className={`hud-feather-rack__slot ${isFilled ? "is-filled" : "is-empty"}`}
              initial={initialState}
              animate={animateState}
              transition={transition}
              style={{ transformOrigin: "50% 10px" }}
            >
              <span className="hud-feather-rack__pin" aria-hidden="true" />
              <div
                className="hud-feather-rack__pendant"
                aria-hidden={!isFilled}
                data-filled={isFilled ? "true" : "false"}
              >
                {isFilled ? <FeatherIcon /> : null}
              </div>
            </motion.li>
          );
        })}
      </ul>
    </article>
  );
};

export default FeatherRack;
