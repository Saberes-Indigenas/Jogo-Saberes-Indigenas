import type { GameStoreCreator } from "./types";
import { shuffleArray, getDistance, getColorKey } from "./utils";
import { soundManager } from "../utils/soundManager";
import {
  DEFAULT_MAX_ROUNDS,
  FEATHER_REWARD_MULTIPLIER,
  FEATHER_STREAK_REQUIREMENT,
  URUCUM_SEED_BASE_REWARD,
  calculateMaxUrucumSeeds,
  getFeatherCapacity,
} from "../config/gameSession";
import type { Item, Clan } from "../types";

// Helper for pronunciation play
const playPronunciation = (item: Item) => {
  const audioSource = item.media?.audio;
  if (!audioSource) return;

  const audio = new Audio();
  audio.src = audioSource;
  audio.currentTime = 0;
  audio.play().catch((error) => {
    console.warn("Não foi possível reproduzir o áudio do item", error);
  });
};

export const createDragDropSlice: GameStoreCreator<import("./types").DragDropSlice> = (set, get) => ({
  remainingItemsByClan: new Map(),
  clanInventories: new Map(),
  menuItems: [],
  enteringOfferings: [],

  draggingItemId: null,
  draggedItemInfo: null,
  hoveredClanId: null,
  returningItem: null,

  initGameSession: () => {
    const { initialItems } = get();
    if (initialItems.length === 0) return;

    const itemsByClan = new Map<string, Item[]>();
    initialItems.forEach((item) => {
      const clanItems = itemsByClan.get(item.correct_clan_id) || [];
      clanItems.push(item);
      itemsByClan.set(item.correct_clan_id, clanItems);
    });

    itemsByClan.forEach((items, clanId) => {
      itemsByClan.set(clanId, shuffleArray(items));
    });

    const filteredItemsByClan = new Map(
      [...itemsByClan].filter(([, items]) => items.length > 0)
    );

    if (filteredItemsByClan.size === 0) {
      set({ isGameOver: true });
      return;
    }

    const roundsAvailable = Math.min(
      DEFAULT_MAX_ROUNDS,
      ...Array.from(filteredItemsByClan.values()).map((items) => items.length)
    );

    if (roundsAvailable === 0) {
      set({ isGameOver: true });
      return;
    }

    const preparedItemsByClan = new Map<string, Item[]>();
    const totalsByColor = { red: 0, black: 0 };

    filteredItemsByClan.forEach((items, clanId) => {
      const selected = items.slice(0, roundsAvailable);
      preparedItemsByClan.set(clanId, selected);
      selected.forEach((item) => {
        const key = getColorKey(item.color);
        totalsByColor[key] += 1;
      });
    });

    const totalForSession = roundsAvailable * preparedItemsByClan.size;
    const initialInventory = new Map<string, Item[]>();
    preparedItemsByClan.forEach((_, clanId) => {
      initialInventory.set(clanId, []);
    });

    set({
      sessionTotalItems: totalForSession,
      sessionTotalByColor: totalsByColor,
      maxRounds: roundsAvailable,
      completedByColor: { red: 0, black: 0 },
      clanInventories: initialInventory,
      remainingItemsByClan: preparedItemsByClan,
      currentRound: 0,
      maxFeatherCapacity: getFeatherCapacity(totalForSession),
      maxUrucumSeeds: calculateMaxUrucumSeeds(totalForSession),
    });

    get().loadNextBatch(preparedItemsByClan, 1);
  },

  loadNextBatch: (currentItemsByClan, nextRound) => {
    const newBatch: Item[] = [];
    const newRemainingMap = new Map<string, Item[]>();
    let canCreateNextBatch = true;
    
    const { setSpotlightItem } = get();

    currentItemsByClan.forEach((items, clanId) => {
      const itemsQueue = [...items];
      if (itemsQueue.length === 0) {
        canCreateNextBatch = false;
        newRemainingMap.set(clanId, itemsQueue);
        return;
      }
      const nextItem = itemsQueue.shift();
      if (nextItem) {
        newBatch.push(nextItem);
      }
      newRemainingMap.set(clanId, itemsQueue);
    });

    if (!canCreateNextBatch || newBatch.length === 0) {
      set({ isGameOver: true });
      return;
    }

    set((state) => ({
      menuItems: shuffleArray(newBatch),
      remainingItemsByClan: newRemainingMap,
      currentRound: typeof nextRound === "number" ? nextRound : state.currentRound + 1
    }));
    
    setSpotlightItem(null);
  },

  handleDragStart: (e, item, initialRect) => {
    soundManager.playDragStart();
    set({
      draggingItemId: item.id,
      draggedItemInfo: { 
        item, 
        initialRect,
        initialMousePos: { x: e.clientX, y: e.clientY }
      },
    });
  },

  handleDragEnd: () => {
    if (get().draggedItemInfo) {
      soundManager.playDragEnd();
    }
    set({ draggingItemId: null, draggedItemInfo: null, hoveredClanId: null });
  },

  handleDragOver: (e, stageRect) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "move";
    }

    const state = get();
    if (!state.draggedItemInfo) return;

    const pointerPos = {
      x: e.clientX - stageRect.left,
      y: e.clientY - stageRect.top,
    };

    let nearestClanId: string | null = null;
    let minDist = Infinity;
    const threshold = state.layout.raioPalco * 0.25;

    Object.keys(state.clanTargets).forEach((clanId) => {
      const targetPos = state.clanTargets[clanId];
      if (targetPos) {
        const d = getDistance(pointerPos, targetPos);
        if (d < minDist) {
          minDist = d;
          nearestClanId = clanId;
        }
      }
    });

    const finalHoverId = minDist < threshold ? nearestClanId : null;
    if (state.hoveredClanId !== finalHoverId) {
      set({ hoveredClanId: finalHoverId });
    }
  },

  onReturnAnimationComplete: () => {
    set({ returningItem: null, draggingItemId: null });
  },

  registerOfferingArrival: (entryKey, clanId, item) => {
    set((state) => {
      const remainingOfferings = state.enteringOfferings.filter(
        (o) => o.key !== entryKey
      );
      const newInventories = new Map(state.clanInventories);
      const existing = newInventories.get(clanId) || [];
      newInventories.set(clanId, [...existing, item]);
      
      return {
        enteringOfferings: remainingOfferings,
        clanInventories: newInventories,
        recentDeliveries: { ...state.recentDeliveries, [clanId]: Date.now() },
      };
    });
  },

  clearClanDisplays: () => {
    set((state) => {
      const cleared = new Map<string, Item[]>();
      state.clanInventories.forEach((_, clanId) => {
        cleared.set(clanId, []);
      });
      return {
        enteringOfferings: [],
        clanInventories: cleared,
        recentDeliveries: {},
        resetClanAnimationsKey: state.resetClanAnimationsKey + 1,
      };
    });
  },

  handleDrop: (e, stageRect) => {
    e.preventDefault();
    const state = get();
    if (!state.draggedItemInfo) return;

    const { item, initialRect } = state.draggedItemInfo;

    const pointerPos = {
      x: e.clientX - stageRect.left,
      y: e.clientY - stageRect.top,
    };

    const dropPos = {
      x: Math.min(Math.max(pointerPos.x, 0), stageRect.width),
      y: Math.min(Math.max(pointerPos.y, 0), stageRect.height),
    };

    const findNearestClan = (pos: { x: number; y: number }): Clan | null => {
      let nearestClan: Clan | null = null;
      let minDist = Infinity;
      Object.keys(state.clanTargets).forEach((clanId) => {
        const clan = state.clans.find(c => c.id === clanId);
        const targetPos = state.clanTargets[clanId];
        if (clan && targetPos) {
          const d = getDistance(pos, targetPos);
          if (d < minDist) {
            minDist = d;
            nearestClan = clan;
          }
        }
      });
      return minDist < state.layout.raioPalco * 0.2 ? nearestClan : null;
    };

    const targetClan = findNearestClan(dropPos);

    if (targetClan && item.correct_clan_id === targetClan.id) {
      // SUCCESS LOGIC
      const newStreak = state.streak + 1;
      const earnedSeeds =
        URUCUM_SEED_BASE_REWARD *
        Math.pow(FEATHER_REWARD_MULTIPLIER, Math.max(state.featherCount, 0));
        
      const colorKey = getColorKey(item.color);

      set((s) => ({
        score: s.score + earnedSeeds,
        streak: newStreak,
        maxStreak: Math.max(s.maxStreak, newStreak),
        completedCount: s.completedCount + 1,
        completedByColor: {
          ...s.completedByColor,
          [colorKey]: Math.min(s.completedByColor[colorKey] + 1, s.sessionTotalByColor[colorKey]),
        },
      }));

      soundManager.playSuccess();
      state.showFeedback(`Você conectou ${item.name_boe} ao clã ${targetClan.name}!`, "success", 1800);
      
      const targetCenterPos = state.clanTargets[targetClan.id];
      const globalStartPos = { x: e.clientX, y: e.clientY };
      const globalEndPos = {
        x: stageRect.left + targetCenterPos.x,
        y: stageRect.top + targetCenterPos.y,
      };

      set((s) => ({
        feedbackPulse: { ...targetCenterPos, color: "correct", key: Date.now() },
        enteringOfferings: [
          ...s.enteringOfferings,
          {
            key: Date.now(),
            clanId: targetClan.id,
            item,
            startPos: dropPos,
            endPos: targetCenterPos,
            globalStartPos,
            globalEndPos,
          },
        ]
      }));

      state.setSpotlightItem({ ...item });
      
      // Auto clear spotlight timer using internal logic, we can just use setTimeout here.
      setTimeout(() => {
         const currentSpot = get().spotlightItem;
         if (currentSpot && currentSpot.id === item.id) {
           get().setSpotlightItem(null);
         }
      }, 5000);

      playPronunciation(item);

      // Feather logic
      if (newStreak > 0 && newStreak % FEATHER_STREAK_REQUIREMENT === 0) {
        let hasGainedFeather = false;
        set((s) => {
          const tentativeCount = s.featherCount + 1;
          const cappedCount = s.maxFeatherCapacity > 0 ? Math.min(tentativeCount, s.maxFeatherCapacity) : tentativeCount;
          hasGainedFeather = cappedCount > s.featherCount;
          return { featherCount: cappedCount };
        });
        
        if (hasGainedFeather) {
          soundManager.playFeather();
          state.triggerCelebration({
            icon: "🪶",
            label: "Você ganhou uma Pluma do Conhecimento!",
            accentColor: "#ffe082",
          });
        }
      } else if (newStreak === 1) {
        state.triggerCelebration({
          icon: "🔥",
          label: "Sequência iniciada! Continue firme!",
          accentColor: "#ffb74d",
        });
      }

      const newMenuItems = state.menuItems.filter((i) => i.id !== item.id);
      set({ menuItems: newMenuItems, draggingItemId: null });

      // Check if round is over
      if (newMenuItems.length === 0) {
        const hasRemainingItems = Array.from(state.remainingItemsByClan.values()).some(
          (arr) => arr.length > 0
        );
        
        if (hasRemainingItems) {
          get().clearClanDisplays();
          const finishedRound = Math.min(state.currentRound, state.maxRounds);
          const upcomingRound = Math.min(state.currentRound + 1, state.maxRounds);
          soundManager.playRoundComplete();
          state.showFeedback(`Rodada ${finishedRound} concluída! Prepare-se para novos desafios.`, "roundComplete", 2500);
          
          setTimeout(() => {
            get().loadNextBatch(get().remainingItemsByClan, upcomingRound);
          }, 2500);
        } else {
          get().clearClanDisplays();
          state.triggerCelebration({
            icon: "🌈",
            label: "Você reuniu todo o círculo sagrado!",
            accentColor: "#b39ddb",
          });
          soundManager.playGameOver();
          set({ currentRound: state.maxRounds });
          setTimeout(() => set({ isGameOver: true }), 500);
        }
      }

    } else {
      // ERROR LOGIC
      if (state.streak > 2) {
        state.triggerCelebration({
          icon: "💧",
          label: "Respire fundo e tente novamente!",
          accentColor: "#80cbc4",
        });
      }
      soundManager.playError();
      set({ streak: 0 });
      state.showFeedback("Incorreto. Observe as cores do clã e tente novamente.", "error", 1600);
      set({
        feedbackPulse: { ...dropPos, color: "incorrect", key: Date.now() },
      });

      const globalStartPos = { x: e.clientX, y: e.clientY };
      const globalEndPos = {
        x: initialRect.left + initialRect.width / 2,
        y: initialRect.top + initialRect.height / 2,
      };
      
      set({ 
        returningItem: { 
          item, 
          startPos: globalStartPos, 
          endPos: globalEndPos, 
          initialRect 
        } 
      });
    }
    
    set({ draggedItemInfo: null, hoveredClanId: null });
  },
});
