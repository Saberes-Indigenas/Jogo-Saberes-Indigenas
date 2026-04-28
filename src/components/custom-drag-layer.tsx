import { useEffect, memo } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/useGameStore";
import { SharedItemBall } from "./shared-item-ball";
import "../css/CustomDragLayer.css";

/**
 * Sub-component to manage its own springs and motion values.
 * This prevents the "memory" effect where the ball flies in from the last drag position.
 */
const DragPreview = ({ itemInfo }: { itemInfo: any }) => {
  // Initialize with the current mouse position to avoid jumps
  const x = useMotionValue(itemInfo.initialMousePos.x);
  const y = useMotionValue(itemInfo.initialMousePos.y);

  const springConfig = { damping: 35, stiffness: 500, mass: 0.5 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  useEffect(() => {
    function handleUpdate(e: MouseEvent | DragEvent) {
      if (e.clientX === 0 && e.clientY === 0) return;
      x.set(e.clientX);
      y.set(e.clientY);
    }

    window.addEventListener("mousemove", handleUpdate, { passive: true });
    window.addEventListener("dragover", handleUpdate, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", handleUpdate);
      window.removeEventListener("dragover", handleUpdate);
    };
  }, [x, y]);

  return (
    <motion.div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        x: smoothX,
        y: smoothY,
        translateX: "-50%",
        translateY: "-50%",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 1000,
      }}
      initial={{
        width: itemInfo.initialRect.width,
        height: itemInfo.initialRect.height,
        borderRadius: "28px",
        opacity: 0,
      }}
      animate={{
        width: 90,
        height: 90,
        borderRadius: "50%",
        opacity: 1,
      }}
      exit={{
        scale: 0,
        opacity: 0,
        transition: { duration: 0.15 }
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30
      }}
    >
      <SharedItemBall item={itemInfo.item} />
    </motion.div>
  );
};

export const CustomDragLayer = memo(function CustomDragLayer() {
  const draggedItemInfo = useGameStore((s) => s.draggedItemInfo);

  return (
    <div className="custom-drag-layer">
      <AnimatePresence mode="wait">
        {draggedItemInfo && (
          <DragPreview 
            key={draggedItemInfo.item.id} 
            itemInfo={draggedItemInfo} 
          />
        )}
      </AnimatePresence>
    </div>
  );
});
