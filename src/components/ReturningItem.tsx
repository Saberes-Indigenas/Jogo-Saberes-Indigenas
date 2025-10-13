import { useEffect, useRef } from "react";
import { Group } from "react-konva";
import Konva from "konva";
import ItemBall from "./ItemBall";
import type { Item } from "../types";

interface ReturningItemProps {
  itemData: Item;
  startPos: { x: number; y: number };
  // ADICIONADO: A posição final agora é uma propriedade obrigatória.
  endPos: { x: number; y: number };
  onComplete: () => void;
}

const ReturningItem = ({
  itemData,
  startPos,
  endPos, // MODIFICADO: Usamos o endPos vindo das props.
  onComplete,
}: ReturningItemProps) => {
  const groupRef = useRef<Konva.Group>(null);

  useEffect(() => {
    if (groupRef.current) {
      if (startPos.x === endPos.x && startPos.y === endPos.y) {
        groupRef.current.visible(false);
        onComplete();
        return;
      }
      const tween = new Konva.Tween({
        node: groupRef.current,
        // Propriedades finais da animação agora usam o endPos das props.
        x: endPos.x,
        y: endPos.y,
        opacity: 1, // O item deve ficar visível no final
        scaleX: 1, // Anima para um tamanho pequeno antes de sumir
        scaleY: 1,
        duration: 0.5, // Duração da animação em segundos
        easing: Konva.Easings.EaseOut,

        onFinish: () => {
          // Esconde o grupo antes de chamar o onComplete
          if (groupRef.current) {
            groupRef.current.visible(false);
          }
          onComplete();
        },
      });

      // Não precisamos mais do setTimeout, a animação pode começar imediatamente.
      tween.play();

      // Função de limpeza para parar a animação se o componente for desmontado.
      return () => tween.destroy();
    }
  }, [onComplete, endPos.x, endPos.y, startPos.x, startPos.y]);

  return (
    <Group
      ref={groupRef}
      // O estado inicial é definido diretamente nas props do componente
      x={startPos.x}
      y={startPos.y}
      opacity={1}
      scaleX={1}
      scaleY={1}
      listening={false}
    >
      {/* O ItemBall é renderizado no centro do grupo (0,0) */}
      <ItemBall
        item={itemData}
        initial_pos={{ x: 0, y: 0 }}
        isDraggable={false}
      />
    </Group>
  );
};

export default ReturningItem;
