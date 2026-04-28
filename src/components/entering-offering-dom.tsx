import { motion } from "framer-motion";
import type { EnteringOffering } from "../store/types";
import { SharedItemBall } from "./shared-item-ball";

interface EnteringOfferingDomProps {
  offering: EnteringOffering;
  onComplete: (offering: EnteringOffering) => void;
}

export function EnteringOfferingDom({ offering, onComplete }: EnteringOfferingDomProps) {
  const { item, globalStartPos, globalEndPos } = offering;

  const dx = globalEndPos.x - globalStartPos.x;
  const dy = globalEndPos.y - globalStartPos.y;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <motion.div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 9999,
        pointerEvents: "none",
        width: 90,
        height: 90,
      }}
      initial={{ 
        x: globalStartPos.x, 
        y: globalStartPos.y,
        translateX: "-50%",
        translateY: "-50%",
        scale: 0,
        opacity: 0,
      }}
      animate={{ 
        x: [globalStartPos.x, globalStartPos.x, globalEndPos.x],
        y: [globalStartPos.y, globalStartPos.y, globalEndPos.y],
        scale: [0, 1.2, 1.1, 0.6, 0],
        rotate: [0, angle, angle, angle, angle],
        opacity: [0, 1, 1, 1, 0],
      }}
      transition={{
        duration: 0.85,
        times: [0, 0.2, 0.35, 0.8, 1],
        ease: ["backOut", "linear", "circIn", "easeOut"]
      }}
      onAnimationComplete={() => onComplete(offering)}
    >
      <motion.div
        animate={{ 
          rotate: [0, -angle, -angle, -angle, -angle],
          scaleX: [1, 1, 1.25, 1.1, 0.8],
          scaleY: [1, 1, 0.85, 0.95, 1.2],
        }}
        transition={{
          duration: 0.85,
          times: [0, 0.2, 0.35, 0.8, 1],
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <SharedItemBall item={item} />
      </motion.div>
    </motion.div>
  );
}
