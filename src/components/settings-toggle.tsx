import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/useGameStore";
import { soundManager } from "../utils/soundManager";
import "../css/SettingsToggle.css";

export function SettingsToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  const showPortugueseName = useGameStore((s) => s.showPortugueseName);
  const showClanBadge = useGameStore((s) => s.showClanBadge);
  const toggleShowPortugueseName = useGameStore((s) => s.toggleShowPortugueseName);
  const toggleShowClanBadge = useGameStore((s) => s.toggleShowClanBadge);

  const [isMuted, setIsMuted] = useState(soundManager.isMuted());
  const [volume, setVolume] = useState(soundManager.getVolume());

  useEffect(() => {
    setIsMuted(soundManager.isMuted());
    setVolume(soundManager.getVolume());
  }, []);

  const handleToggleMute = () => {
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="settings-toggle-container">
      <motion.button
        type="button"
        className="settings-toggle-button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Abrir configurações"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="settings-modal"
            ref={modalRef}
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div className="settings-modal__inner">
              <header className="settings-modal__header">
                <h3>Configurações</h3>
              </header>
              
              <div className="settings-modal__content">
                <div className="settings-section">
                  <h4 className="settings-section__title">Visual</h4>
                  <label className="settings-option">
                    <input 
                      type="checkbox" 
                      checked={showPortugueseName} 
                      onChange={toggleShowPortugueseName} 
                    />
                    <span className="settings-option__custom-checkbox"></span>
                    <span className="settings-option__label">Nome em Português</span>
                  </label>

                  <label className="settings-option">
                    <input 
                      type="checkbox" 
                      checked={showClanBadge} 
                      onChange={toggleShowClanBadge} 
                    />
                    <span className="settings-option__custom-checkbox"></span>
                    <span className="settings-option__label">Selo do Clã</span>
                  </label>
                </div>

                <div className="settings-section">
                  <h4 className="settings-section__title">Som</h4>
                  <div className="settings-sound-controls">
                    <button 
                      className={`settings-sound-btn ${isMuted ? "is-muted" : ""}`}
                      onClick={handleToggleMute}
                    >
                      {isMuted ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          <line x1="23" y1="9" x2="17" y2="15" />
                          <line x1="17" y1="9" x2="23" y2="15" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        </svg>
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="settings-volume-slider"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
