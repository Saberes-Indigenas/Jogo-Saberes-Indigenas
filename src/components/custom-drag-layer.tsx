import { useEffect, memo } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/useGameStore";
import { SharedItemBall } from "./shared-item-ball";
import "../css/CustomDragLayer.css";

export const CustomDragLayer = memo(function CustomDragLayer() {
  const draggedItemInfo = useGameStore((s) => s.draggedItemInfo);

  const x = useMotionValue(0);
  const y = useMotionValue(0);


  const springConfig = { damping: 35, stiffness: 500, mass: 0.5 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  useEffect(() => {
    if (!draggedItemInfo) return;

    x.set(draggedItemInfo.initialMousePos.x);
    y.set(draggedItemInfo.initialMousePos.y);

    function handleUpdate(e: MouseEvent | DragEvent) {
      if (e.clientX === 0 && e.clientY === 0) return; // Ignore invalid 0,0 events from some browsers
      x.set(e.clientX);
      y.set(e.clientY);
    }

    window.addEventListener("mousemove", handleUpdate, { passive: true });
    window.addEventListener("dragover", handleUpdate, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", handleUpdate);
      window.removeEventListener("dragover", handleUpdate);
    };
  }, [draggedItemInfo, x, y]);

  return (
    <div className="custom-drag-layer">
      <AnimatePresence>
        {draggedItemInfo && (
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
            }}
            initial={{
              width: draggedItemInfo.initialRect.width,
              height: draggedItemInfo.initialRect.height,
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
            <SharedItemBall item={draggedItemInfo.item} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
