// ClanTarget.tsx

import { Circle, Text, Group } from "react-konva";

interface ClanTargetProps {
  clanName: string;
  x: number;
  y: number;
  stageRadius: number; // <- NOVA PROP: O raio do palco principal como referência de tamanho.
}

const ClanTarget = ({ clanName, x, y, stageRadius }: ClanTargetProps) => {
  // --- CÁLCULOS DE DIMENSIONAMENTO RESPONSIVO ---
  // Todas as medidas agora são uma fração do raio do palco (stageRadius).
  // Se o palco crescer ou diminuir, o alvo fará o mesmo.

  // O raio do nosso alvo será 12% do raio total do palco.
  const targetRadius = stageRadius * 0.12;

  // O tamanho da fonte será proporcional ao raio do alvo.
  const fontSize = targetRadius * 0.22;

  // A largura do contorno e o desfoque da sombra também escalam.
  const strokeWidth = targetRadius * 0.06;
  const shadowBlur = targetRadius * 0.2;

  return (
    <Group x={x} y={y}>
      <Circle
        // Usando as variáveis calculadas
        radius={targetRadius}
        stroke="#f5f5ff"
        strokeWidth={strokeWidth}
        opacity={0.9}
        shadowColor="black"
        shadowBlur={shadowBlur}
        shadowOpacity={0.7}
      />
      <Text
        text={clanName}
        // O posicionamento e a largura do texto também são relativos ao novo raio
        x={-targetRadius * 0.9} // Centraliza o texto (largura/2)
        y={targetRadius * 1.1} // Posiciona logo abaixo do círculo
        width={targetRadius * 1.8} // Largura da caixa de texto
        align="center"
        fontSize={fontSize}
        fontStyle="bold"
        fill="#f5f5f5"
        listening={false} // O texto não interfere com eventos de mouse
        shadowColor="black"
        shadowBlur={5}
        shadowOpacity={0.8}
      />
    </Group>
  );
};

export default ClanTarget;
