// Server-only: reads the PurpleAir API key from the environment.

export interface SensorConfig {
  id: number;
  name: string;
  color: string;
  /** Marker center, as a percentage of the campus map. */
  x: number;
  y: number;
  /** Label offset from the marker center, in px at full (1920px) scale. */
  labelX: number;
  labelY: number;
}

// Campus PurpleAir sensors (sensor index → display name). Map positions
// follow each sensor's PurpleAir coordinates, scaled so the four fill the
// map: Shanahan is the furthest east, Galileo the furthest west. The colors
// only tell the sensors apart on the charts, so they avoid green, yellow and
// red.
export const SENSORS: SensorConfig[] = [
  { id: 316573, name: "LILAQ-01 McGregor", color: "#7c3aed", x: 23, y: 73, labelX: -78, labelY: 32 },
  { id: 316607, name: "LILAQ-07 Galileo", color: "#0e8fa8", x: 12, y: 43, labelX: -70, labelY: 32 },
  { id: 327489, name: "LILAQ-04 Shanahan", color: "#2563eb", x: 88, y: 27, labelX: -78, labelY: 32 },
  { id: 327491, name: "LILAQ-06 Hixon Court", color: "#be185d", x: 47, y: 52, labelX: -90, labelY: 32 },
];

export interface Reading {
  /** Unix timestamp, seconds. */
  time: number;
  pm25: number;
}

export type SensorHistory =
  | { sensor: SensorConfig; readings: Reading[]; error?: undefined }
  | { sensor: SensorConfig; readings?: undefined; error: string };

export interface CurrentReading {
  sensor: SensorConfig;
  /** 10-minute average PM2.5 in µg/m³, or null if the sensor isn't reporting. */
  pm25: number | null;
}

const REVALIDATE_SECONDS = 600;
// PurpleAir sensors report every two minutes.
export const CURRENT_REVALIDATE_SECONDS = 120;
// A sensor that hasn't reported for this long is shown as offline.
const STALE_SECONDS = 60 * 60;

export function hasApiKey() {
  return Boolean(process.env.PURPLEAIR_API_KEY);
}

/**
 * Hourly PM2.5 history for one sensor. The time window is rounded down to
 * the revalidation interval so repeat requests hit Next's fetch cache instead
 * of spending PurpleAir API points.
 */
export async function fetchSensorHistory(
  sensor: SensorConfig,
  days: number,
): Promise<SensorHistory> {
  const now = Math.floor(Date.now() / 1000);
  const end = now - (now % REVALIDATE_SECONDS);
  const params = new URLSearchParams({
    fields: "pm2.5_atm",
    start_timestamp: String(end - days * 24 * 60 * 60),
    end_timestamp: String(end),
    average: "60",
  });

  try {
    const res = await fetch(
      `https://api.purpleair.com/v1/sensors/${sensor.id}/history?${params}`,
      {
        headers: { "X-API-Key": process.env.PURPLEAIR_API_KEY ?? "" },
        next: { revalidate: REVALIDATE_SECONDS },
      },
    );
    const body = await res.json();
    if (!res.ok) {
      return { sensor, error: body.description ?? `HTTP ${res.status}` };
    }

    const timeIdx = body.fields.indexOf("time_stamp");
    const pmIdx = body.fields.indexOf("pm2.5_atm");
    const readings: Reading[] = (body.data as (number | null)[][])
      .filter((row) => row[pmIdx] != null)
      .map((row) => ({ time: row[timeIdx]!, pm25: row[pmIdx]! }))
      .sort((a, b) => a.time - b.time); // PurpleAir doesn't guarantee order
    return { sensor, readings };
  } catch (err) {
    return { sensor, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Latest PM2.5 for every sensor in one request. Uses the 10-minute average,
 * the same averaging the PurpleAir map shows for these sensors.
 */
export async function fetchCurrentReadings(): Promise<CurrentReading[]> {
  const offline = SENSORS.map((sensor) => ({ sensor, pm25: null }));
  if (!hasApiKey()) return offline;

  const params = new URLSearchParams({
    show_only: SENSORS.map((s) => s.id).join(","),
    fields: "last_seen,pm2.5_10minute",
  });

  try {
    const res = await fetch(`https://api.purpleair.com/v1/sensors?${params}`, {
      headers: { "X-API-Key": process.env.PURPLEAIR_API_KEY ?? "" },
      next: { revalidate: CURRENT_REVALIDATE_SECONDS },
    });
    if (!res.ok) return offline;
    const body = await res.json();

    const idIdx = body.fields.indexOf("sensor_index");
    const seenIdx = body.fields.indexOf("last_seen");
    const pmIdx = body.fields.indexOf("pm2.5_10minute");
    const rows = body.data as (number | null)[][];

    return SENSORS.map((sensor) => {
      const row = rows.find((r) => r[idIdx] === sensor.id);
      const pm25 = row?.[pmIdx] ?? null;
      const reporting =
        row != null && body.time_stamp - (row[seenIdx] ?? 0) < STALE_SECONDS;
      return { sensor, pm25: reporting ? pm25 : null };
    });
  } catch {
    return offline;
  }
}
