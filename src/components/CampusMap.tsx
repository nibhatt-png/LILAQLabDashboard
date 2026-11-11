import {
  MAP_HEIGHT,
  MAP_WIDTH,
  buildings,
  green,
  labels,
  parking,
  paths,
  roads,
} from "@/components/campusMapData";

// Building footprints, roads and paths around the Harvey Mudd academic quad,
// drawn to scale from OpenStreetMap in the LILAQ Lab website's map colors.
const FILL = { building: "#FFFFFF", dorm: "#F3D9CE", roof: "#F7F5FB" };
const OUTLINE = "#D3CCE3";

export default function CampusMap({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      aria-hidden="true"
      className={className}
    >
      <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="#EAF6EE" />
      {green.map((d, i) => (
        <path key={i} d={d} fill="#CDEBD6" />
      ))}
      {parking.map((d, i) => (
        <path key={i} d={d} fill="#E6E1F2" />
      ))}
      {/* Roads: an outline stroke with a slightly narrower white one on top. */}
      {roads.map(([width, d], i) => (
        <path key={i} d={d} fill="none" stroke="#D9D2EC" strokeWidth={width + 3} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {roads.map(([width, d], i) => (
        <path key={i} d={d} fill="none" stroke="#FFFFFF" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#F4EBD6" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {buildings.map(([kind, d], i) => (
        <path
          key={i}
          d={d}
          fillRule="evenodd"
          fill={FILL[kind]}
          stroke={OUTLINE}
          strokeWidth={1.5}
          strokeDasharray={kind === "roof" ? "4 3" : undefined}
          strokeLinejoin="round"
        />
      ))}
      {labels.map(([name, x, y]) => (
        <text
          key={name}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#9a93ad"
          fontFamily="var(--font-mono)"
          fontSize={11}
        >
          {name}
        </text>
      ))}
    </svg>
  );
}
