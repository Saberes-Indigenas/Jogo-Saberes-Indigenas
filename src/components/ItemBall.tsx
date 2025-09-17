import { Group, Circle, Text } from "react-konva";
import type { Item } from "../types"; // Importando do nosso arquivo de tipos

interface ItemBallProps {
  item: Item;
  initial_pos: { x: number; y: number };
  isDraggable?: boolean;
}

const ITEM_RAIO_VISUAL = 40;

const ItemBall = ({ item, initial_pos, isDraggable = true }: ItemBallProps) => {
  return (
    <Group x={initial_pos.x} y={initial_pos.y} draggable={isDraggable}>
      <Circle
        radius={ITEM_RAIO_VISUAL}
        fill={item.color} // Agora isso funciona perfeitamente!
        stroke="#fff"
        strokeWidth={2}
        shadowColor="black"
        shadowBlur={10}
        shadowOpacity={0.5}
      />
      <Text
        text={item.icon} // Usando o ícone do nosso JSON
        fontSize={30}
        fill="#f5f5f5"
        align="center"
        verticalAlign="middle"
        width={ITEM_RAIO_VISUAL * 2}
        height={ITEM_RAIO_VISUAL * 2}
        offsetX={ITEM_RAIO_VISUAL}
        offsetY={ITEM_RAIO_VISUAL}
        listening={false} // Impede que o texto intercepte eventos de arrastar
      />
    </Group>
  );
};

export default ItemBall;
