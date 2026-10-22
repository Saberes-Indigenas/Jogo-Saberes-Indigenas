import { memo } from "react";
import type { ReactNode } from "react";
import "../css/VillageBoundaryMarker.css";

interface VillageBoundaryMarkerProps {
  x: number;
  y: number;
  size: number;
  children?: ReactNode;
}

/**
 * Marco redondo (pedra) que sinaliza a divisa entre as duas metades da
 * aldeia — fica no vão de cima e no vão de baixo da roda de clãs, onde a
 * fileira de casas da esquerda encontra a da direita.
 *
 * É um elemento de DOM (fora do Stage do Konva), assim como o Sol e a
 * rosa dos ventos, para poder ficar por cima da camada da floresta e,
 * futuramente, exibir texto dentro dele (via `children`).
 */
export const VillageBoundaryMarker = memo(function VillageBoundaryMarker({
  x,
  y,
  size,
  children,
}: VillageBoundaryMarkerProps) {
  return (
    <div
      className="village-boundary-marker"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        // usado pelo CSS para a fonte do texto acompanhar o tamanho do marco
        ["--marker-size" as string]: `${size}px`,
      }}
      aria-hidden="true"
    >
      <span className="village-boundary-marker__highlight" />
      {children && (
        <span className="village-boundary-marker__label">{children}</span>
      )}
    </div>
  );
});
