import "../css/CompassRose.css";

const DIAGONAL_TICK_ANGLES = [45, 135, 225, 315];

export function CompassRose() {
  return (
    <div className="compass-rose" aria-hidden="true">
      <svg viewBox="0 0 100 100" className="compass-rose__svg">
        <circle cx="50" cy="50" r="46" className="compass-rose__ring" />
        <circle cx="50" cy="50" r="38" className="compass-rose__face" />

        <g className="compass-rose__ticks">
          {DIAGONAL_TICK_ANGLES.map((angle) => (
            <line
              key={angle}
              x1="50"
              y1="15"
              x2="50"
              y2="20"
              className="compass-rose__tick"
              transform={`rotate(${angle} 50 50)`}
            />
          ))}
        </g>

        {/* Agulha compacta: ponta norte (vermelha) e sul (escura) não alcançam os rótulos */}
        <polygon points="50,36 54,50 46,50" className="compass-rose__needle-north" />
        <polygon points="50,64 54,50 46,50" className="compass-rose__needle-south" />
        <circle cx="50" cy="50" r="3.5" className="compass-rose__pin" />

        <text x="50" y="19" className="compass-rose__label">N</text>
        <text x="50" y="83" className="compass-rose__label">S</text>
        <text x="17" y="51" className="compass-rose__label">O</text>
        <text x="83" y="51" className="compass-rose__label">L</text>
      </svg>
    </div>
  );
}
