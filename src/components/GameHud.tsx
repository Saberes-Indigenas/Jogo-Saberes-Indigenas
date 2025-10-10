import { motion } from "framer-motion";
import "../css/GameHud.css";

interface GameHudProps {
  score: number;
  streak: number;
  maxStreak: number;
  feathers: number;
  completed: number;
  total: number;
}

const GameHud = ({
  score,
  streak,
  maxStreak,
  feathers,
  completed,
  total,
}: GameHudProps) => {
  const progress = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;

  return (
    <div className="hud-root" aria-live="polite">
      <motion.section
        className="hud-panel"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <header className="hud-panel__header">
          <h2>Jornada Bororo</h2>
          <p>Complete o círculo sagrado arrastando cada ser para o clã correto.</p>
        </header>
        <div className="hud-panel__stats">
          <div className="hud-stat hud-stat--score">
            <span className="hud-stat__label">Pontos Totais</span>
            <strong className="hud-stat__value">{score.toLocaleString("pt-BR")}</strong>
          </div>
          <div className="hud-stat">
            <span className="hud-stat__label">Sequência Atual</span>
            <strong className="hud-stat__value">{streak}</strong>
          </div>
          <div className="hud-stat">
            <span className="hud-stat__label">Maior Sequência</span>
            <strong className="hud-stat__value">{maxStreak}</strong>
          </div>
          <div className="hud-stat hud-stat--reward">
            <span className="hud-stat__label">Plumas do Conhecimento</span>
            <strong className="hud-stat__value">{feathers}</strong>
          </div>
        </div>
        <div className="hud-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="hud-progress__label">
            <span>Progresso</span>
            <span>
              {completed}/{total}
            </span>
          </div>
          <div className="hud-progress__track">
            <motion.span
              className="hud-progress__value"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 180, damping: 18 }}
            />
          </div>
        </div>
        <footer className="hud-panel__footer">
          <p>
            Dica: observe as cores e símbolos de cada clã. Ao acertar, fale em voz alta o
            nome em Bororo para praticar a pronúncia!
          </p>
        </footer>
      </motion.section>
    </div>
  );
};

export default GameHud;
