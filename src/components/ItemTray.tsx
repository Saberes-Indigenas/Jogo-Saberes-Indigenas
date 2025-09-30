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
      onDragStart(e, item, rect);
    }
  };

  return (
    <aside className="item-tray">
      <AnimatePresence>
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            ref={(node) => {
              if (node) {
                itemRefs.current.set(item.id, node);
              } else {
                itemRefs.current.delete(item.id);
              }
            }}
            className="draggable-item"
            style={{ backgroundColor: item.color }}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            onDragEnd={onDragEnd}
            layout
            initial={{ y: "100vh", opacity: 0, rotate: -20 }}
            animate={{
              y: 0,
              opacity: draggingItemId === item.id ? 0 : 1,
              rotate: 0,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 15,
                bounce: 0.6,
                delay: index * 0.25,
              },
            }}
            exit={{
              y: "100vh",
              opacity: 0,
              rotate: 20,
              transition: { duration: 0.3 },
            }}
            whileHover={{ scale: 1.08, y: -8, zIndex: 10 }}
            whileTap={{ scale: 0.92, cursor: "grabbing" }}
          >
            <span className="item-icon">{item.icon}</span>
            <span className="item-name">{item.name}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </aside>
  );
};

export default ItemTray;
