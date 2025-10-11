import { useEffect, useRef } from "react";
import { Group, Star, RegularPolygon } from "react-konva";
import Konva from "konva";
import ItemCard from "./ItemCard";
import type { EnteringOffering as EnteringOfferingState } from "../hooks/useGameLogic";

interface EnteringOfferingProps {
  offering: EnteringOfferingState;
  onComplete: (offering: EnteringOfferingState) => void;
}

const TRAVEL_DURATION = 900;

const EnteringOffering = ({ offering, onComplete }: EnteringOfferingProps) => {
  const groupRef = useRef<Konva.Group>(null);
  const sparkleRef = useRef<Konva.Group>(null);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    group.position(offering.startPos);
    group.opacity(0.98);
    group.scale({ x: 1, y: 1 });
    group.rotation(0);
    group.listening(false);
    group.moveToTop();

    const layer = group.getLayer();
    if (!layer) return;

    let animation: Konva.Animation | null = null;
    let finished = false;

    animation = new Konva.Animation((frame) => {
      if (!frame || !group) return;
      const progress = Math.min(frame.time / TRAVEL_DURATION, 1);
      const eased = Konva.Easings.EaseInOut(progress, 0, 1, 1);
      const swirl = Math.sin(progress * Math.PI * 4) * 22;
      const rise = Math.sin(progress * Math.PI) * 90 * (1 - progress * 0.35);

      const nextX =
        offering.startPos.x + (offering.endPos.x - offering.startPos.x) * eased + swirl;
      const nextY =
        offering.startPos.y + (offering.endPos.y - offering.startPos.y) * eased - rise;

      group.position({ x: nextX, y: nextY });
      group.rotation(Math.sin(progress * Math.PI * 3.4) * 12);

      const shrink = 1 - progress * 0.55;
      const stretch = 1 - progress * 0.35 + Math.sin(progress * Math.PI * 2) * 0.05;
      group.scale({ x: shrink, y: stretch });
      group.opacity(0.95 - progress * 0.5);

      if (progress >= 1 && !finished) {
        finished = true;
        animation?.stop();
        onComplete(offering);
      }
    }, layer);

    animation.start();

    return () => {
      animation?.stop();
    };
  }, [offering, onComplete]);

  useEffect(() => {
    const sparkle = sparkleRef.current;
    if (!sparkle) return;

    const layer = sparkle.getLayer();
    if (!layer) return;

    const animation = new Konva.Animation((frame) => {
      if (!frame) return;
      const pulse = (Math.sin(frame.time / 150) + 1) / 2;
      sparkle.scale({ x: 0.85 + pulse * 0.25, y: 0.85 + pulse * 0.25 });
      sparkle.opacity(0.45 + pulse * 0.4);
      sparkle.rotation(pulse * 30);
    }, layer);

    animation.start();

    return () => {
      animation.stop();
    };
  }, []);

  return (
    <Group ref={groupRef}>
      <Group ref={sparkleRef} listening={false} opacity={0.75}>
        <Star
          numPoints={6}
          innerRadius={46}
          outerRadius={76}
          fill="rgba(255, 241, 195, 0.55)"
          shadowColor="rgba(255, 204, 128, 0.6)"
          shadowBlur={18}
        />
        <RegularPolygon
          sides={4}
          radius={58}
          fill="rgba(255, 204, 128, 0.55)"
          rotation={45}
        />
      </Group>
      <ItemCard item={offering.item} initial_pos={{ x: -75, y: -95 }} isDraggable={false} />
    </Group>
  );
};

export default EnteringOffering;
