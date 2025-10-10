import { AnimatePresence, motion } from "framer-motion";
import type { RewardCelebration as RewardCelebrationType } from "../types";
import "../css/RewardCelebration.css";

interface RewardCelebrationProps {
  celebration: RewardCelebrationType | null;
  onDismiss: () => void;
}

const RewardCelebration = ({ celebration, onDismiss }: RewardCelebrationProps) => {
  return (
    <AnimatePresence>
      {celebration && (
        <motion.div
          key={celebration.id}
          className="reward-celebration"
          style={{ background: `linear-gradient(120deg, ${celebration.accentColor}, rgba(255,255,255,0.85))` }}
          initial={{ opacity: 0, scale: 0.5, y: -40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -40 }}
          transition={{ type: "spring", stiffness: 240, damping: 18 }}
          onClick={onDismiss}
        >
          <span className="reward-celebration__icon" aria-hidden="true">
            {celebration.icon}
          </span>
          <span className="reward-celebration__text">{celebration.label}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RewardCelebration;
