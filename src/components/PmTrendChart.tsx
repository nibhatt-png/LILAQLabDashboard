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
import { quantAqHourly } from "@/data/airQuality";

const series = [
  { key: "PM1", name: "PM1", color: "#10b981" },
  { key: "PM2_5", name: "PM2.5", color: "#f59e0b" },
  { key: "PM10", name: "PM10", color: "#ef4444" },
] as const;

const axisTick = { fontSize: 12, fill: "#6b7280" };
const axisLabel = { fontSize: 12, fill: "#808080" };

export default function PmTrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={quantAqHourly}
        margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="hour"
          ticks={[1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23]}
          tickFormatter={(hour: number) => `${hour}:00`}
          stroke="#666"
          tick={axisTick}
          label={{ value: "Hour", position: "insideBottom", offset: -12, ...axisLabel }}
        />
        <YAxis
          domain={[0, 60]}
          ticks={[0, 15, 30, 45, 60]}
          stroke="#666"
          tick={axisTick}
          label={{ value: "µg/m³", angle: -90, position: "insideLeft", ...axisLabel }}
        />
        <Tooltip
          contentStyle={{ border: "1px solid #e5e7eb", borderRadius: 8 }}
          labelFormatter={(hour) => `${hour}:00`}
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
