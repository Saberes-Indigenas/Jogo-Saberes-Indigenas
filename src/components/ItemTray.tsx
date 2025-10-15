import React, { useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Item } from "../types";
import "../css/ItemTray.css";
import DraggableItemCard from "./DraggableItemCard";
import LearningCard from "./LearningCard";

interface ItemTrayProps {
  items: Item[];
  draggingItemId: string | null;
  spotlightItem: Item | null;
  onDragStart: (e: React.DragEvent, item: Item, rect: DOMRect) => void;
  onDragEnd: () => void;
}

const ItemTray = ({
  items,
  draggingItemId,
  spotlightItem,
  onDragStart,
  onDragEnd,
}: ItemTrayProps) => {
  const itemRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  const handleDragStart = (e: React.DragEvent, item: Item) => {
    const node = itemRefs.current.get(item.id);
    if (node) {
      const rect = node.getBoundingClientRect();
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = "move";
        // Definir dados garante que navegadores como Firefox disparem o evento de drop
        e.dataTransfer.setData("application/x-item-id", item.id);
        e.dataTransfer.setData("text/plain", item.id);
        const pixelRatio = window.devicePixelRatio || 1;
        e.dataTransfer.setDragImage(
          node,
          (rect.width / 2) * pixelRatio,
          (rect.height / 2) * pixelRatio
        );
      }
      onDragStart(e, item, rect);
    }
  };

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
                      opacity: draggingItemId === item.id ? 0 : 1,
                      rotate: 0,
                      transition: {
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: index * 0.15,
                      },
                    }}
                    exit={{
                      y: 60,
                      opacity: 0,
                      rotate: 6,
                      transition: { duration: 0.25 },
                    }}
                    whileHover={{ scale: 1.04, y: -6 }}
                    whileTap={{ scale: 0.92, cursor: "grabbing" }}
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
  );
};

export default React.memo(ItemTray);
