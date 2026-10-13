"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Blue, violet and magenta only tell the lines apart. Green, yellow and red
// are kept for air quality levels, so they aren't used here.
const series = [
  { key: "PM1", name: "PM1", color: "#2e96dc" },
  { key: "PM2_5", name: "PM2.5", color: "#7c3aed" },
  { key: "PM10", name: "PM10", color: "#b0307a" },
] as const;

const axisTick = { fontSize: 12, fill: "#6b7280" };
const axisLabel = { fontSize: 12, fill: "#808080" };

export interface PmTrendRow {
  /** Hour label in campus time, e.g. "4 PM". */
  label: string;
  PM1: number;
  PM2_5: number;
  PM10: number;
}

export default function PmTrendChart({ rows }: { rows: PmTrendRow[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={rows}
        margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="label"
          interval={1}
          stroke="#666"
          tick={axisTick}
          label={{ value: "Hour", position: "insideBottom", offset: -12, ...axisLabel }}
        />
        <YAxis
          domain={[0, "auto"]}
          stroke="#666"
          tick={axisTick}
          label={{ value: "µg/m³", angle: -90, position: "insideLeft", ...axisLabel }}
        />
        <Tooltip
          contentStyle={{ border: "1px solid #e5e7eb", borderRadius: 8 }}
          formatter={(value) => `${Number(value).toFixed(2)} µg/m³`}
        />
        <Legend
          verticalAlign="top"
          height={36}
          wrapperStyle={{ fontSize: 16 }}
        />
        {series.map(({ key, name, color }) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            name={name}
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
