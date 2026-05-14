/* Arquivo: src/components/sound-toggle.tsx */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { soundManager } from "../utils/soundManager";
import "../css/SoundToggle.css";

export function SoundToggle() {
  const [isMuted, setIsMuted] = useState(soundManager.isMuted());
  const [volume, setVolume] = useState(soundManager.getVolume());
  const [isOpen, setIsOpen] = useState(false);

  // Garante sincronia inicial com o localStorage/gerenciador
  useEffect(() => {
    setIsMuted(soundManager.isMuted());
    setVolume(soundManager.getVolume());
  }, []);

  const handleToggleMute = () => {
    // Se estiver fechado, apenas abre. Se estiver aberto, muta/desmuta.
    if (!isOpen) {
      setIsOpen(true);
      return;
    }

    const newMuted = !isMuted;
    soundManager.setMuted(newMuted);
    setIsMuted(newMuted);
    
    if (!newMuted) {
      soundManager.playClick();
      soundManager.startAmbient();
      if (volume === 0) {
        soundManager.setVolume(0.5);
        setVolume(0.5);
      }
    } else {
      soundManager.stopAmbient();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    soundManager.setVolume(newVolume);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    
    if (newVolume > 0) {
      soundManager.startAmbient();
    } else {
      soundManager.stopAmbient();
    }
  };

  return (
    <div className={`sound-toggle-container ${isOpen ? "is-open" : ""}`}>
      <motion.button
        type="button"
        onClick={handleToggleMute}
        className={`sound-toggle-button ${isMuted ? "muted" : ""}`}
        aria-label={isMuted ? "Ativar som do jogo" : "Silenciar som do jogo"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isMuted ? (
            <motion.svg
              key="muted"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </motion.svg>
          ) : (
            <motion.svg
              key="playing"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              {volume > 0.6 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="volume-slider-wrapper"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 120, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="volume-slider"
              aria-label="Volume"
            />
            
            <button 
              className="sound-close-btn" 
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!isMuted && volume > 0 && !isOpen && (
        <motion.div 
          className="sound-waves"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          exit={{ opacity: 0 }}
        >
          <div className="sound-wave-bar" />
          <div className="sound-wave-bar" />
          <div className="sound-wave-bar" />
        </motion.div>
      )}
    </div>
  );
}


