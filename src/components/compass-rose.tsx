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
              y1="12"
              x2="50"
              y2="21"
              className="compass-rose__tick"
              transform={`rotate(${angle} 50 50)`}
            />
          ))}
        </g>

        {/*
          Agulha: como o Sol fica fixo no topo da tela (não representa o
          leste), o norte do mapa aponta para a esquerda em vez de para
          cima — ponta norte (vermelha) à esquerda, sul (escura) à direita.
        */}
        <polygon points="31,50 50,43 50,57" className="compass-rose__needle-north" />
        <polygon points="69,50 50,43 50,57" className="compass-rose__needle-south" />
        <circle cx="50" cy="50" r="5" className="compass-rose__pin" />

        <text x="17" y="51" className="compass-rose__label">N</text>
        <text x="83" y="51" className="compass-rose__label">S</text>
        <text x="50" y="83" className="compass-rose__label">O</text>
        <text x="50" y="19" className="compass-rose__label">L</text>
      </svg>
    </div>
  );
}
