import type { Clan, Item, RewardCelebration, PulseState, ReturningItemState, Vector2D } from "../types";
import type { StateCreator } from "zustand";

// Aux types
export type MessageType = "success" | "error" | "roundComplete";

export type EnteringOffering = {
  key: number;
  clanId: string;
  item: Item;
  startPos: { x: number; y: number };
  endPos: { x: number; y: number };
  globalStartPos: { x: number; y: number };
  globalEndPos: { x: number; y: number };
};

export type DraggedItemInfo = {
  item: Item;
  initialRect: DOMRect;
  initialMousePos: { x: number; y: number };
} | null;

export interface LayoutData {
  gameAreaWidth: number;
  gameAreaHeight: number;
  centroX: number;
  centroY: number;
  raioPalco: number;
}

// Slice 1: Core State
export interface CoreSlice {
  clans: Clan[];
  initialItems: Item[];
  layout: LayoutData;
  clanTargets: Record<string, Vector2D>;

  score: number;
  streak: number;
  maxStreak: number;
  featherCount: number;
  completedCount: number;
  completedByColor: { red: number; black: number };

  isGameOver: boolean;
  maxRounds: number;
  currentRound: number;
  sessionTotalItems: number;
  sessionTotalByColor: { red: number; black: number };

  maxFeatherCapacity: number;
  maxUrucumSeeds: number;

  recentDeliveries: Record<string, number>;
  resetClanAnimationsKey: number;

  setGameData: (clans: Clan[], items: Item[]) => void;
  setLayout: (layout: LayoutData) => void;
  recalculateClanTargets: () => void;
}

// Slice 2: UI State
export interface UiSlice {
  message: string;
  messageType: MessageType;
  isMessageVisible: boolean;
  feedbackPulse: PulseState;
  spotlightItem: Item | null;
  celebration: RewardCelebration | null;

  showFeedback: (msg: string, type: MessageType, duration?: number) => void;
  clearFeedbackPulse: () => void;
  triggerCelebration: (data: Omit<RewardCelebration, "id">) => void;
  clearCelebration: () => void;
  setSpotlightItem: (item: Item | null) => void;
}

// Slice 3: Drag Drop & Inventory State
export interface DragDropSlice {
  remainingItemsByClan: Map<string, Item[]>;
  clanInventories: Map<string, Item[]>;
  menuItems: Item[];
  enteringOfferings: EnteringOffering[];

  draggingItemId: string | null;
  draggedItemInfo: DraggedItemInfo;
  hoveredClanId: string | null;
  returningItem: ReturningItemState;

  // Actions
  initGameSession: () => void;
  loadNextBatch: (currentItemsByClan: Map<string, Item[]>, nextRound?: number) => void;

  handleDragStart: (e: React.DragEvent, item: Item, initialRect: DOMRect) => void;
  handleDragEnd: () => void;
  handleDragOver: (e: React.DragEvent, stageRect: DOMRect) => void;
  handleDrop: (e: React.DragEvent, stageRect: DOMRect) => void;

  registerOfferingArrival: (entryKey: number, clanId: string, item: Item) => void;
  onReturnAnimationComplete: () => void;
  clearClanDisplays: () => void;
}

export type GameStore = CoreSlice & UiSlice & DragDropSlice;

export type GameStoreCreator<T> = StateCreator<GameStore, [], [], T>;
