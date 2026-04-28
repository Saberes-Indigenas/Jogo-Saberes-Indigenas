import { useMemo, useRef, memo } from "react";
import type { DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Item } from "../types";
import { useGameStore } from "../store/useGameStore";
import { DraggableItemCard } from "./draggable-item-card";
import { LearningCard } from "./learning-card";
import "../css/ItemTray.css";

export const ItemTray = memo(function ItemTray() {
  const items = useGameStore((s) => s.menuItems);
  const draggingItemId = useGameStore((s) => s.draggingItemId);
  const returningItem = useGameStore((s) => s.returningItem);
  const spotlightItem = useGameStore((s) => s.spotlightItem);
  const onDragStart = useGameStore((s) => s.handleDragStart);
  const onDragEnd = useGameStore((s) => s.handleDragEnd);

  const itemRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  function handleDragStart(e: DragEvent, item: Item) {
    const node = itemRefs.current.get(item.id);
    if (node) {
      const rect = node.getBoundingClientRect();
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("application/x-item-id", item.id);
        e.dataTransfer.setData("text/plain", item.id);

        // Use a hidden element for the drag image to ensure it's "ready" and transparent
        const ghost = document.getElementById("drag-ghost-pixel") as HTMLImageElement;
        if (ghost) {
          e.dataTransfer.setDragImage(ghost, 0, 0);
        } else {
          // Fallback if element not found
          const img = new Image();
          img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
          e.dataTransfer.setDragImage(img, 0, 0);
        }
      }
      onDragStart(e, item, rect);
    }
  }

  const displayItems = useMemo(
    () =>
      items.map((item) => {
        const boeName = item.name_boe?.trim() || item.name;
        const clanLabel = item.clan?.trim() || "clã misterioso";
        return {
          item,
          boeName,
          clanLabel,
          ariaLabel: `${boeName}, do ${clanLabel}`,
        };
      }),
    [items]
  );

  return (
    <>
      <aside className="item-tray" aria-label="Bandeja de itens para arrastar">
        <div className="item-tray__inner">
          <section className="item-tray__spotlight" aria-live="polite">
            <AnimatePresence mode="wait">
              {spotlightItem ? (
                <LearningCard
                  key={spotlightItem.id}
                  item={spotlightItem}
                  layout="embedded"
                />
              ) : (
                <motion.div
                  key="spotlight-placeholder"
                  className="item-tray__spotlight-placeholder"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3>Prepare a voz</h3>
                  <p>
                    Ao entregar um ser ao clã correto, você verá os detalhes dele
                    aqui.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <header className="item-tray__header">
            <p>
              Arraste o ser para o clã correto e fale o nome em Bororo em voz
              alta.
            </p>
          </header>
          <div className="item-tray__list" role="list">
            <AnimatePresence>
              {displayItems.map(
                ({ item, boeName, clanLabel, ariaLabel }, index) => {
                  return (
                    <motion.div
                      key={item.id}
                      role="listitem"
                      aria-roledescription="Item arrastável"
                      aria-label={ariaLabel}
                      ref={(node) => {
                        if (node) {
                          itemRefs.current.set(item.id, node);
                        } else {
                          itemRefs.current.delete(item.id);
                        }
                      }}
                      className="draggable-item"
                      style={{ borderColor: item.color }}
                      draggable
                      onDragStartCapture={(e) => handleDragStart(e, item)}
                      onDragEnd={onDragEnd}
                      layout
                      initial={{ y: 60, opacity: 0, rotate: -8 }}
                      animate={{
                        y: 0,
                        opacity: (draggingItemId === item.id || returningItem?.item.id === item.id) ? 0 : 1,
                        borderRadius: (draggingItemId === item.id || returningItem?.item.id === item.id) ? "50%" : "28px",
                        scale: 1,
                        rotate: 0,
                      }}
                      transition={{
                        borderRadius: { duration: 0.4, ease: "easeOut" },
                        opacity: { duration: 0.15 },
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                        delay: draggingItemId === item.id || returningItem?.item.id === item.id ? 0 : (index * 0.05),
                      }}
                      exit={{
                        y: 40,
                        opacity: 0,
                        scale: 0.8,
                        rotate: 5,
                        transition: { duration: 0.2, ease: "circIn" },
                      }}
                      whileHover={{
                        scale: 1.05,
                        y: -8,
                        rotate: index % 2 === 0 ? 1 : -1,
                        transition: { type: "spring", stiffness: 400, damping: 15 }
                      }}
                      whileTap={{ scale: 0.95, rotate: 0 }}
                    >
                      <DraggableItemCard
                        item={item}
                        boeName={boeName}
                        clanLabel={clanLabel}
                      />
                    </motion.div>
                  );
                }
              )}
            </AnimatePresence>
          </div>
        </div>
      </aside>
      {/* Hidden ghost image for dragging */}
      <img
        id="drag-ghost-pixel"
        src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        alt=""
        style={{ position: 'fixed', top: -100, left: -100, pointerEvents: 'none', opacity: 0 }}
      />
    </>
  );
});
