import sunUrl from "../assets/sun.svg";
import "../css/SunIndicator.css";
import { stageTuning } from "../utils/mobileViewport";

interface SunIndicatorProps {
  /** Posição horizontal (px, relativa à viewport) do centro da aldeia, para manter o Sol alinhado com ela. */
  centerX?: number;
  /** Raio da aldeia (layout.raioPalco) — o Sol escala junto com ela. */
  stageRadius?: number;
}

export function SunIndicator({ centerX, stageRadius }: SunIndicatorProps) {
  /*
    O Sol fica com metade para fora do topo da tela (a âncora é o topo, com
    translate(-50%,-50%) no CSS): assim ele pode ser bem maior e continuar
    visível sem invadir a aldeia. O tamanho acompanha o raio da aldeia —
    0,75 dele deixa a metade visível parando pouco antes do marco de cima,
    que fica a 0,97 do raio acima do centro.
  */
  const size = stageRadius ? stageRadius * stageTuning.sun : undefined;

  return (
    <div
      className="sun-indicator"
      style={{
        ...(centerX ? { left: `${centerX}px` } : null),
        ...(size ? { width: `${size}px`, height: `${size}px` } : null),
      }}
      aria-hidden="true"
    >
      <img src={sunUrl} alt="" className="sun-indicator__svg" />
    </div>
  );
}
