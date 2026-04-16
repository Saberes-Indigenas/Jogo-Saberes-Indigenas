/* Arquivo: src/hooks/useGameLogic.ts */

import { useEffect } from "react";
import type { Clan, Item } from "../types";
import { useGameStore } from "../store/useGameStore";
import type { LayoutData } from "../store/types";

export const useGameLogic = (
  clans: Clan[],
  initialItems: Item[],
  layout: LayoutData
) => {
  const setGameData = useGameStore((state) => state.setGameData);
  const initGameSession = useGameStore((state) => state.initGameSession);
  const setLayout = useGameStore((state) => state.setLayout);

  useEffect(() => {
    // Apenas carrega se tivermos dados
    if (clans.length > 0 && initialItems.length > 0) {
      setGameData(clans, initialItems);
      initGameSession();
    }
  }, [clans, initialItems, setGameData, initGameSession]);

  useEffect(() => {
    // Sempre que o layout mudar (via resize), atualizamos na store
    setLayout(layout);
  }, [layout, setLayout]);

  return {}; // Todo o estado agora é retirado diretamente nos componentes
};
