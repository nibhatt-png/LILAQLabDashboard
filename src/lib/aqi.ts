export interface AqiCategory {
  label: string;
  /** Upper bound of the category (inclusive). */
  max: number;
  color: string;
}

// EPA AQI bands, in the colors used by the LILAQ display.
export const AQI_CATEGORIES: AqiCategory[] = [
  { label: "Good", max: 50, color: "#4caf50" },
  { label: "Moderate", max: 100, color: "#ffeb3b" },
  { label: "Somewhat Unhealthy", max: 150, color: "#ff9800" },
  { label: "Unhealthy", max: 200, color: "#f44336" },
  { label: "Very Unhealthy", max: 300, color: "#9c27b0" },
  { label: "Hazardous", max: 500, color: "#880e4f" },
];

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

export function getPmColor(value: number, type: "pm25" | "pm10"): string {
  const limits = type === "pm25" ? [12, 35.4, 55.4] : [54, 154, 254];
  if (value <= limits[0]) return "#4caf50";
  if (value <= limits[1]) return "#ffeb3b";
  if (value <= limits[2]) return "#ff9800";
  return "#f44336";
}
