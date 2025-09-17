import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Item } from "../types";

interface ItemTrayProps {
  items: Item[];
  draggingItemId: string | null;
  // A assinatura da função muda para incluir o retângulo de posição
  onDragStart: (e: React.DragEvent, item: Item, rect: DOMRect) => void;
  onDragEnd: () => void;
}

const ItemTray = ({
  items,
  draggingItemId,
  onDragStart,
  onDragEnd,
}: ItemTrayProps) => {
  // Usamos um Ref para guardar uma referência a todos os elementos da bandeja
  const itemRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  const handleDragStart = (e: React.DragEvent, item: Item) => {
    // Pega o elemento DOM do nosso mapa de referências
    const node = itemRefs.current.get(item.id);
    if (node) {
      // Mede a posição exata do elemento na tela
      const rect = node.getBoundingClientRect();
      // Envia o evento, o item E o retângulo com a posição para a lógica do jogo
      onDragStart(e, item, rect);
    }
  };

  return (
    <aside className="item-tray">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            // Adicionamos uma ref para cada item
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
            whileHover={{ scale: 1.1, y: -5, zIndex: 10 }}
            whileTap={{ scale: 0.95, cursor: "grabbing" }}
            animate={{ opacity: draggingItemId === item.id ? 0 : 1 }}
            transition={{ duration: 0.2 }}
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
