/* Arquivo: src/components/GameModals.tsx */

import { motion, AnimatePresence } from "framer-motion";
import "../css/GameModal.css";

// A interface agora espera o tipo da mensagem
interface GameModalsProps {
  isGameOver: boolean;
  isMessageVisible: boolean;
  message: string;
  messageType: "success" | "error" | "roundComplete"; // Tipos possíveis
  score: number;
  feathers: number;
  maxStreak: number;
  completed: number;
  total: number;
}

// Variantes de animação (sem alterações)
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

// O componente agora recebe 'messageType' via props
const GameModals = ({
  isGameOver,
  isMessageVisible,
  message,
  messageType,
  score,
  feathers,
  maxStreak,
  completed,
  total,
}: GameModalsProps) => {
  return (
    <AnimatePresence>
      {/* Mensagem de Feedback */}
      {isMessageVisible && (
        <motion.div
          // A classe é construída dinamicamente para aplicar o estilo correto
          className={`feedbackMessage ${messageType}`}
          variants={feedbackVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {message}
        </motion.div>
      )}

      {/* Tela de Fim de Jogo */}
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
              Você restaurou a ordem de todos os clãs! Compartilhe o que aprendeu com sua
              aldeia.
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
