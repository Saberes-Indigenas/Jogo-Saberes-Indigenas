import { create } from "zustand";
import type { GameStore } from "./types";
import { createCoreSlice } from "./coreSlice";
import { createUiSlice } from "./uiSlice";
import { createDragDropSlice } from "./dragDropSlice";

export const useGameStore = create<GameStore>((set, get, api) => {
  const customSet = (partial: any, replace?: boolean) => {
    const prevState = get();
    (set as any)(partial, replace);
    const nextState = get();
    if (prevState.isGameOver !== nextState.isGameOver) {
      console.log(`[Store] isGameOver mudou de ${prevState.isGameOver} para ${nextState.isGameOver}`);
      if (nextState.isGameOver === false && prevState.isGameOver === true) {
        console.warn("[Store] ALERTA: isGameOver foi revertido para FALSE! Stack trace:");
        console.trace();
      }
    }
  };

  const core = createCoreSlice(customSet, get, api);
  const ui = createUiSlice(customSet, get, api);
  const dragDrop = createDragDropSlice(customSet, get, api);

  return {
    ...core,
    ...ui,
    ...dragDrop,
  };
});
