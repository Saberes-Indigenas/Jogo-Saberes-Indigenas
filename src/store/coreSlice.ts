import type { GameStoreCreator } from "./types";
import { DEFAULT_MAX_ROUNDS } from "../config/gameSession";
import { COLORS } from "../config/colors";

export const createCoreSlice: GameStoreCreator<import("./types").CoreSlice> = (set, get) => ({
  clans: [],
  initialItems: [],
  layout: {
    gameAreaWidth: 0,
    gameAreaHeight: 0,
    centroX: 0,
    centroY: 0,
    raioPalco: 0,
  },
  clanTargets: {},

  score: 0,
  streak: 0,
  maxStreak: 0,
  featherCount: 0,
  completedCount: 0,
  completedByColor: { red: 0, black: 0 },

  isGameOver: false,
  maxRounds: DEFAULT_MAX_ROUNDS,
  currentRound: 0,
  sessionTotalItems: 0,
  sessionTotalByColor: { red: 0, black: 0 },
  
  maxFeatherCapacity: 0,
  maxUrucumSeeds: 0,

  recentDeliveries: {},
  resetClanAnimationsKey: 0,

  setGameData: (clans, initialItems) => {
    set({ clans, initialItems });
  },

  setLayout: (layout) => {
    set({ layout });
    get().recalculateClanTargets();
  },

  recalculateClanTargets: () => {
    const { clans, initialItems, layout } = get();
    if (clans.length === 0 || initialItems.length === 0 || layout.raioPalco === 0) return;

    const newTargets: { [key: string]: { x: number; y: number } } = {};
    const targetRingRadius = layout.raioPalco * 0.75;
    
    const tugoaregeClans = clans.filter(
      (c) => initialItems.find((i) => i.correct_clan_id === c.id)?.color === COLORS.CLAN_TUGOAREGE
    );
    const eceraeClans = clans.filter(
      (c) => initialItems.find((i) => i.correct_clan_id === c.id)?.color === COLORS.CLAN_ECERAE
    );

    tugoaregeClans.forEach((clan, index) => {
      const angle = ((index + 1) / (tugoaregeClans.length + 1)) * Math.PI - Math.PI / 2;
      newTargets[clan.id] = {
        x: layout.centroX + targetRingRadius * Math.cos(angle),
        y: layout.centroY + targetRingRadius * Math.sin(angle),
      };
    });
    
    eceraeClans.forEach((clan, index) => {
      const angle = ((index + 1) / (eceraeClans.length + 1)) * Math.PI + Math.PI / 2;
      newTargets[clan.id] = {
        x: layout.centroX + targetRingRadius * Math.cos(angle),
        y: layout.centroY + targetRingRadius * Math.sin(angle),
      };
    });

    set({ clanTargets: newTargets });
  },
});
