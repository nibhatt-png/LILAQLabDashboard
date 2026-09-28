// Static readings shown on the display. Replace with live sensor data.

export const campusAqi = 30;

export interface Sensor {
  name: string;
  aqi: number;
  /** Marker center, as a percentage of the campus map. */
  x: number;
  y: number;
  /** Label offset from the marker center, in px at full (1920px) scale. */
  labelX: number;
  labelY: number;
}

export const sensors: Sensor[] = [
  { name: "Parsons (outdoors)", aqi: 29, x: 10.61, y: 25.76, labelX: -40, labelY: 32 },
  { name: "Shanahan (outdoors)", aqi: 26, x: 39.33, y: 13.77, labelX: -108, labelY: 31 },
  { name: "Platt (indoors)", aqi: 5, x: 60.55, y: 17.48, labelX: -38, labelY: 32 },
  { name: "Drinkward (indoors)", aqi: 60, x: 80.67, y: 30.15, labelX: -80, labelY: 32 },
  { name: "Kingston (outdoors)", aqi: 28, x: 31.94, y: 66.64, labelX: -5, labelY: -66 },
];

export interface HourlyPm {
  hour: number;
  PM1: number;
  PM2_5: number;
  PM10: number;
}

// Hourly averages from the lab's QuantAQ sensor (quantAQ1.csv).
export const quantAqHourly: HourlyPm[] = [
  { hour: 0, PM1: 2.92, PM2_5: 3.44, PM10: 5.33 },
  { hour: 1, PM1: 1.79, PM2_5: 2.34, PM10: 8.08 },
  { hour: 2, PM1: 0.06, PM2_5: 0.32, PM10: 1.33 },
  { hour: 3, PM1: 0.02, PM2_5: 0.32, PM10: 0.45 },
  { hour: 4, PM1: 0.16, PM2_5: 0.41, PM10: 3.15 },
  { hour: 5, PM1: 1.54, PM2_5: 2.18, PM10: 17.41 },
  { hour: 6, PM1: 0.02, PM2_5: 0.31, PM10: 1.21 },
  { hour: 7, PM1: 0.46, PM2_5: 1.32, PM10: 5.35 },
  { hour: 8, PM1: 0.62, PM2_5: 0.98, PM10: 26.53 },
  { hour: 9, PM1: 0.86, PM2_5: 1.79, PM10: 36.29 },
  { hour: 10, PM1: 0.07, PM2_5: 0.33, PM10: 22.1 },
  { hour: 11, PM1: 0.03, PM2_5: 0.32, PM10: 0.45 },
  { hour: 12, PM1: 0.16, PM2_5: 0.59, PM10: 14.57 },
  { hour: 13, PM1: 0.84, PM2_5: 1.3, PM10: 18.79 },
  { hour: 14, PM1: 1.59, PM2_5: 2.07, PM10: 3.9 },
  { hour: 15, PM1: 0.01, PM2_5: 0.52, PM10: 2.23 },
  { hour: 16, PM1: 0.04, PM2_5: 0.6, PM10: 8.71 },
  { hour: 17, PM1: 0.83, PM2_5: 1.28, PM10: 6.46 },
  { hour: 18, PM1: 1.6, PM2_5: 2.4, PM10: 6.98 },
  { hour: 19, PM1: 3.19, PM2_5: 3.73, PM10: 6.75 },
  { hour: 20, PM1: 1.77, PM2_5: 2.47, PM10: 21.43 },
  { hour: 21, PM1: 1.45, PM2_5: 2.12, PM10: 10.9 },
  { hour: 22, PM1: 1.27, PM2_5: 1.82, PM10: 3.02 },
  { hour: 23, PM1: 10.73, PM2_5: 12.13, PM10: 42.28 },
];

/** "Current" readings: the average of the last six hours. */
export function currentPm(key: "PM1" | "PM2_5" | "PM10"): number {
  const recent = quantAqHourly.slice(-6);
  return recent.reduce((sum, d) => sum + d[key], 0) / recent.length;
}

export interface AcsmComponent {
  name: string;
  /** Name used on the stacked bar, which differs slightly from the cards. */
  barName: string;
  value: number;
  color: string;
  /** Segment width on the stacked bar, as a percentage (from the design). */
  barWidth: number;
  whatAreThey: string;
  effects: string;
}

export const acsmComponents: AcsmComponent[] = [
  {
    name: "Organics",
    barName: "Organics",
    value: 18.76,
    color: "#22c55e",
    barWidth: 67.95,
    whatAreThey:
      "Carbon-based particles from combustion (like vehicle exhaust) and plant processes. Wildfire smoke can also cause spikes in organic particulates in the air.",
    effects:
      "Organics are linked to respiratory irritation and cardiovascular effects.",
  },
  {
    name: "Nitrates",
    barName: "Nitrates",
    value: 3.85,
    color: "#3b82f6",
    barWidth: 10.06,
    whatAreThey:
      "Particles formed when nitrogen oxides from activities like fossil fuel combustion and biomass burning react in the atmosphere. Unfortunately the Inland Empire has some of the highest traffic-related pollution in the US.",
    effects:
      "Nitrates are associated with smog formation, and also respiratory issues particularly in children and older adults.",
  },
  {
    name: "Sulfates",
    barName: "Sulfate",
    value: 1.12,
    color: "#ef4444",
    barWidth: 8.07,
    whatAreThey:
      "Particles formed from sulfur dioxide released by burning fossil fuels like coal and diesel.",
    effects:
      "Long term exposure to sulfates is linked to lung disease. Additionally sulfates can cause acid rain and travel far from their origin source.",
  },
  {
    name: "Ammonium",
    barName: "Ammonium",
    value: 1.35,
    color: "#f59e0b",
    barWidth: 7.61,
    whatAreThey:
      "Particles formed when ammonia from agriculture reacts with sulfuric or nitric acid. Agricultural regions surrounding the Inland Empire are significant sources of ammonia.",
    effects:
      "Ammonium contributes to haze and reacts with other pollutants to make harmful particles.",
  },
  {
    name: "Chlorides",
    barName: "Chloride",
    value: 0.66,
    color: "#a855f7",
    barWidth: 6.31,
    whatAreThey:
      "Chlorides are salt based particles from natural and industrial sources. Some chlorides come from sea spray carried inland from the coast, and some come from corporate activities like burning coal.",
    effects:
      "Chlorine can cause breathing issues and contribute to the overall particulate regulation in the air.",
  },
];
