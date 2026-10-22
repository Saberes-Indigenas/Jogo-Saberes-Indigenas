import { memo } from "react";
import "../css/MoietyLetter.css";

interface MoietyLetterProps {
  x: number;
  y: number;
  /** Altura da fonte em px — escala com o raio da aldeia. */
  size: number;
  letter: string;
}

/**
 * Letra que marca cada metade da aldeia: "E" do lado dos clãs Ecerae
 * (esquerda) e "T" do lado dos Tugarége (direita), separadas pela linha dos
 * dois marcos de divisa.
 */
export const MoietyLetter = memo(function MoietyLetter({
  x,
  y,
  size,
  letter,
}: MoietyLetterProps) {
  return (
    <span
      className="moiety-letter"
      style={{ left: x, top: y, fontSize: `${size}px` }}
      aria-hidden="true"
    >
      {letter}
    </span>
  );
});
