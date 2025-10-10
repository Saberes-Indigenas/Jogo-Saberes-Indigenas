import { useState, useEffect, useRef } from "react";
import { Group, Circle, Text, Rect } from "react-konva";
import Konva from "konva";
import type { Item } from "../types";

interface ItemBallProps {
  item: Item;
  initial_pos: { x: number; y: number };
  isDraggable?: boolean;
}

const ITEM_RAIO_VISUAL = 50;

const ItemBall = ({ item, initial_pos, isDraggable = true }: ItemBallProps) => {
  // --- Refs e Estados para Animação ---
  const groupRef = useRef<Konva.Group>(null);
  const iconRef = useRef<Konva.Text>(null);

  // Controla se o mouse está sobre o item
  const [isHovered, setIsHovered] = useState(false);
  // Controla se o item está a ser pressionado
  const [isPressed, setIsPressed] = useState(false);

  // --- Efeito de Sombra Brutalista ---
  // A sombra muda com base no estado de hover
  const shadowProps = {
    shadowColor: "black",
    shadowBlur: 0, // Sombra dura, sem desfoque
    shadowOpacity: 1,
    shadowOffsetX: isHovered ? 10 : 4,
    shadowOffsetY: isHovered ? 10 : 4,
    shadowEnabled: true,
  };

  // --- Animação de Hover (mover e rodar) ---
  useEffect(() => {
    if (groupRef.current) {
      const tween = new Konva.Tween({
        node: groupRef.current,
        duration: 0.2,
        easing: Konva.Easings.EaseOut,
        x: isHovered ? initial_pos.x - 6 : initial_pos.x,
        y: isHovered ? initial_pos.y - 6 : initial_pos.y,
        rotation: isHovered ? 2 : 0,
      });
      tween.play();
    }
  }, [isHovered, initial_pos]);

  // --- Animação de Pressionar (escala) ---
  useEffect(() => {
    if (groupRef.current) {
      const scale = isPressed ? 0.95 : 1;
      const tween = new Konva.Tween({
        node: groupRef.current,
        duration: 0.1,
        scaleX: scale,
        scaleY: scale,
      });
      tween.play();
    }
  }, [isPressed]);

  // --- Animação Contínua do Ícone (girar) ---
  useEffect(() => {
    if (!iconRef.current) return;

    // Usamos Konva.Animation para animações contínuas (loop)
    const angularSpeed = 90; // graus por segundo
    const anim = new Konva.Animation((frame) => {
      if (!frame) return;
      const angleDiff = (frame.timeDiff * angularSpeed) / 1000;
      iconRef.current?.rotate(angleDiff);
    }, iconRef.current.getLayer());

    if (isHovered) {
      anim.start(); // Inicia a animação em hover
    } else {
      anim.stop(); // Para a animação
      iconRef.current.rotation(0); // Reseta a rotação
    }

    return () => {
      anim.stop(); // Limpeza ao desmontar
    };
  }, [isHovered]);

  return (
    <Group
      ref={groupRef}
      x={initial_pos.x}
      y={initial_pos.y}
      draggable={isDraggable}
      // Eventos para controlar os estados de hover e pressionar
      onMouseEnter={() => {
        setIsHovered(true);
        const stage = groupRef.current?.getStage();
        if (stage) stage.container().style.cursor = "pointer";
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false); // Garante que o estado de pressionado seja resetado
        const stage = groupRef.current?.getStage();
        if (stage) stage.container().style.cursor = "default";
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      <Circle
        radius={ITEM_RAIO_VISUAL}
        fill={item.color}
        stroke="#fff"
        strokeWidth={3}
        {...shadowProps} // Aplica as propriedades da sombra
      />
      <Text
        ref={iconRef}
        text={item.icon}
        fontSize={30}
        fill="#f5f5f5"
        align="center"
        verticalAlign="middle"
        width={ITEM_RAIO_VISUAL * 2}
        height={ITEM_RAIO_VISUAL * 2}
        offsetX={ITEM_RAIO_VISUAL}
        offsetY={ITEM_RAIO_VISUAL}
        listening={false}
      />
      <Group y={ITEM_RAIO_VISUAL + 18} listening={false}>
        <Rect
          x={-ITEM_RAIO_VISUAL - 20}
          width={ITEM_RAIO_VISUAL * 2 + 40}
          height={54}
          fill="rgba(0, 0, 0, 0.55)"
          cornerRadius={20}
        />
        <Text
          text={item.name_boe}
          fontFamily="Nunito"
          fontStyle="bold"
          fontSize={16}
          fill="#fff59d"
          width={ITEM_RAIO_VISUAL * 2 + 40}
          align="center"
          y={6}
        />
        <Text
          text={`(${item.name})`}
          fontFamily="Nunito"
          fontSize={13}
          fill="#f5f5f5"
          width={ITEM_RAIO_VISUAL * 2 + 40}
          align="center"
          y={28}
        />
      </Group>
    </Group>
  );
};

export default ItemBall;
