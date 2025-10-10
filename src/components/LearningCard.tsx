import { AnimatePresence, motion } from "framer-motion";
import type { Item } from "../types";
import "../css/LearningCard.css";

interface LearningCardProps {
  item: Item | null;
  streak: number;
  feathers: number;
}

const LearningCard = ({ item, streak, feathers }: LearningCardProps) => {
  return (
    <AnimatePresence>
      {item && (
        <motion.article
          key={item.id}
          className="learning-card"
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
        >
          <div className="learning-card__figure" aria-hidden="true">
            {item.media?.image ? (
              <img src={item.media.image} alt="" loading="lazy" />
            ) : (
              <span className="learning-card__icon">{item.icon}</span>
            )}
            <div className="learning-card__aura" />
          </div>
          <div className="learning-card__content">
            <header>
              <p className="learning-card__subtitle">Como dizer em Bororo</p>
              <h3>{item.name_boe}</h3>
              <p className="learning-card__translation">Em português: {item.name}</p>
            </header>
            <p className="learning-card__clan">Clã guardião: {item.clan}</p>
            <p className="learning-card__tip">
              Repita em voz alta, bata palmas no ritmo e conte o que esse ser representa para o
              seu povo!
            </p>
            <footer className="learning-card__footer">
              <span>Sequência: {streak}</span>
              <span>Plumas: {feathers}</span>
            </footer>
          </div>
        </motion.article>
      )}
    </AnimatePresence>
  );
};

export default LearningCard;
