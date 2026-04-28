import { motion } from "framer-motion";
import type { ReturningItemState } from "../types";
import { SharedItemBall } from "./shared-item-ball";

interface ReturningItemDomProps {
  returningItem: ReturningItemState;
  onComplete: () => void;
}

export function ReturningItemDom({ returningItem, onComplete }: ReturningItemDomProps) {
  if (!returningItem) return null;
  const { item, startPos, endPos } = returningItem;

  return (
    <motion.div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 9998,
        pointerEvents: "none",
        overflow: "hidden",
      }}
      initial={{ 
        x: startPos.x, 
        y: startPos.y,
        translateX: "-50%",
        translateY: "-50%",
        width: 90,
        height: 90,
        borderRadius: "50%",
        opacity: 0,
      }}
      animate={{ 
        x: endPos.x, 
        y: endPos.y,
        width: 90,
        height: 90,
        borderRadius: "50%",
        opacity: 1,
      }}
      transition={{
        x: { type: "spring", stiffness: 300, damping: 28, mass: 0.8 },
        y: { type: "spring", stiffness: 300, damping: 28, mass: 0.8 },
      }}
      onAnimationComplete={onComplete}
    >
      <SharedItemBall item={item} />
    </motion.div>
  );
}
