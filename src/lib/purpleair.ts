// Server-only: reads the PurpleAir API key from the environment.

export interface SensorConfig {
  id: number;
  name: string;
  color: string;
}

// Campus PurpleAir sensors (sensor index → display name).
export const SENSORS: SensorConfig[] = [
  { id: 176373, name: "Sensor 1", color: "#7c3aed" },
  { id: 147346, name: "Sensor 2", color: "#10b981" },
  // { id: 176395, name: "Sensor 3", color: "#3b82f6" },
  { id: 176377, name: "Sensor 4", color: "#f59e0b" },
  // { id: 176345, name: "Sensor 5", color: "#ef4444" },
];

export interface Reading {
  /** Unix timestamp, seconds. */
  time: number;
  pm25: number;
}

export type SensorHistory =
  | { sensor: SensorConfig; readings: Reading[]; error?: undefined }
  | { sensor: SensorConfig; readings?: undefined; error: string };

const REVALIDATE_SECONDS = 600;

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
