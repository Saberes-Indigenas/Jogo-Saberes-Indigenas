import { motion, AnimatePresence } from "framer-motion";

interface GameModalsProps {
  isGameOver: boolean;
  isMessageVisible: boolean;
  message: string;
}

const GameModals = ({
  isGameOver,
  isMessageVisible,
  message,
}: GameModalsProps) => {
  return (
    <AnimatePresence>
      {isMessageVisible && (
        <motion.div className="feedback-message" /* ... */>
          {message}
        </motion.div>
      )}
      {isGameOver && (
        <motion.div className="game-over-screen" /* ... */>
          <h1>Parabéns!</h1>
          <p>Você restaurou a ordem de todos os clãs!</p>
          <button onClick={() => window.location.reload()}>
            Jogar Novamente
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameModals;
