import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Item } from "../types";
import "../css/ItemTray.css";

interface ItemTrayProps {
  items: Item[];
  draggingItemId: string | null;
  onDragStart: (e: React.DragEvent, item: Item, rect: DOMRect) => void;
  onDragEnd: () => void;
}

const ItemTray = ({
  items,
  draggingItemId,
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

  return (
    <aside className="item-tray" aria-label="Bandeja de itens para arrastar">
      <header className="item-tray__header">
        <h2>Caixa dos Saberes</h2>
        <p>Arraste o ser para o clã correto e fale o nome em Bororo em voz alta.</p>
      </header>
      <div className="item-tray__list" role="list">
        <AnimatePresence>
          {items.map((item, index) => {
            const boeName = item.name_boe?.trim() || item.name;
            const clanLabel = item.clan?.trim() || "clã misterioso";
            const ariaLabel = `${boeName}, do ${clanLabel}`;

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
              <div
                className="draggable-item__figure"
                style={{ backgroundColor: item.color }}
                title={boeName}
              >
                {item.media?.image ? (
                  <img src={item.media.image} alt="" loading="lazy" />
                ) : (
                  <span className="item-icon">{item.icon}</span>
                )}
                <span className="draggable-item__shine" />
              </div>
              <div className="draggable-item__labels">
                <span className="item-name-boe" title={boeName}>
                  {boeName}
                </span>
                <span className="item-name-pt" title={item.name}>
                  {item.name}
                </span>
                <span className="item-name-clan" title={clanLabel}>
                  Clã: {clanLabel}
                </span>
              </div>
            </motion.div>
          );
          })}
        </AnimatePresence>
      </div>
    </aside>
  );
};

export default ItemTray;
