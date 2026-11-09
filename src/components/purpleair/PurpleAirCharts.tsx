"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface ChartSeries {
  name: string;
  color: string;
}

/** One row per timestamp (or day), with a PM2.5 value per sensor name. */
export type ChartRow = { label: string } & Record<string, number | string>;

const axisTick = { fontSize: 12, fill: "#5e5873", fontFamily: "var(--font-mono)" };
const pmFormatter = (value: unknown) => `${Number(value).toFixed(1)} µg/m³`;

export function HourlyChart({
  rows,
  series,
}: {
  rows: ChartRow[];
  series: ChartSeries[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={rows} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid stroke="#e4e0ec" vertical={false} />
        <XAxis dataKey="label" tick={axisTick} stroke="#e4e0ec" tickLine={false} minTickGap={40} />
        <YAxis
          tick={axisTick}
          axisLine={false}
          tickLine={false}
          label={{ value: "µg/m³", angle: -90, position: "insideLeft", fontSize: 12, fill: "#5e5873" }}
        />
        <Tooltip formatter={pmFormatter} />
        <Legend verticalAlign="top" height={32} iconType="circle" />
        {series.map((s) => (
          <Line
            key={s.name}
            type="monotone"
            dataKey={s.name}
            stroke={s.color}
            strokeWidth={1.5}
            dot={false}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function DailyChart({
  rows,
  series,
}: {
  rows: ChartRow[];
  series: ChartSeries[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={rows} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid stroke="#e4e0ec" vertical={false} />
        <XAxis dataKey="label" tick={axisTick} stroke="#e4e0ec" tickLine={false} />
        <YAxis tick={axisTick} axisLine={false} tickLine={false} />
        <Tooltip formatter={pmFormatter} />
        <Legend verticalAlign="top" height={32} iconType="circle" />
        {series.map((s) => (
          <Bar key={s.name} dataKey={s.name} fill={s.color} radius={[4, 4, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
