import { useMemo } from "react";
import { motion } from "framer-motion";


import { FeatherIcon } from "./hud-icons";

import "../../css/FeatherRack.css";

interface FeatherRackProps {
  feathers: number;
  maxFeathers: number;
}

export function FeatherRack({ feathers, maxFeathers }: FeatherRackProps) {
  const totalSlots = useMemo(
    () => Math.max(Math.floor(maxFeathers), 0),
    [maxFeathers]
  );
  const displaySlots = useMemo(
    () => Math.max(totalSlots, 1),
    [totalSlots]
  );
  const filledSlots = Math.min(Math.max(feathers, 0), totalSlots);
  const slots = useMemo(
    () => Array.from({ length: displaySlots }),
    [displaySlots]
  );

  return (
    <article
      className="hud-module--feather-rack"
      aria-label={`Painel de plumas: ${filledSlots} de ${totalSlots}`}
    >
      <ul
        className="hud-feather-rack__slots"
        role="list"
        aria-label="Plumas conquistadas até agora"
      >
        {slots.map((_, index) => {
          const isFilled = index < filledSlots;
          const slotKey = `feather-slot-${index}-${
            isFilled ? "filled" : "empty"
          }`;
          const entryDelay = 0.18 + index * 0.06;
          
          const initialState = isFilled
            ? { opacity: 0, y: -25, rotate: 135 }
            : { opacity: 0.12, y: 0, rotate: 180 };
            
          const animateState = isFilled
            ? { opacity: 1, y: 0, rotate: [135, 240, 130, 215, 155, 195, 172, 185, 180] }
            : { opacity: 0.12, y: 0, rotate: 180 };
            
          const transition = isFilled
            ? {
                delay: entryDelay,
                opacity: { duration: 0.45, ease: "easeOut" },
                y: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
                rotate: {
                  duration: 1.8,
                  ease: "easeOut",
                  times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.85, 0.95, 1],
                },
              }
            : {
                delay: entryDelay,
                opacity: { duration: 0.28 },
              };

          return (
            <motion.li
              key={slotKey}
              className={`hud-feather-rack__slot ${
                isFilled ? "is-filled" : "is-empty"
              }`}
              initial={initialState}
              animate={animateState}
              transition={transition}
              style={{ transformOrigin: "50% 5px" }}
            >
              <FeatherIcon />
            </motion.li>
          );
        })}
      </ul>
    </article>
  );
}
