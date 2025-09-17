import { useState, useMemo, useEffect } from "react";
import type { Clan, Item } from "../types";
import {
  TAMANHO_LOTE,
  CENTRO_X,
  CENTRO_Y,
  RAIO_PALCO,
  GAME_AREA_HEIGHT,
  HEADER_HEIGHT,
} from "../config/layoutConstants";

// --- TIPOS ESPECÍFICOS PARA ESTE ESTADO ---

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

type DraggedItemInfo = {
  item: Item;
  initialRect: DOMRect;
} | null;

// --- FUNÇÕES UTILITÁRIAS ---

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

export const useGameLogic = (clans: Clan[], initialItems: Item[]) => {
  // --- ESTADOS DO JOGO ---
  const [remainingItems, setRemainingItems] = useState<Item[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [stageItems, setStageItems] = useState<Item[]>([]);
  const [menuItems, setMenuItems] = useState<Item[]>([]);
  const [message, setMessage] = useState("");
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);
  const [feedbackPulse, setFeedbackPulse] = useState<PulseState>(null);
  const [returningItem, setReturningItem] = useState<ReturningItemState>(null);
  const [draggedItemInfo, setDraggedItemInfo] = useState<DraggedItemInfo>(null);

  // --- CÁLCULOS DE PREPARAÇÃO ---
  const clanTargets = useMemo(() => {
    // Lógica para calcular a posição dos alvos (inalterada)
    const newTargets: { [key: string]: { x: number; y: number } } = {};
    const targetRingRadius = RAIO_PALCO * 0.75;
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
        x: CENTRO_X + targetRingRadius * Math.cos(angle),
        y: CENTRO_Y + targetRingRadius * Math.sin(angle),
      };
    });
    eceraeClans.forEach((clan, index) => {
      const angle =
        ((index + 1) / (eceraeClans.length + 1)) * Math.PI + Math.PI / 2;
      newTargets[clan.id] = {
        x: CENTRO_X + targetRingRadius * Math.cos(angle),
        y: CENTRO_Y + targetRingRadius * Math.sin(angle),
      };
    });
    return newTargets;
  }, [clans, initialItems]);

  // --- FUNÇÕES DE CONTROLE DE JOGO ---
  const loadNextBatch = (items: Item[]) => {
    if (items.length === 0) {
      setIsGameOver(true);
      return;
    }
    const nextBatch = items.slice(0, TAMANHO_LOTE);
    const stillRemaining = items.slice(TAMANHO_LOTE);
    setMenuItems(nextBatch);
    setRemainingItems(stillRemaining);
    setStageItems([]);
  };

  useEffect(() => {
    if (
      initialItems.length > 0 &&
      menuItems.length === 0 &&
      remainingItems.length === 0
    ) {
      const shuffledItems = shuffleArray(initialItems);
      loadNextBatch(shuffledItems);
    }
  }, [initialItems, menuItems, remainingItems]);

  const showFeedback = (msg: string, duration: number = 2000) => {
    setMessage(msg);
    setIsMessageVisible(true);
    setTimeout(() => setIsMessageVisible(false), duration);
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
    return minDistance < 50 ? nearestClan : null;
  };

  // --- MANIPULADORES DE EVENTOS DE ARRASTAR E SOLTAR (NATIVO) ---
  const handleDragStart = (
    e: React.DragEvent,
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
  };

  const handleDrop = (e: React.DragEvent, stageRect: DOMRect) => {
    e.preventDefault();
    if (!draggedItemInfo) return;

    const { item, initialRect } = draggedItemInfo;
    const dropPos = {
      x: e.clientX - stageRect.left,
      y: e.clientY - stageRect.top,
    };
    const targetClan = findNearestClan(dropPos);

    if (targetClan && item.correct_clan_id === targetClan.id) {
      showFeedback("Correto!", 1500);
      setFeedbackPulse({ ...dropPos, color: "correct", key: Date.now() });
      const newItemForStage: Item = { ...item, initial_pos: dropPos };
      setStageItems((prev) => [...prev, newItemForStage]);
      const newMenuItems = menuItems.filter((i) => i.id !== item.id);
      setMenuItems(newMenuItems);
      setDraggingItemId(null);

      if (newMenuItems.length === 0 && remainingItems.length > 0) {
        showFeedback("Rodada Completa!", 2500);
        setTimeout(() => loadNextBatch(remainingItems), 2500);
      } else if (newMenuItems.length === 0 && remainingItems.length === 0) {
        setTimeout(() => setIsGameOver(true), 500);
      }
    } else {
      showFeedback("Incorreto. Tente novamente.", 1500);
      setFeedbackPulse({ ...dropPos, color: "incorrect", key: Date.now() });
      const endPos = {
        x: initialRect.left - stageRect.left + initialRect.width / 2,
        y: initialRect.top - stageRect.top + initialRect.height / 2,
      };
      setReturningItem({ item, startPos: dropPos, endPos });
    }
    setDraggedItemInfo(null);
  };

  return {
    isGameOver,
    stageItems,
    menuItems,
    message,
    isMessageVisible,
    clanTargets,
    draggingItemId,
    feedbackPulse,
    returningItem,
    clearFeedbackPulse: () => setFeedbackPulse(null),
    onReturnAnimationComplete,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
  };
};
