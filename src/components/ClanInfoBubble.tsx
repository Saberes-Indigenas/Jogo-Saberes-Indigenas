import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Clan, Item } from "../types";
import "../css/ClanInfoBubble.css";

interface ActiveBubbleState {
  clan: Clan;
  items: Item[];
  anchor: { x: number; y: number };
  orientation: { vertical: "above" | "below"; horizontal: "left" | "right" };
}

interface ClanInfoBubbleProps {
  activeBubble: ActiveBubbleState | null;
  containerRect: { top: number; left: number; width: number; height: number };
  onClose: () => void;
}

const bubbleVariants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    y: 12,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 280, damping: 22 },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 18,
    transition: { duration: 0.18, ease: "easeIn" },
  },
};

const ClanInfoBubble = ({
  activeBubble,
  containerRect,
  onClose,
}: ClanInfoBubbleProps) => {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useLayoutEffect(() => {
    if (!activeBubble || !bubbleRef.current) {
      setPosition(null);
      return;
    }

    const { width, height } = bubbleRef.current.getBoundingClientRect();
    const padding = 18;
    const anchorX = containerRect.left + activeBubble.anchor.x;
    const anchorY = containerRect.top + activeBubble.anchor.y;
    const verticalGap = 32;
    const horizontalOffset = 34;

    let top =
      activeBubble.orientation.vertical === "above"
        ? anchorY - height - verticalGap
        : anchorY + verticalGap;
    let left =
      activeBubble.orientation.horizontal === "left"
        ? anchorX - width + horizontalOffset
        : anchorX - horizontalOffset;

    const minTop = containerRect.top + padding;
    const maxTop = containerRect.top + containerRect.height - height - padding;
    const minLeft = containerRect.left + padding;
    const maxLeft = containerRect.left + containerRect.width - width - padding;

    top = Math.min(Math.max(top, minTop), maxTop);
    left = Math.min(Math.max(left, minLeft), maxLeft);

    setPosition({ top, left });
  }, [activeBubble, containerRect]);

  useEffect(() => {
    if (!activeBubble) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handlePointer = (event: PointerEvent) => {
      if (!bubbleRef.current) return;
      if (!bubbleRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKey);
    document.addEventListener("pointerdown", handlePointer, true);

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.removeEventListener("pointerdown", handlePointer, true);
    };
  }, [activeBubble, onClose]);

  const bubbleOrientation = useMemo(() => {
    if (!activeBubble) return { vertical: "above", horizontal: "right" };
    return activeBubble.orientation;
  }, [activeBubble]);

  return (
    <div className="clan-info-layer" aria-live="polite">
      <AnimatePresence>
        {activeBubble && (
          <motion.div
            key={activeBubble.clan.id}
            ref={bubbleRef}
            className="clan-info-bubble"
            data-vertical={bubbleOrientation.vertical}
            data-horizontal={bubbleOrientation.horizontal}
            style={{
              top: position?.top ?? 0,
              left: position?.left ?? 0,
              visibility: position ? "visible" : "hidden",
            }}
            variants={bubbleVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            role="dialog"
            aria-label={`Itens guardados no clã ${activeBubble.clan.name}`}
          >
            <button
              type="button"
              className="clan-info-bubble__close"
              onClick={onClose}
              aria-label="Fechar card do clã"
            >
              ×
            </button>
            <header className="clan-info-bubble__header">
              <span className="clan-info-bubble__label">
                Guardado nesta oca
              </span>
              <h3>{activeBubble.clan.name}</h3>
            </header>
            <ul className="clan-info-bubble__list">
              {activeBubble.items.map((item) => (
                <li key={item.id} className="clan-info-bubble__item">
                  <span
                    className="clan-info-bubble__icon"
                    style={{ backgroundColor: item.color }}
                    aria-hidden="true"
                  >
                    {item.media?.image ? (
                      <img src={item.media.image} alt="" loading="lazy" />
                    ) : (
                      item.icon
                    )}
                  </span>
                  <div className="clan-info-bubble__item-text">
                    <strong>{item.name_boe}</strong>
                    <span>{item.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClanInfoBubble;
