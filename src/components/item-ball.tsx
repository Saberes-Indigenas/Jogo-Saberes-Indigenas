import { Group, Circle, Text } from "react-konva";
import type { Item } from "../types";

const RAIO_BOLA = 60;
// Removendo a constante COR_BOLA, pois usaremos a cor do item
const COR_SOMBRA = "#555555";

interface ItemBallProps {
  item: Item;
  onDragEnd?: (e: any) => void;
  dragBoundFunc?: (pos: { x: number; y: number }) => { x: number; y: number };
}

const ItemBall = ({ item, onDragEnd, dragBoundFunc }: ItemBallProps) => {
  return (
    <Group
      x={item.initial_pos ? item.initial_pos.x : 0} // Usar 0 como fallback se initial_pos não estiver definido
      y={item.initial_pos ? item.initial_pos.y : 0} // Usar 0 como fallback se initial_pos não estiver definido
      draggable
      onDragEnd={onDragEnd}
      dragBoundFunc={dragBoundFunc}
    >
      <Circle
        radius={RAIO_BOLA}
        fill={item.color} // << AQUI ESTÁ A MUDANÇA: USANDO item.color!
        stroke="#333"
        strokeWidth={2}
        shadowColor={COR_SOMBRA}
        shadowBlur={10}
        shadowOpacity={0.6}
        shadowOffsetX={5}
        shadowOffsetY={5}
      />
      <Text
        text={item.name}
        fontSize={16}
        fontFamily="Arial, sans-serif"
        fill="#000"
        width={RAIO_BOLA * 2}
        height={RAIO_BOLA * 2}
        align="center"
        verticalAlign="middle"
        offsetX={RAIO_BOLA}
        offsetY={RAIO_BOLA}
      />
    </Group>
  );
};

export default ItemBall;