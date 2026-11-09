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
  { key: "PM2_5", name: "PM2.5", color: "#6a4bd1" },
  { key: "PM10", name: "PM10", color: "#b0307a" },
] as const;

const MONO = "var(--font-mono)";
const axisTick = { fontSize: 13, fill: "#5e5873", fontFamily: MONO };
const axisLabel = { fontSize: 13, fill: "#5e5873", fontFamily: MONO };

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
        <CartesianGrid stroke="#e4e0ec" vertical={false} />
        <XAxis
          dataKey="label"
          interval={1}
          stroke="#e4e0ec"
          tickLine={false}
          tick={axisTick}
          label={{ value: "Hour", position: "insideBottom", offset: -12, ...axisLabel }}
        />
        <YAxis
          domain={[0, "auto"]}
          axisLine={false}
          tickLine={false}
          tick={axisTick}
          label={{ value: "µg/m³", angle: -90, position: "insideLeft", ...axisLabel }}
        />
        <Tooltip
          contentStyle={{ border: "1px solid #e4e0ec", borderRadius: 8, color: "#1c1830" }}
          formatter={(value) => `${Number(value).toFixed(2)} µg/m³`}
        />
        <Legend
          verticalAlign="top"
          height={36}
          iconType="circle"
          wrapperStyle={{ fontSize: 16, color: "#3b3550" }}
        />
        {series.map(({ key, name, color }) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            name={name}
            stroke={color}
            strokeWidth={2.5}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
