import type { Item } from "../types";
import "../css/SharedItemBall.css";

interface SharedItemBallProps {
  item: Item;
  scale?: number;
  className?: string;
}

export function SharedItemBall({ item, scale = 1, className = "" }: SharedItemBallProps) {
  const hasImage = !!item.media?.image;

  return (
    <div 
      className={`shared-item-ball ${className}`}
      style={{ 
        transform: `scale(${scale})`,
        border: `4px solid #fff`,
        borderRadius: "50%",
        overflow: "hidden"
      }}
    >
      <div className="shared-item-ball__figure-inner">
        {hasImage ? (
          <div 
            className="shared-item-ball__image" 
            style={{ backgroundImage: `url(${item.media?.image})` }}
          />
        ) : (
          <span className="shared-item-ball__icon">{item.icon}</span>
        )}
      </div>
    </div>
  );
}
