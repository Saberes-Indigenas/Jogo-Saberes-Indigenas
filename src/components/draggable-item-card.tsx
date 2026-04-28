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
  clanLabel,
}: DraggableItemCardProps) {
  return (
    <div className="draggable-item__card-inner">
      <div
        className="draggable-item__figure-wrapper"
      >
        <div
          className="draggable-item__figure"
          title={boeName}
        >
          {item.media?.image ? (
            <img src={item.media.image} alt="" />
          ) : (
            <span className="item-icon">{item.icon}</span>
          )}
        </div>
      </div>

      <div className="draggable-item__info">
        <header className="draggable-item__info-header">
          <span className="item-name-boe" title={boeName}>
            {boeName}
          </span>
          <span className="item-name-clan" title={clanLabel}>
            {item.name}
          </span>
        </header>
        <div className="draggable-item__info-footer">
          <div className="item-clan-badge" style={{ backgroundColor: item.color }}>
            {clanLabel}
          </div>
        </div>
      </div>
    </div>
  );
});
