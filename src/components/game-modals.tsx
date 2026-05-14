import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/useGameStore";
import { RewardCelebration } from "./reward-celebration";
import "../css/GameModal.css";

const feedbackVariants = {
  initial: { y: -100, scale: 0.5, rotate: 15, opacity: 0 },
  animate: {
    y: 0,
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 400, damping: 15 },
  },
  exit: {
    y: -50,
    scale: 0,
    rotate: -15,
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

const gameOverScreenVariants = {
  initial: { opacity: 0, backdropFilter: "blur(0px)" },
  animate: {
    opacity: 1,
    backdropFilter: "blur(8px)",
    transition: { duration: 0.5 },
  },
  exit: {
    opacity: 0,
    backdropFilter: "blur(0px)",
    transition: { duration: 0.3 },
  },
};

const gameOverContentVariants = {
  initial: { scale: 0.3, y: 100, rotate: -10, opacity: 0 },
  animate: {
    scale: 1,
    y: 0,
    rotate: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 10,
      delay: 0.3,
    },
  },
};

export function GameModals() {
  const isGameOver = useGameStore((s) => s.isGameOver);
  const isMessageVisible = useGameStore((s) => s.isMessageVisible);
  const message = useGameStore((s) => s.message);
  const messageType = useGameStore((s) => s.messageType);
  const spotlightItem = useGameStore((s) => s.spotlightItem);
  const celebration = useGameStore((s) => s.celebration);
  const clearCelebration = useGameStore((s) => s.clearCelebration);

  console.log(`[GameModals] Render -> isGameOver: ${isGameOver}, isMessageVisible: ${isMessageVisible}, celebration: ${!!celebration}`);

  return (
    <AnimatePresence mode="wait">
      {isGameOver ? (
        <motion.div
          key="game-over-screen"
          className="gameOverScreen"
          variants={gameOverScreenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <motion.div
            className="gameOverContent"
            variants={gameOverContentVariants}
          >
            <motion.h1 whileHover={{ scale: 1.05 }}>
              Ritual Concluído
            </motion.h1>

            <motion.button
              onClick={() => window.location.reload()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Jogar Novamente
            </motion.button>
          </motion.div>
        </motion.div>
      ) : celebration ? (
        <RewardCelebration 
          key="reward-celebration"
          celebration={celebration} 
          onDismiss={clearCelebration} 
        />
      ) : isMessageVisible ? (
        <motion.div
          key="feedback-message"
          className={`feedbackMessage ${messageType}`}
          custom={messageType}
          variants={feedbackVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="feedbackMessage__shine" />
          <div className="feedbackMessage__content">
            <span className="feedbackMessage__icon">
              {messageType === "success" && spotlightItem?.media?.image ? (
                <img src={spotlightItem.media.image} alt="" style={{ width: 44, height: 44, objectFit: "contain" }} />
              ) : (
                <div className={`feedback-dot ${messageType}`} />
              )}
            </span>
            <span className="feedbackMessage__text">{message}</span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
