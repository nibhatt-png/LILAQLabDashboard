export interface AqiCategory {
  label: string;
  /** Upper bound of the category (inclusive). */
  max: number;
  color: string;
  /** Text color that stays readable on top of `color`. */
  text: string;
}

const DARK_TEXT = "#1e2939";
const LIGHT_TEXT = "#ffffff";

// EPA AQI bands, in the colors used by the LILAQ display. These are the only
// place green, yellow, orange and red appear, so they always mean good-to-bad.
export const AQI_CATEGORIES: AqiCategory[] = [
  { label: "Good", max: 50, color: "#4caf50", text: DARK_TEXT },
  { label: "Moderate", max: 100, color: "#ffeb3b", text: DARK_TEXT },
  { label: "Somewhat Unhealthy", max: 150, color: "#ff9800", text: DARK_TEXT },
  { label: "Unhealthy", max: 200, color: "#f44336", text: LIGHT_TEXT },
  { label: "Very Unhealthy", max: 300, color: "#9c27b0", text: LIGHT_TEXT },
  { label: "Hazardous", max: 500, color: "#880e4f", text: LIGHT_TEXT },
];

// EPA PM2.5 breakpoints (2024 revision): [PM2.5 low, PM2.5 high, AQI low, AQI high].
const PM25_BREAKPOINTS = [
  [0, 9, 0, 50],
  [9.1, 35.4, 51, 100],
  [35.5, 55.4, 101, 150],
  [55.5, 125.4, 151, 200],
  [125.5, 225.4, 201, 300],
  [225.5, 325.4, 301, 500],
];

/** US EPA AQI for a PM2.5 concentration in µg/m³. */
export function pm25ToAqi(pm25: number): number {
  const c = Math.max(0, Math.floor(pm25 * 10) / 10);
  const band = PM25_BREAKPOINTS.find((b) => c <= b[1]);
  if (!band) return 500;
  const [cLow, cHigh, aqiLow, aqiHigh] = band;
  return Math.round(((aqiHigh - aqiLow) / (cHigh - cLow)) * (c - cLow) + aqiLow);
}

export function getAqiCategory(aqi: number): AqiCategory {
  return AQI_CATEGORIES.find((c) => aqi <= c.max) ?? AQI_CATEGORIES.at(-1)!;
}

/**
 * Position of an AQI value along the scale bar, as a percentage. Each
 * category gets an equal-width segment, so the value is interpolated
 * within its own segment.
 */
export function getAqiScalePosition(aqi: number): number {
  const index = AQI_CATEGORIES.findIndex((c) => aqi <= c.max);
  if (index === -1) return 100;
  const min = index === 0 ? 0 : AQI_CATEGORIES[index - 1].max;
  const fraction = (aqi - min) / (AQI_CATEGORIES[index].max - min);
  return ((index + fraction) / AQI_CATEGORIES.length) * 100;
}

// EPA PM10 breakpoints: the top of each AQI band, in µg/m³.
const PM10_LIMITS = [54, 154, 254, 354, 424, 604];

/** The AQI band a PM2.5 or PM10 concentration (µg/m³) falls in. */
export function getPmCategory(value: number, type: "pm25" | "pm10"): AqiCategory {
  const limits = type === "pm25" ? PM25_BREAKPOINTS.map((b) => b[1]) : PM10_LIMITS;
  const index = limits.findIndex((max) => value <= max);
  return AQI_CATEGORIES[index] ?? AQI_CATEGORIES.at(-1)!;
}
