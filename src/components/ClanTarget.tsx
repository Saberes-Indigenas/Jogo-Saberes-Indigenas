import { Circle, Text, Group } from "react-konva";

interface ClanTargetProps {
  clanName: string;
  x: number;
  y: number;
}

const ClanTarget = ({ clanName, x, y }: ClanTargetProps) => {
  return (
    <Group x={x} y={y}>
      <Circle
        radius={50}
        stroke="#f5f5ff"
        strokeWidth={3}
        opacity={0.9}
        shadowColor="black"
        shadowBlur={10}
        shadowOpacity={0.7}
      />
      <Text
        text={clanName}
        x={-45}
        y={55}
        width={90}
        align="center"
        fontSize={11}
        fontStyle="bold"
        fill="#f5f5f5"
        listening={false}
        shadowColor="black"
        shadowBlur={5}
        shadowOpacity={0.8}
      />
    </Group>
  );
};

export default ClanTarget;
