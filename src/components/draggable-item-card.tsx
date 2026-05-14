import { memo } from "react";
import type { Item } from "../types";
import { useGameStore } from "../store/useGameStore";

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
  const showPortugueseName = useGameStore((s) => s.showPortugueseName);
  const showClanBadge = useGameStore((s) => s.showClanBadge);

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
          {showPortugueseName && (
            <span className="item-name-clan" title={clanLabel}>
              {item.name}
            </span>
          )}
        </header>
        {showClanBadge && (
          <div className="draggable-item__info-footer">
            <div className="item-clan-badge" style={{ backgroundColor: item.color }}>
              {clanLabel}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
