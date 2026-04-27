import { memo } from "react";
import type { Item } from "../types";

interface DraggableItemCardProps {
  item: Item;
  boeName: string;
  clanLabel: string;
}

export const DraggableItemCard = memo(function DraggableItemCard({
  item,
  boeName,
}: DraggableItemCardProps) {
  return (
    <>
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
      <div>
        <span className="item-name-boe" title={boeName}>
          {boeName}
        </span>
      </div>
      <span className="item-name-clan" title={item.name}>
        {item.name}
      </span>
    </>
  );
});
