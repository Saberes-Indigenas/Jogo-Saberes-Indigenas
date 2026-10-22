import { useMemo, useRef, useState, useEffect, memo } from "react";
import type { DragEvent, PointerEvent } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import type { Item } from "../types";
import type { DragPointerEvent } from "../store/types";
import { useGameStore } from "../store/useGameStore";
import { DraggableItemCard } from "./draggable-item-card";
import "../css/ItemTray.css";

export const ItemTray = memo(function ItemTray() {
  const items = useGameStore((s) => s.menuItems);
  const draggingItemId = useGameStore((s) => s.draggingItemId);
  const returningItem = useGameStore((s) => s.returningItem);
  const onDragStart = useGameStore((s) => s.handleDragStart);
  const onDragEnd = useGameStore((s) => s.handleDragEnd);
  const onDragOver = useGameStore((s) => s.handleDragOver);
  const onDrop = useGameStore((s) => s.handleDrop);

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  
  // Ref for better performance in the intent detector
  const pointerStartPos = useRef({ x: 0, y: 0, time: 0 });
  const [constraints, setConstraints] = useState({ top: 0, bottom: 0 });

  useEffect(() => {
    if (containerRef.current && listRef.current) {
      const containerHeight = containerRef.current.offsetHeight;
      const contentHeight = listRef.current.scrollHeight;
      const maxScroll = Math.max(0, contentHeight - containerHeight);
      setConstraints({ top: -maxScroll, bottom: 0 });
    }
  }, [items]);

  // The list only scrolls when we start it: a vertical gesture on a card, or a
  // press on the empty space of the list (see handleListPointerDown).
  const listDragControls = useDragControls();
  const isScrollingList = useRef(false);
  // Touch drag (no native drag-and-drop on phones): "pending" until the intent is clear.
  const touchDrag = useRef<{ item: Item; active: boolean } | null>(null);

  const handleListPointerDown = (e: PointerEvent) => {
    if ((e.target as HTMLElement).closest(".draggable-item")) return;
    listDragControls.start(e);
  };

  const handlePointerDown = (e: PointerEvent, item: Item) => {
    pointerStartPos.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    isScrollingList.current = false;

    if (e.pointerType === "mouse") {
      // We always start as draggable. The PointerMove will downgrade it only if a vertical intent is clear.
      (e.currentTarget as HTMLElement).setAttribute('draggable', 'true');
      touchDrag.current = null;
    } else {
      // Long press on touch would start the browser's own drag: we handle it ourselves.
      (e.currentTarget as HTMLElement).setAttribute('draggable', 'false');
      touchDrag.current = { item, active: false };
    }
  };

  const toDragEvent = (e: PointerEvent): DragPointerEvent => ({
    clientX: e.clientX,
    clientY: e.clientY,
    preventDefault: () => {},
  });

  const getStageRect = () =>
    document.querySelector(".game-area-wrapper")?.getBoundingClientRect() ?? null;

  const handlePointerMove = (e: PointerEvent) => {
    if (e.buttons !== 1) return;

    const drag = touchDrag.current;
    if (drag?.active) {
      const stageRect = getStageRect();
      if (stageRect) onDragOver(toDragEvent(e), stageRect);
      return;
    }

    const deltaX = Math.abs(e.clientX - pointerStartPos.current.x);
    const deltaY = Math.abs(e.clientY - pointerStartPos.current.y);

    // BALANCED INTENT DETECTION:
    // 1. Only intervene if the movement is significant (avoid jitter)
    if (deltaX < 5 && deltaY < 5) return;

    // 2. If the user moves clearly vertically (Y > X by a margin), we favor scrolling.
    // We use a 1.4 ratio to allow for some horizontal wobble while scrolling.
    if (deltaY > deltaX * 1.4 && deltaY > 8) {
      (e.currentTarget as HTMLElement).setAttribute('draggable', 'false');
      touchDrag.current = null;
      if (!isScrollingList.current) {
        isScrollingList.current = true;
        listDragControls.start(e);
      }
    }
    // 3. If they move horizontally, we ensure draggable is true (mouse) or pick up the item (touch).
    else if (deltaX > deltaY && deltaX > 5 && !isScrollingList.current) {
      if (!drag) {
        (e.currentTarget as HTMLElement).setAttribute('draggable', 'true');
        return;
      }
      const node = itemRefs.current.get(drag.item.id);
      if (!node) return;
      drag.active = true;
      onDragStart(toDragEvent(e), drag.item, node.getBoundingClientRect());
    }
  };

  const handlePointerUp = (e: PointerEvent) => {
    const drag = touchDrag.current;
    touchDrag.current = null;
    if (!drag?.active) return;

    // Released back over the tray: just put the item back, like a cancelled drag.
    const trayRect = containerRef.current?.closest(".item-tray")?.getBoundingClientRect();
    const isOverTray =
      trayRect &&
      e.clientX >= trayRect.left && e.clientX <= trayRect.right &&
      e.clientY >= trayRect.top && e.clientY <= trayRect.bottom;

    const stageRect = getStageRect();
    if (!isOverTray && stageRect) onDrop(toDragEvent(e), stageRect);
    onDragEnd();
  };

  const handlePointerCancel = () => {
    if (touchDrag.current?.active) onDragEnd();
    touchDrag.current = null;
  };

  const handleNativeDragStart = (e: DragEvent, item: Item) => {
    const deltaX = Math.abs(e.clientX - pointerStartPos.current.x);
    const deltaY = Math.abs(e.clientY - pointerStartPos.current.y);
    const timeDiff = Date.now() - pointerStartPos.current.time;

    // Last line of defense: if the drag starts but it looks like a scroll, cancel it.
    // But we are now more permissive for horizontal drags.
    if (deltaY > deltaX + 15 && timeDiff < 300) {
      e.preventDefault();
      return;
    }

    const node = itemRefs.current.get(item.id);
    if (node) {
      const rect = node.getBoundingClientRect();
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("application/x-item-id", item.id);
        const ghost = document.getElementById("drag-ghost-pixel") as HTMLImageElement;
        if (ghost) e.dataTransfer.setDragImage(ghost, 0, 0);
      }
      onDragStart(e, item, rect);
    }
  };

  const displayItems = useMemo(
    () =>
      items.map((item) => {
        const boeName = item.name_boe?.trim() || item.name;
        const clanLabel = item.clan?.trim() || "clã misterioso";
        return { item, boeName, clanLabel, ariaLabel: `${boeName}, do ${clanLabel}` };
      }),
    [items]
  );

  return (
    <>
      <aside className="item-tray">
        <div className="item-tray__inner">
          <header className="item-tray__header">
            <p>
              Arraste o ser para o clã correto e fale o nome em Bororo em voz
              alta.
            </p>
          </header>

          <div
            className="item-tray__list-container"
            ref={containerRef}
            onPointerDown={handleListPointerDown}
          >
            <motion.div
              ref={listRef}
              className="item-tray__list"
              drag="y"
              dragListener={false}
              dragControls={listDragControls}
              dragConstraints={constraints}
              dragElastic={0.1}
              dragTransition={{ bounceStiffness: 600, bounceDamping: 40 }}
            >
              <AnimatePresence>
                {displayItems.map(({ item, boeName, clanLabel, ariaLabel }) => {
                  const isDragging = draggingItemId === item.id;
                  const isReturning = returningItem?.item.id === item.id;

                  return (
                    <motion.div
                      key={item.id}
                      role="listitem"
                      aria-label={ariaLabel}
                      ref={(node) => {
                        if (node) itemRefs.current.set(item.id, node);
                        else itemRefs.current.delete(item.id);
                      }}
                      className="draggable-item"
                      style={{ borderColor: item.color }}
                      onPointerDown={(e) => handlePointerDown(e, item)}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      onPointerCancel={handlePointerCancel}
                      draggable="true"
                      onDragStartCapture={(e) => handleNativeDragStart(e, item)}
                      onDragEnd={onDragEnd}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{
                        opacity: (isDragging || isReturning) ? 0 : 1,
                        scale: 1,
                      }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <DraggableItemCard
                        item={item}
                        boeName={boeName}
                        clanLabel={clanLabel}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </aside>

      <img
        id="drag-ghost-pixel"
        src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        alt=""
        style={{ position: 'fixed', top: -100, left: -100, pointerEvents: 'none', opacity: 0 }}
      />
    </>
  );
});
