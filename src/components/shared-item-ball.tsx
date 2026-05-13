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
          <img 
            className="shared-item-ball__image" 
            src={item.media?.image || undefined}
            alt=""
          />
        ) : (
          <span className="shared-item-ball__icon">{item.icon}</span>
        )}
      </div>
    </div>
  );
}
