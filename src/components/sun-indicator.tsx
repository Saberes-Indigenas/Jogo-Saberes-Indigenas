import "../css/SunIndicator.css";

const RAY_COUNT = 12;

interface SunIndicatorProps {
  /** Posição horizontal (px, relativa à viewport) do centro da aldeia, para manter o Sol alinhado com ela. */
  centerX?: number;
}

export function SunIndicator({ centerX }: SunIndicatorProps) {
  return (
    <div
      className="sun-indicator"
      style={centerX ? { left: `${centerX}px` } : undefined}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100" className="sun-indicator__svg">
        <g className="sun-indicator__rays">
          {Array.from({ length: RAY_COUNT }).map((_, index) => (
            <rect
              key={index}
              x="47"
              y="6"
              width="6"
              height="13"
              rx="3"
              className="sun-indicator__ray"
              transform={`rotate(${(index * 360) / RAY_COUNT} 50 50)`}
            />
          ))}
        </g>
        <circle cx="50" cy="50" r="20" className="sun-indicator__core" />
        <circle cx="43" cy="43" r="5" className="sun-indicator__glint" />
      </svg>
    </div>
  );
}
