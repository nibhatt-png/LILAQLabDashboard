import type { SVGProps } from "react";

// The schematic campus drawing from the LILAQ Lab website's sensor map.
// It's wider than the dashboard's map box, so it fills the box's height and
// shows the middle of campus, cropping the far west and east edges.
const MAP_W = 1600;
const MAP_H = 620;

// [x, y, width, height]
type Box = [number, number, number, number];

const plazas: Box[] = [
  [40, 58, 270, 44],
  [800, 62, 420, 40],
  [1270, 62, 260, 40],
];

const lawns: Box[] = [
  [790, 228, 430, 58],
  [520, 95, 70, 170],
  [1262, 232, 250, 78],
  [1080, 300, 160, 90],
];

const buildings: Box[] = [
  [150, 112, 140, 88],
  [390, 112, 115, 92],
  [140, 206, 140, 72],
  [35, 182, 85, 118],
  [615, 118, 135, 78],
  [825, 130, 235, 90],
  [1085, 136, 135, 80],
  [1270, 124, 105, 92],
  [1395, 124, 115, 96],
  [30, 312, 95, 84],
  [165, 296, 130, 90],
  [385, 276, 92, 66],
  [605, 286, 175, 90],
  [820, 292, 240, 90],
  [1270, 338, 130, 100],
  [1420, 338, 120, 100],
  [110, 455, 190, 85],
  [1110, 462, 60, 58],
];

const dorms: Box[] = [
  [340, 445, 190, 70],
  [560, 450, 170, 58],
  [760, 452, 120, 70],
  [340, 540, 140, 80],
  [500, 530, 150, 90],
  [680, 540, 150, 80],
  [860, 500, 150, 60],
  [880, 580, 140, 40],
];

const trees: [number, number][] = [
  [330, 150], [360, 300], [560, 300], [700, 215], [1240, 215],
  [1550, 180], [1200, 450], [1300, 470], [40, 440], [1050, 520],
  [820, 500], [1500, 560], [1370, 560], [320, 520], [1020, 600],
];

const ROAD = "M-10 412 H880 Q1010 412 1100 470 Q1190 525 1230 640";

function Boxes({ boxes, rx, ...props }: { boxes: Box[]; rx: number } & SVGProps<SVGRectElement>) {
  return boxes.map(([x, y, width, height]) => (
    <rect key={`${x},${y}`} x={x} y={y} width={width} height={height} rx={rx} {...props} />
  ));
}

export default function CampusMap({ className }: { className?: string }) {
  const building = { rx: 10, stroke: "#D3CCE3", strokeWidth: 1.5 };

  return (
    <svg
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={className}
    >
      <rect width={MAP_W} height={MAP_H} fill="#EAF6EE" />
      <Boxes boxes={plazas} rx={8} fill="#E6E1F2" />
      <Boxes boxes={lawns} rx={12} fill="#CDEBD6" />
      <path d="M1290 520 Q1450 480 1600 500 L1600 620 L1260 620 Z" fill="#CDEBD6" />
      <path
        d="M300 240 H1240 M560 120 V400 M800 110 V400 M1060 220 V400"
        stroke="#F4EBD6"
        strokeWidth={9}
        fill="none"
        strokeLinecap="round"
      />
      <circle cx={548} cy={250} r={16} fill="#F4EBD6" />
      <rect x={-10} y={8} width={1620} height={42} fill="#FFFFFF" stroke="#D9D2EC" strokeWidth={2} />
      <path d={ROAD} fill="none" stroke="#D9D2EC" strokeWidth={32} strokeLinecap="round" />
      <path d={ROAD} fill="none" stroke="#FFFFFF" strokeWidth={29} strokeLinecap="round" />
      <rect x={1232} y={48} width={22} height={580} fill="#FFFFFF" stroke="#D9D2EC" strokeWidth={2} />
      <Boxes boxes={buildings} fill="#FFFFFF" {...building} />
      <Boxes boxes={dorms} fill="#F3D9CE" {...building} />
      {trees.map(([cx, cy]) => (
        <circle key={`${cx},${cy}`} cx={cx} cy={cy} r={11} fill="#B7DFC1" />
      ))}
    </svg>
  );
}
