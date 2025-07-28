import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Circle as KonvaCircle } from 'react-konva'; // Importamos KonvaCircle para o estilo
import { motion } from 'framer-motion';
import type { Clan, Item } from '../types';
import ItemBall from './item-ball';
import '../css/GameStage.css';



interface GameStageProps {
  clans: Clan[];
  initialItems: Item[];
}

const MENU_LARGURA = 200;

const RAIO_PALCO_CIRCULAR = 250;
const CENTRO_X_PALCO_CIRCULAR = 300;
const CENTRO_Y_PALCO_CIRCULAR = 300;

const ITEM_RAIO_VISUAL = 60; // Raio da sua ItemBall

const GameStage = ({ clans, initialItems }: GameStageProps) => {
  const [stageItems, setStageItems] = useState<Item[]>([]);
  const [menuItems, setMenuItems] = useState<Item[]>(initialItems);
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const draggedItemRef = useRef<Item | null>(null);
  const stageContainerRef = useRef<HTMLDivElement>(null);

  // Função auxiliar para ajustar a posição de um ponto para dentro do círculo
  // Esta função agora será usada principalmente pelo dragBoundFunc
  const clampPointToCircle = (pos: { x: number; y: number }) => {
    const dx = pos.x - CENTRO_X_PALCO_CIRCULAR;
    const dy = pos.y - CENTRO_Y_PALCO_CIRCULAR;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Se o centro do item + o raio do item exceder o raio do palco
    if (distance + ITEM_RAIO_VISUAL > RAIO_PALCO_CIRCULAR) {
      const angle = Math.atan2(dy, dx);
      // Calcula a nova posição na borda, garantindo que o item não saia
      const newX = CENTRO_X_PALCO_CIRCULAR + (RAIO_PALCO_CIRCULAR - ITEM_RAIO_VISUAL) * Math.cos(angle);
      const newY = CENTRO_Y_PALCO_CIRCULAR + (RAIO_PALCO_CIRCULAR - ITEM_RAIO_VISUAL) * Math.sin(angle);
      return { x: newX, y: newY };
    }
    return pos;
  };

  const handleDragStart = (e: React.DragEvent, item: Item) => {
    draggedItemRef.current = item;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    if (!draggedItemRef.current || !stageContainerRef.current) return;

    setMenuItems(menuItems.filter(item => item.id !== draggedItemRef.current!.id));

    const stageRect = stageContainerRef.current.getBoundingClientRect();
    let dropPosition = {
      x: e.clientX - stageRect.left,
      y: e.clientY - stageRect.top,
    };

    // Ajusta a posição de drop para dentro do círculo
    dropPosition = clampPointToCircle(dropPosition);

    const newItemForStage: Item = {
      ...draggedItemRef.current,
      initial_pos: dropPosition,
    };
    setStageItems(prevItems => [...prevItems, newItemForStage]);

    draggedItemRef.current = null;
  };

  // Nao precisamos mais de handleItemDragEnd, pois dragBoundFunc fará o trabalho
  // const handleItemDragEnd = (itemId: string, newX: number, newY: number) => {
  //   setStageItems(prevItems =>
  //     prevItems.map(item => {
  //       if (item.id === itemId) {
  //         const clampedPos = clampPointToCircle({ x: newX, y: newY });
  //         return { ...item, initial_pos: clampedPos };
  //       }
  //       return item;
  //     })
  //   );
  // };

  // Este useEffect para reajuste de posição pode ser simplificado ou removido se dragBoundFunc for suficiente
  // Porém, mantê-lo para ajustes iniciais ou estados pode ser útil.
  useEffect(() => {
    setStageItems(prevItems =>
      prevItems.map(item => {
        const clampedPos = clampPointToCircle(item.initial_pos);
        if (clampedPos.x !== item.initial_pos.x || clampedPos.y !== item.initial_pos.y) {
          return { ...item, initial_pos: clampedPos };
        }
        return item;
      })
    );
  }, [stageItems]); // Monitore stageItems para reajustar se necessário


  return (
    <div className="game-container">
      <button className="menu-toggle-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? 'Fechar' : 'Abrir'} Menu
      </button>

      <div
        className="stage-container"
        ref={stageContainerRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Stage
          width={600}
          height={600}
          style={{ border: '1px solid #ccc' }}
        >
          <Layer
            // A máscara de clipping continua aqui para garantir que nada seja visível fora do círculo
            clipFunc={(ctx) => {
              ctx.arc(CENTRO_X_PALCO_CIRCULAR, CENTRO_Y_PALCO_CIRCULAR, RAIO_PALCO_CIRCULAR, 0, Math.PI * 2, false);
            }}
          >
            {/* Círculo visual para estilizar o palco */}
            <KonvaCircle
              x={CENTRO_X_PALCO_CIRCULAR}
              y={CENTRO_Y_PALCO_CIRCULAR}
              radius={RAIO_PALCO_CIRCULAR}
              fillLinearGradientStartPoint={{ x: -RAIO_PALCO_CIRCULAR, y: -RAIO_PALCO_CIRCULAR }}
              fillLinearGradientEndPoint={{ x: RAIO_PALCO_CIRCULAR, y: RAIO_PALCO_CIRCULAR }}
              fillLinearGradientColorStops={[0, '#add8e6', 1, '#87ceeb']} // Gradiente azul claro
              stroke="#555" // Borda mais escura
              strokeWidth={8} // Borda mais grossa
              shadowColor="black"
              shadowBlur={15}
              shadowOpacity={0.4}
              shadowOffsetX={10}
              shadowOffsetY={10}
            />

            {stageItems.map((item) => (
              <ItemBall
                key={item.id}
                item={item}
                // Passa a função dragBoundFunc para o ItemBall
                dragBoundFunc={clampPointToCircle}
                // Não precisamos mais do onDragEnd para restringir, mas podemos mantê-lo se for para outra lógica.
                // onDragEnd={(e) => handleItemDragEnd(item.id, e.target.x(), e.target.y())}
              />
            ))}
          </Layer>
        </Stage>
      </div>

      <motion.div
        className="side-menu"
        animate={{ x: isMenuOpen ? 0 : MENU_LARGURA }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ width: MENU_LARGURA }}
      >
        <h3>Itens</h3>
        <div className="menu-item-list">
          {menuItems.map(item => (
            <div
              key={item.id}
              className="menu-item"
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
            >
              {item.name}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default GameStage;