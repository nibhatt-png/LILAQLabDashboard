// Server-only: reads QuantAQ particulate matter readings from Firestore.
import { AggregateField, FieldPath } from "@google-cloud/firestore";
import { unstable_cache } from "next/cache";
import { getDb } from "@/lib/firestore";

// The lab's QuantAQ MODULAIR-PM; its collection is named after the device.
const DEVICE = "MOD-PM-00116";

export interface HourlyPm {
  /** Start of the hour, as a Unix timestamp in milliseconds. */
  time: number;
  PM1: number;
  PM2_5: number;
  PM10: number;
}

export interface QuantAqSummary {
  /** Time of the newest reading, as a Unix timestamp in milliseconds. */
  latest: number;
  /** Hourly averages for the 24 hours leading up to the newest reading. */
  hours: HourlyPm[];
}

const HOUR_MS = 60 * 60 * 1000;
const HOURS = 24;
const REVALIDATE_SECONDS = 10 * 60;
// Readings older than this no longer count as current conditions.
const CURRENT_MS = 2 * HOUR_MS;

// Documents are keyed by their UTC timestamp ("YYYY-MM-DDTHH:MM:SS").
const TIMESTAMP_ID = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
const parseId = (id: string) => Date.parse(`${id}Z`);
const toId = (ms: number) => new Date(ms).toISOString().slice(0, 19);

async function loadSummary(): Promise<QuantAqSummary | null> {
  const db = getDb();
  if (!db) throw new Error("No Firestore credentials configured");
  const readings = db.collection(DEVICE);

  // ":" sorts just after the digits, which skips non-timestamp document IDs.
  const newest = await readings
    .where(FieldPath.documentId(), "<", ":")
    .orderBy(FieldPath.documentId(), "desc")
    .limit(5)
    .get();
  const latestId = newest.docs.find((d) => TIMESTAMP_ID.test(d.id))?.id;
  if (!latestId) return null;

  // The sensor reports every minute. Firestore averages each hour itself, so
  // a refresh costs a handful of reads instead of one per reading.
  const end = parseId(latestId) + 1000;
  const hours = await Promise.all(
    Array.from({ length: HOURS }, async (_, i) => {
      const time = end - (HOURS - i) * HOUR_MS;
      const result = await readings
        .where(FieldPath.documentId(), ">=", toId(time))
        .where(FieldPath.documentId(), "<", toId(time + HOUR_MS))
        .aggregate({
          PM1: AggregateField.average("final_pm1"),
          PM2_5: AggregateField.average("final_pm25"),
          PM10: AggregateField.average("final_pm10"),
        })
        .get();
      const { PM1, PM2_5, PM10 } = result.data();
      if (PM1 === null || PM2_5 === null || PM10 === null) return [];
      return [{ time, PM1, PM2_5, PM10 }];
    }),
  );
  return { latest: parseId(latestId), hours: hours.flat() };
}

const cachedSummary = unstable_cache(loadSummary, ["quantaq-summary"], {
  revalidate: REVALIDATE_SECONDS,
});

/**
 * Hourly PM averages up to the newest reading, and whether that reading is
 * recent enough to call current. Null if the data can't be loaded.
 */
export async function fetchQuantAqSummary(): Promise<
  (QuantAqSummary & { isCurrent: boolean }) | null
> {
  try {
    const summary = await cachedSummary();
    return summary && {
      ...summary,
      isCurrent: Date.now() - summary.latest < CURRENT_MS,
    };
  } catch (err) {
    console.error("Couldn't load QuantAQ data:", err);
    return null;
  }
}
