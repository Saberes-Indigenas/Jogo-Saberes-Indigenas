import { motion } from "framer-motion";
import type { Item } from "../types";
import "./LearningCard.css";

// Ícones simples para representar as metades. Substitua por SVGs mais elaborados se desejar.
const TugoaregeIcon = () => (
  <svg viewBox="0 0 24 24" className="clan-symbol">
    <path d="M12 2 L2 22 L22 22 Z" fill="var(--hud-primary)" />
  </svg>
);
const EceraeIcon = () => (
  <svg viewBox="0 0 24 24" className="clan-symbol">
    <circle cx="12" cy="12" r="10" fill="var(--hud-secondary)" />
  </svg>
);

interface LearningCardProps {
  item: Item;
  layout?: "embedded" | "floating";
  className?: string;
}

const layoutMotion = {
  embedded: {
    initial: { opacity: 0, y: 12, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -8, scale: 0.98 },
  },
  floating: {
    initial: { opacity: 0, x: -60, scale: 0.9 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 40, scale: 0.9 },
  },
} as const;

const LearningCard = ({
  item,
  layout = "embedded",
  className = "",
}: LearningCardProps) => {
  const normalizedColor = item.color?.toLowerCase() ?? "";
  const ClanSymbol =
    normalizedColor.includes("#b52323") ||
    normalizedColor.includes("var(--hud-primary)")
      ? TugoaregeIcon
      : EceraeIcon;
  const motionPreset = layoutMotion[layout];
  return (
    <motion.article
      className={`learning-card learning-card--${layout} ${className}`.trim()}
      initial={motionPreset.initial}
      animate={motionPreset.animate}
      exit={motionPreset.exit}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      key={item.id}
    >
      <div
        className="learning-card__figure"
        style={{ backgroundColor: item.color }}
        aria-hidden="true"
      >
        {item.media?.image ? (
          <img src={item.media.image} alt="" loading="lazy" />
        ) : (
          <span className="learning-card__icon">{item.icon}</span>
        )}
        <div className="learning-card__aura" />
      </div>

      <div className="learning-card__content">
        <header className="learning-card__header">
          <p className="learning-card__subtitle">A Voz Ancestral</p>
          <h3 className="learning-card__name-boe">{item.name_boe}</h3>
        </header>
        <footer className="learning-card__footer">
          <ClanSymbol />
        </footer>
      </div>
    </motion.article>
  );
};

export default LearningCard;
