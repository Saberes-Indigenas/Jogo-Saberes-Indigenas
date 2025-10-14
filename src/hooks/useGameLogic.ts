/* Arquivo: src/hooks/useGameLogic.ts */

import { useState, useMemo, useEffect, useRef } from "react";
import type { Clan, Item, RewardCelebration } from "../types";
// A importação do HEADER_HEIGHT não é mais necessária para o cálculo do drop
// import { HEADER_HEIGHT } from "../config/layoutConstants";

// --- TIPOS (sem alterações) ---
type PulseState = {
  x: number;
  y: number;
  color: "correct" | "incorrect";
  key: number;
} | null;

type ReturningItemState = {
  item: Item;
  startPos: { x: number; y: number };
  endPos: { x: number; y: number };
} | null;

export type EnteringOffering = {
  key: number;
  clanId: string;
  item: Item;
  startPos: { x: number; y: number };
  endPos: { x: number; y: number };
};

type MessageType = "success" | "error" | "roundComplete";

type DraggedItemInfo = {
  item: Item;
  initialRect: DOMRect;
} | null;

const MAX_ROUNDS = 5;

// --- FUNÇÕES UTILITÁRIAS (sem alterações) ---
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const getDistance = (
  p1: { x: number; y: number },
  p2: { x: number; y: number }
) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

// --- O HOOK PRINCIPAL ---
export const useGameLogic = (
  clans: Clan[],
  initialItems: Item[],
  layout: { centroX: number; centroY: number; raioPalco: number }
) => {
  // --- ESTADOS DO JOGO (sem alterações) ---
  const [remainingItemsByClan, setRemainingItemsByClan] = useState<
    Map<string, Item[]>
  >(new Map());
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<MessageType>("success");
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [enteringOfferings, setEnteringOfferings] = useState<
    EnteringOffering[]
  >([]);
  const [menuItems, setMenuItems] = useState<Item[]>([]);
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);
  const [feedbackPulse, setFeedbackPulse] = useState<PulseState>(null);
  const [returningItem, setReturningItem] = useState<ReturningItemState>(null);
  const [draggedItemInfo, setDraggedItemInfo] = useState<DraggedItemInfo>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [featherCount, setFeatherCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [completedByColor, setCompletedByColor] = useState({
    red: 0,
    black: 0,
  });
  const [maxRounds, setMaxRounds] = useState(MAX_ROUNDS);
  const [currentRound, setCurrentRound] = useState(0);
  const [sessionTotalItems, setSessionTotalItems] = useState(0);
  const [sessionTotalByColor, setSessionTotalByColor] = useState({
    red: 0,
    black: 0,
  });
  const [spotlightItem, setSpotlightItem] = useState<Item | null>(null);
  const [celebration, setCelebration] = useState<RewardCelebration | null>(
    null
  );
  const [clanInventories, setClanInventories] = useState<Map<string, Item[]>>(
    new Map()
  );
  const [recentDeliveries, setRecentDeliveries] = useState<{
    [clanId: string]: number;
  }>({});
  const celebrationTimeoutRef = useRef<number | null>(null);
  const pronunciationAudioRef = useRef<HTMLAudioElement | null>(null);

  const totalItems = sessionTotalItems;
  const totalItemsByColor = sessionTotalByColor;

  const getColorKey = (color: string | undefined): "red" | "black" =>
    color?.toLowerCase() === "#b52323" ? "red" : "black";

  useEffect(() => {
    return () => {
      if (celebrationTimeoutRef.current) {
        window.clearTimeout(celebrationTimeoutRef.current);
      }
      if (pronunciationAudioRef.current) {
        pronunciationAudioRef.current.pause();
      }
    };
  }, []);

  // --- CÁLCULOS DE PREPARAÇÃO (sem alterações) ---
  const clanTargets = useMemo(() => {
    const newTargets: { [key: string]: { x: number; y: number } } = {};
    const targetRingRadius = layout.raioPalco * 0.75;
    const tugoaregeClans = clans.filter(
      (c) =>
        initialItems.find((i) => i.correct_clan_id === c.id)?.color ===
        "#b52323"
    );
    const eceraeClans = clans.filter(
      (c) =>
        initialItems.find((i) => i.correct_clan_id === c.id)?.color ===
        "#000000"
    );

    tugoaregeClans.forEach((clan, index) => {
      const angle =
        ((index + 1) / (tugoaregeClans.length + 1)) * Math.PI - Math.PI / 2;
      newTargets[clan.id] = {
        x: layout.centroX + targetRingRadius * Math.cos(angle),
        y: layout.centroY + targetRingRadius * Math.sin(angle),
      };
    });
    eceraeClans.forEach((clan, index) => {
      const angle =
        ((index + 1) / (eceraeClans.length + 1)) * Math.PI + Math.PI / 2;
      newTargets[clan.id] = {
        x: layout.centroX + targetRingRadius * Math.cos(angle),
        y: layout.centroY + targetRingRadius * Math.sin(angle),
      };
    });
    return newTargets;
  }, [clans, initialItems, layout]);

  // --- FUNÇÕES DE CONTROLE DE JOGO (sem alterações) ---
  const loadNextBatch = (
    currentItemsByClan: Map<string, Item[]>,
    nextRound?: number
  ) => {
    const newBatch: Item[] = [];
    const newRemainingMap = new Map<string, Item[]>();
    let canCreateNextBatch = true;

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

    if (!canCreateNextBatch) {
      setIsGameOver(true);
      return;
    }

    if (newBatch.length === 0) {
      setIsGameOver(true);
      return;
    }

    setMenuItems(shuffleArray(newBatch));
    setRemainingItemsByClan(newRemainingMap);
    setSpotlightItem(null);
    if (typeof nextRound === "number") {
      setCurrentRound(nextRound);
    } else {
      setCurrentRound((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (initialItems.length > 0 && remainingItemsByClan.size === 0) {
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
        setIsGameOver(true);
        return;
      }

      const roundsAvailable = Math.min(
        MAX_ROUNDS,
        ...Array.from(filteredItemsByClan.values()).map((items) => items.length)
      );

      if (roundsAvailable === 0) {
        setIsGameOver(true);
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
      setSessionTotalItems(totalForSession);
      setSessionTotalByColor(totalsByColor);
      setMaxRounds(roundsAvailable);
      setCompletedByColor({ red: 0, black: 0 });

      const initialInventory = new Map<string, Item[]>();
      preparedItemsByClan.forEach((_, clanId) => {
        initialInventory.set(clanId, []);
      });

      setClanInventories(initialInventory);
      setRemainingItemsByClan(preparedItemsByClan);
      setCurrentRound(0);
      loadNextBatch(preparedItemsByClan, 1);
    }
  }, [clans, initialItems, remainingItemsByClan.size]);

  const showFeedback = (
    msg: string,
    type: MessageType,
    duration: number = 2000
  ) => {
    setMessage(msg);
    setMessageType(type);
    setIsMessageVisible(true);
    setTimeout(() => setIsMessageVisible(false), duration);
  };

  const scheduleCelebrationClear = () => {
    if (celebrationTimeoutRef.current) {
      window.clearTimeout(celebrationTimeoutRef.current);
    }
    celebrationTimeoutRef.current = window.setTimeout(
      () => setCelebration(null),
      2800
    );
  };

  const triggerCelebration = (data: Omit<RewardCelebration, "id">) => {
    setCelebration({ ...data, id: Date.now() });
    scheduleCelebrationClear();
  };

  const playPronunciation = (item: Item) => {
    const audioSource = item.media?.audio;
    if (!audioSource) return;

    if (!pronunciationAudioRef.current) {
      pronunciationAudioRef.current = new Audio();
    }

    const audio = pronunciationAudioRef.current;
    audio.pause();
    audio.src = audioSource;
    audio.currentTime = 0;
    audio.play().catch((error) => {
      console.warn("Não foi possível reproduzir o áudio do item", error);
    });
  };

  const findNearestClan = (dropPos: { x: number; y: number }): Clan | null => {
    let nearestClan: Clan | null = null;
    let minDistance = Infinity;

    Object.keys(clanTargets).forEach((clanId) => {
      const clan = clans.find((c) => c.id === clanId);
      const targetPos = clanTargets[clanId];
      if (clan && targetPos) {
        const distance = getDistance(dropPos, targetPos);
        if (distance < minDistance) {
          minDistance = distance;
          nearestClan = clan;
        }
      }
    });

    // MELHORIA: Aumentamos a área de 'snap' de 15% para 20% do raio do palco.
    // Isso torna o alvo um pouco maior e mais fácil de acertar.
    return minDistance < layout.raioPalco * 0.2 ? nearestClan : null;
  };

  // --- MANIPULADORES DE EVENTOS (sem alterações) ---
  const handleDragStart = (
    _e: React.DragEvent,
    item: Item,
    initialRect: DOMRect
  ) => {
    setDraggedItemInfo({ item, initialRect });
    setDraggingItemId(item.id);
  };

  const handleDragEnd = () => {
    if (draggedItemInfo) {
      setDraggingItemId(null);
      setDraggedItemInfo(null);
    }
  };

  const onReturnAnimationComplete = () => {
    setReturningItem(null);
    setDraggingItemId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "move";
    }
  };

  const registerOfferingArrival = (
    entryKey: number,
    clanId: string,
    item: Item
  ) => {
    setEnteringOfferings((prev) =>
      prev.filter((offering) => offering.key !== entryKey)
    );
    setClanInventories((prev) => {
      const updated = new Map(prev);
      const existing = updated.get(clanId) || [];
      updated.set(clanId, [...existing, item]);
      return updated;
    });
    setRecentDeliveries((prev) => ({ ...prev, [clanId]: Date.now() }));
  };

  const clearClanDisplays = () => {
    setEnteringOfferings([]);
    setClanInventories((prev) => {
      const cleared = new Map<string, Item[]>();
      prev.forEach((_, clanId) => {
        cleared.set(clanId, []);
      });
      return cleared;
    });
    setRecentDeliveries({});
  };

  // --- LÓGICA DE DROP CORRIGIDA ---
  const handleDrop = (e: React.DragEvent, stageRect: DOMRect) => {
    e.preventDefault();
    if (!draggedItemInfo) return;

    const { item, initialRect } = draggedItemInfo;

    // CORREÇÃO: Removemos a subtração de HEADER_HEIGHT.
    // Agora, as coordenadas do mouse são relativas ao topo do container do palco,
    // que é o mesmo sistema de coordenadas do canvas do Konva.
    const pointerPos = {
      x: e.clientX - stageRect.left,
      y: e.clientY - stageRect.top,
    };

    const dropPos = {
      x: Math.min(Math.max(pointerPos.x, 0), stageRect.width),
      y: Math.min(Math.max(pointerPos.y, 0), stageRect.height),
    };

    const targetClan = findNearestClan(dropPos);

    if (targetClan && item.correct_clan_id === targetClan.id) {
      const newStreak = streak + 1;
      const earnedPoints = 100 + newStreak * 25;
      setScore((prev) => prev + earnedPoints);
      setStreak(newStreak);
      setMaxStreak((prev) => Math.max(prev, newStreak));
      setCompletedCount((prev) => prev + 1);
      const colorKey = getColorKey(item.color);
      setCompletedByColor((prev) => ({
        ...prev,
        [colorKey]: Math.min(prev[colorKey] + 1, totalItemsByColor[colorKey]),
      }));

      const successMessage = `Você conectou ${item.name_boe} ao clã ${targetClan.name}!`;
      showFeedback(successMessage, "success", 1800);
      const targetCenterPos = clanTargets[targetClan.id];
      setFeedbackPulse({
        ...targetCenterPos,
        color: "correct",
        key: Date.now(),
      });
      const entryKey = Date.now();
      setEnteringOfferings((prev) => [
        ...prev,
        {
          key: entryKey,
          clanId: targetClan.id,
          item,
          startPos: dropPos,
          endPos: targetCenterPos,
        },
      ]);
      setSpotlightItem({ ...item });
      playPronunciation(item);

      if (newStreak > 0 && newStreak % 3 === 0) {
        setFeatherCount((prev) => prev + 1);
        triggerCelebration({
          icon: "🪶",
          label: "Você ganhou uma Pluma do Conhecimento!",
          accentColor: "#ffe082",
        });
      } else if (newStreak === 1) {
        triggerCelebration({
          icon: "🔥",
          label: "Sequência iniciada! Continue firme!",
          accentColor: "#ffb74d",
        });
      }

      const newMenuItems = menuItems.filter((i) => i.id !== item.id);
      setMenuItems(newMenuItems);
      setDraggingItemId(null);

      if (newMenuItems.length === 0) {
        const hasRemainingItems = Array.from(
          remainingItemsByClan.values()
        ).some((arr) => arr.length > 0);
        if (hasRemainingItems) {
          clearClanDisplays();
          const finishedRound = Math.min(currentRound, maxRounds);
          const upcomingRound = Math.min(currentRound + 1, maxRounds);
          showFeedback(
            `Rodada ${finishedRound} concluída! Prepare-se para novos desafios.`,
            "roundComplete",
            2500
          );
          setTimeout(
            () => loadNextBatch(remainingItemsByClan, upcomingRound),
            2500
          );
        } else {
          clearClanDisplays();
          triggerCelebration({
            icon: "🌈",
            label: "Você reuniu todo o círculo sagrado!",
            accentColor: "#b39ddb",
          });
          setCurrentRound(maxRounds);
          setTimeout(() => setIsGameOver(true), 500);
        }
      }
    } else {
      if (streak > 2) {
        triggerCelebration({
          icon: "💧",
          label: "Respire fundo e tente novamente!",
          accentColor: "#80cbc4",
        });
      }
      setStreak(0);
      showFeedback(
        "Incorreto. Observe as cores do clã e tente novamente.",
        "error",
        1600
      );
      setFeedbackPulse({ ...dropPos, color: "incorrect", key: Date.now() });

      // CORREÇÃO: Também removemos a subtração de HEADER_HEIGHT aqui,
      // para que a animação de retorno comece no lugar certo.
      const endPos = {
        x: initialRect.left - stageRect.left + initialRect.width / 2,
        y: initialRect.top - stageRect.top + initialRect.height / 2,
      };
      setReturningItem({ item, startPos: dropPos, endPos });
    }
    setDraggedItemInfo(null);
  };

  useEffect(() => {
    let timer: number | null = null;
    if (spotlightItem) {
      timer = window.setTimeout(() => {
        setSpotlightItem(null);
      }, 5000); // 5000 milissegundos = 5 segundos
    }
    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, [spotlightItem]);

  return {
    isGameOver,
    currentRound,
    maxRounds,
    enteringOfferings,
    menuItems,
    message,
    messageType,
    isMessageVisible,
    clanTargets,
    draggingItemId,
    feedbackPulse,
    returningItem,
    score,
    streak,
    maxStreak,
    featherCount,
    completedCount,
    totalItems,
    completedByColor,
    totalItemsByColor,
    spotlightItem,
    celebration,
    clearFeedbackPulse: () => setFeedbackPulse(null),
    clearCelebration: () => {
      if (celebrationTimeoutRef.current) {
        window.clearTimeout(celebrationTimeoutRef.current);
        celebrationTimeoutRef.current = null;
      }
      setCelebration(null);
    },
    onReturnAnimationComplete,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    clanInventories,
    recentDeliveries,
    registerOfferingArrival,
  };
};
