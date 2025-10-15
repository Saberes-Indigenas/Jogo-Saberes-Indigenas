import { memo } from "react";
import type { Item } from "../types";

interface DraggableItemCardProps {
  item: Item;
  boeName: string;
  clanLabel: string;
}

const DraggableItemCard = ({
  item,
  boeName,
  clanLabel,
}: DraggableItemCardProps) => {
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
      <div className="draggable-item__labels">
        <span className="item-name-boe" title={boeName}>
          {boeName}
        </span>
        <span className="item-name-pt" title={item.name}>
          {item.name}
        </span>
      </div>
      <span className="item-name-clan" title={clanLabel}>
        {clanLabel}
      </span>
    </>
  );
};

export default memo(DraggableItemCard);
