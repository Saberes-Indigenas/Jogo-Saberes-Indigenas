import type { GameStoreCreator } from "./types";

let feedbackTimeoutId: ReturnType<typeof setTimeout> | null = null;
let celebrationTimeoutId: ReturnType<typeof setTimeout> | null = null;

export const createUiSlice: GameStoreCreator<import("./types").UiSlice> = (set) => ({
  message: "",
  messageType: "success",
  isMessageVisible: false,
  feedbackPulse: null,
  spotlightItem: null,
  celebration: null,

  showFeedback: (msg, type, duration = 2000) => {
    if (feedbackTimeoutId) {
      clearTimeout(feedbackTimeoutId);
    }
    set({
      message: msg,
      messageType: type,
      isMessageVisible: true,
    });

    feedbackTimeoutId = setTimeout(() => {
      set({ isMessageVisible: false });
      feedbackTimeoutId = null;
    }, duration);
  },

  clearFeedbackPulse: () => {
    set({ feedbackPulse: null });
  },

  triggerCelebration: (data) => {
    set({ celebration: { ...data, id: Date.now() } });
    
    if (celebrationTimeoutId) {
      clearTimeout(celebrationTimeoutId);
    }
    celebrationTimeoutId = setTimeout(() => {
      set({ celebration: null });
      celebrationTimeoutId = null;
    }, 2800);
  },

  clearCelebration: () => {
    if (celebrationTimeoutId) {
      clearTimeout(celebrationTimeoutId);
      celebrationTimeoutId = null;
    }
    set({ celebration: null });
  },

  setSpotlightItem: (item) => {
    set({ spotlightItem: item });
  },
});
