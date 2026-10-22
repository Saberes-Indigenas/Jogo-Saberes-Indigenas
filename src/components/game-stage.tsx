import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import type { Clan, Item } from "../types";
import { useGameLogic } from "../hooks/useGameLogic";
import { useGameStore } from "../store/useGameStore";
import { useElementRect } from "../hooks/use-element-rect";
import { ItemTray } from "./item-tray";
import { BororoStage } from "./bororo-stage";
import { GameModals } from "./game-modals";
import { ForestBackground } from "./forest-background";
import { GameHud } from "./game-hud";
import { ClanInfoBubble } from "./clan-info-bubble";
import { ReturningItemDom } from "./returning-item-dom";
import { LoadingScreen } from "./loading-screen";
import { EnteringOfferingDom } from "./entering-offering-dom";
import { CustomDragLayer } from "./custom-drag-layer";
import { SettingsToggle } from "./settings-toggle";
import { SunIndicator } from "./sun-indicator";
import { CompassRose } from "./compass-rose";
import { VillageBoundaryMarker } from "./village-boundary-marker";
import { MoietyLetter } from "./moiety-letter";
import { soundManager } from "../utils/soundManager";
import { stageTuning } from "../utils/mobileViewport";

import chaoBororoFloresta from "../assets/chãoBororoFloresta.svg";
import "../css/GameStage.css";

interface GameStageProps {
  clans: Clan[];
  initialItems: Item[];
}

export function GameStage({ clans, initialItems }: GameStageProps) {
  const gameAreaWrapperRef = useRef<HTMLDivElement>(null);
  const gameAreaRect = useElementRect(gameAreaWrapperRef);

  const layout = useMemo(() => {
    const gameAreaWidth = gameAreaRect.width;
    const gameAreaHeight = gameAreaRect.height;
    const centroX = gameAreaWidth * 0.62;
    // Aldeia deslocada um pouco para baixo e com raio menor, abrindo espaço
    // no topo para o Sol e para novos elementos de cena futuros.
    const centroY = gameAreaHeight * stageTuning.centerY;
    const raioPalco = Math.min(gameAreaWidth, gameAreaHeight) * stageTuning.radius;
    return { gameAreaWidth, gameAreaHeight, centroX, centroY, raioPalco };
  }, [gameAreaRect]);

  // Centro da imagem de fundo da floresta (chãoBororoFloresta) e do halo
  // do body — a arte já é desenhada para casar com o centro geométrico da
  // área de jogo, então usa 50% da altura (não o centroY da aldeia).
  const backgroundCenter = useMemo(
    () => ({
      x: gameAreaRect.left + layout.centroX,
      y: gameAreaRect.top + gameAreaRect.height / 2,
    }),
    [gameAreaRect, layout.centroX]
  );

  // Centro real da roda de clãs no Stage do Konva (layout.centroY, deslocado
  // para baixo para abrir espaço pro Sol) — usado só pelos elementos que
  // precisam se alinhar com a aldeia em si (totem central, marcos de
  // divisa), não com a imagem de fundo.
  const villageCenter = useMemo(
    () => ({
      x: gameAreaRect.left + layout.centroX,
      y: gameAreaRect.top + layout.centroY,
    }),
    [gameAreaRect, layout.centroX, layout.centroY]
  );

  useEffect(() => {
    if (backgroundCenter.x && backgroundCenter.y) {
      const cxPercent = (backgroundCenter.x / window.innerWidth) * 100;
      const cyPercent = (backgroundCenter.y / window.innerHeight) * 100;

      document.documentElement.style.setProperty("--cx", `${cxPercent}%`);
      document.documentElement.style.setProperty("--cy", `${cyPercent}%`);
    }
  }, [backgroundCenter]);

  // Inicializa o game logic apenas atuando como vinculador
  useGameLogic(clans, initialItems, layout);

  const clanInventories = useGameStore((state) => state.clanInventories);
  const clanTargets = useGameStore((state) => state.clanTargets);
  const returningItem = useGameStore((state) => state.returningItem);
  const isGameOver = useGameStore((state) => state.isGameOver);
  const isMessageVisible = useGameStore((state) => state.isMessageVisible);
  const enteringOfferings = useGameStore((state) => state.enteringOfferings);
  const celebration = useGameStore((state) => state.celebration);

  const [isStageReady, setStageReady] = useState(false);
  const [isForestReady, setForestReady] = useState(false);
  const isGameReady = isStageReady && isForestReady;

  useEffect(() => {
    if (isGameReady) {
      soundManager.startAmbient();
    }
  }, [isGameReady]);

  const [activeBubble, setActiveBubble] = useState<{
    clan: Clan;
    items: Item[];
    anchor: { x: number; y: number };
    orientation: { vertical: "above" | "below"; horizontal: "left" | "right" };
  } | null>(null);

  const closeBubble = useCallback(() => setActiveBubble(null), []);

  const handleDragOverStore = useGameStore((s) => s.handleDragOver);
  const handleDrop = useGameStore((s) => s.handleDrop);

  const handleStageDragOver = useCallback((e: React.DragEvent) => {
    if (gameAreaWrapperRef.current) {
      const stageRect = gameAreaWrapperRef.current.getBoundingClientRect();
      handleDragOverStore(e, stageRect);
    }
  }, [handleDragOverStore]);

  const handleStageDrop = useCallback((e: React.DragEvent) => {
    if (gameAreaWrapperRef.current) {
      const stageRect = gameAreaWrapperRef.current.getBoundingClientRect();
      handleDrop(e, stageRect);
    }
  }, [handleDrop]);

  useEffect(() => {
    if (!activeBubble) return;
    const storedItems = clanInventories.get(activeBubble.clan.id) || [];
    if (storedItems.length === 0) {
      setActiveBubble(null);
    } else if (storedItems.length !== activeBubble.items.length) {
      setActiveBubble((prev) =>
        prev
          ? {
              ...prev,
              items: storedItems,
            }
          : null
      );
    }
  }, [activeBubble, clanInventories]);

  const handleClanClick = useCallback(
    (clanId: string) => {
      const storedItems = clanInventories.get(clanId) || [];
      if (storedItems.length === 0) {
        setActiveBubble(null);
        return;
      }

      const clan = clans.find((c) => c.id === clanId);
      const anchor = clanTargets[clanId];
      if (!clan || !anchor) return;

      setActiveBubble((prev) => {
        if (prev?.clan.id === clanId) {
          return null;
        }

        const vertical = anchor.y < layout.centroY ? "below" : "above";
        const horizontal = anchor.x < layout.centroX ? "right" : "left";

        return {
          clan,
          items: storedItems,
          anchor,
          orientation: { vertical, horizontal },
        };
      });
    },
    [clanInventories, clans, clanTargets, layout.centroX, layout.centroY]
  );

  const chaoFlorestaSize = layout.raioPalco * 5;

  return (
    <div className="game-container" aria-busy={!isGameReady}>
      {!isGameReady && (
        <div className="game-loading-overlay">
          <LoadingScreen />
        </div>
      )}
      <div
        className={`game-content${isGameReady ? " game-content--visible" : ""}`}
        aria-hidden={!isGameReady}
        onDragOver={handleStageDragOver}
        onDrop={handleStageDrop}
      >
        {layout.raioPalco > 0 && (
          <img
            src={chaoBororoFloresta}
            alt=""
            className="chao-floresta-background"
            style={{
              width: chaoFlorestaSize,
              height: chaoFlorestaSize,
              left: backgroundCenter.x,
              top: backgroundCenter.y,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
        <div className="fg-overlay">
          <ForestBackground
            stageCenter={backgroundCenter}
            stageRadius={layout.raioPalco}
            width={layout.gameAreaWidth}
            height={layout.gameAreaHeight}
            onReady={() => setForestReady(true)}
          />
          {isGameReady && <SettingsToggle />}
          {isGameReady && (
            <SunIndicator
              centerX={villageCenter.x}
              stageRadius={layout.raioPalco}
            />
          )}
          {isGameReady && <CompassRose />}
          {isGameReady && layout.raioPalco > 0 && (
            <>
              <VillageBoundaryMarker
                x={villageCenter.x}
                y={villageCenter.y - layout.raioPalco * 0.97}
                size={layout.raioPalco * 0.22}
              >
                Mano
              </VillageBoundaryMarker>
              <VillageBoundaryMarker
                x={villageCenter.x}
                y={villageCenter.y + layout.raioPalco * 0.97}
                size={layout.raioPalco * 0.22}
              >
                Aije Mugo
              </VillageBoundaryMarker>

              {/* Metades da aldeia: Ecerae à esquerda, Tugarége à direita
                  (é assim que recalculateClanTargets distribui os clãs). */}
              <MoietyLetter
                x={villageCenter.x - layout.raioPalco * 0.45}
                y={villageCenter.y}
                size={layout.raioPalco * 0.2}
                letter="E"
              />
              <MoietyLetter
                x={villageCenter.x + layout.raioPalco * 0.45}
                y={villageCenter.y}
                size={layout.raioPalco * 0.2}
                letter="T"
              />
            </>
          )}
          <GameHud
            isOpen={false}
            onToggle={() => {}}
            stageCenter={layout.raioPalco > 0 ? villageCenter : null}
            stageRadius={layout.raioPalco}
          />
          <AnimatePresence>
            {/* O painel de informações foi desativado a pedido do usuário */}
          </AnimatePresence>

          {isGameReady && <ItemTray />}
        </div>
        <div className="game-area-wrapper" ref={gameAreaWrapperRef}>
          <BororoStage
            onClanClick={handleClanClick}
            onReady={() => setStageReady(true)}
            gameAreaWrapperRef={gameAreaWrapperRef}
          />
        </div>

        {returningItem && (
          <ReturningItemDom
            returningItem={returningItem}
            onComplete={() => useGameStore.getState().onReturnAnimationComplete()}
          />
        )}

        <ClanInfoBubble
          activeBubble={activeBubble}
          containerRect={gameAreaRect}
          onClose={closeBubble}
        />

        {(isGameOver || isMessageVisible || celebration) && <GameModals />}
        {enteringOfferings.map((offering) => (
          <EnteringOfferingDom
            key={offering.key}
            offering={offering}
            onComplete={(off) =>
              useGameStore.getState().registerOfferingArrival(off.key, off.clanId, off.item)
            }
          />
        ))}
      </div>
      <CustomDragLayer />
    </div>
  );
}
