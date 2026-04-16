import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/useGameStore";
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

const GameModals = () => {
  const isGameOver = useGameStore(s => s.isGameOver);
  const isMessageVisible = useGameStore(s => s.isMessageVisible);
  const message = useGameStore(s => s.message);
  const messageType = useGameStore(s => s.messageType);
  const score = useGameStore(s => s.score);
  const feathers = useGameStore(s => s.featherCount);
  const maxStreak = useGameStore(s => s.maxStreak);
  const completed = useGameStore(s => s.completedCount);
  const total = useGameStore(s => s.sessionTotalItems);
  const currentRound = useGameStore(s => s.currentRound);
  const maxRounds = useGameStore(s => s.maxRounds);

  const displayMaxRounds = Math.max(maxRounds, 1);
  const displayCompletedRounds = Math.min(
    currentRound > 0 ? currentRound : displayMaxRounds,
    displayMaxRounds
  );

  return (
    <AnimatePresence>
      {isMessageVisible && (
        <motion.div
          className={`feedbackMessage ${messageType}`}
          variants={feedbackVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {message}
        </motion.div>
      )}

      {isGameOver && (
        <motion.div
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
            <motion.h1
              whileHover={{ scale: 1.05, rotate: [0, -2, 2, -2, 0] }}
              transition={{ duration: 0.5 }}
            >
              🎉 Parabéns! 🎉
            </motion.h1>
            <motion.p>
              Você concluiu as {maxRounds} rodadas do ritual Bororo! Compartilhe
              o que aprendeu com sua aldeia.
            </motion.p>
            <motion.ul
              className="gameOverStats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <li>
                <span>Total de pontos</span>
                <strong>{score.toLocaleString("pt-BR")}</strong>
              </li>
              <li>
                <span>Rodadas concluídas</span>
                <strong>
                  {displayCompletedRounds}/{displayMaxRounds}
                </strong>
              </li>
              <li>
                <span>Plumas conquistadas</span>
                <strong>{feathers}</strong>
              </li>
              <li>
                <span>Maior sequência</span>
                <strong>{maxStreak}</strong>
              </li>
              <li>
                <span>Itens conectados</span>
                <strong>
                  {completed}/{total}
                </strong>
              </li>
            </motion.ul>
            <motion.button
              onClick={() => window.location.reload()}
              whileHover={{ scale: 1.1, rotate: -2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Jogar Novamente
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameModals;
