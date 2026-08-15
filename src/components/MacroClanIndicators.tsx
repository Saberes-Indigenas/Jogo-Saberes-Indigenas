import "../css/MacroClanIndicators.css";

interface MacroClanIndicatorsProps {
  stageCenter: { x: number; y: number } | null;
  stageRadius: number;
}

const MacroClanIndicators = ({
  stageCenter,
  stageRadius,
}: MacroClanIndicatorsProps) => {
  if (!stageCenter || stageRadius <= 0) {
    return null;
  }

  const indicatorWidth = Math.max(180, stageRadius * 0.42);
  const indicatorHeight = Math.max(180, stageRadius * 0.85);
  const horizontalOffset = stageRadius * 1.12;

  const westStyle: React.CSSProperties = {
    width: indicatorWidth,
    height: indicatorHeight,
    left: stageCenter.x - horizontalOffset,
    top: stageCenter.y,
    transform: "translate(-100%, -50%)",
  };

  const eastStyle: React.CSSProperties = {
    width: indicatorWidth,
    height: indicatorHeight,
    left: stageCenter.x + horizontalOffset,
    top: stageCenter.y,
    transform: "translate(0%, -50%)",
  };

  return (
    <div className="macro-clan-indicators" aria-hidden="true">
      <div className="macro-clan-indicator macro-clan-indicator--west" style={westStyle}>
        <span className="macro-clan-indicator__direction">Oeste</span>
        <span className="macro-clan-indicator__divider" />
        <span className="macro-clan-indicator__title">Eçerae</span>
        <span className="macro-clan-indicator__caption">Guardiãs dos clãs da mata</span>
      </div>
      <div className="macro-clan-indicator macro-clan-indicator--east" style={eastStyle}>
        <span className="macro-clan-indicator__direction">Leste</span>
        <span className="macro-clan-indicator__divider" />
        <span className="macro-clan-indicator__title">Tugarege</span>
        <span className="macro-clan-indicator__caption">Guardião dos clãs do sol</span>
      </div>
    </div>
  );
};

export default MacroClanIndicators;
