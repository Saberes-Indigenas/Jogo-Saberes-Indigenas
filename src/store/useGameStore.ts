import { create } from "zustand";
import type { GameStore } from "./types";
import { createCoreSlice } from "./coreSlice";
import { createUiSlice } from "./uiSlice";
import { createDragDropSlice } from "./dragDropSlice";

export const useGameStore = create<GameStore>((...args) => ({
  ...createCoreSlice(...args),
  ...createUiSlice(...args),
  ...createDragDropSlice(...args),
}));
