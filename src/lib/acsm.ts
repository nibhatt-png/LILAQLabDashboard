// Server-only: reads ACSM measurements from the lab's Firestore database.
import { FieldPath } from "@google-cloud/firestore";
import { unstable_cache } from "next/cache";
import { getDb } from "@/lib/firestore";

export const ACSM_FIELDS = ["Org", "NO3", "SO4", "NH4", "Chl"] as const;
export type AcsmField = (typeof ACSM_FIELDS)[number];

// Show this one calendar day ("YYYY-MM-DD") instead of the newest readings.
// The ACSM hasn't uploaded since this date; set to null to go back to the
// 24 hours leading up to the newest reading.
const PINNED_DAY: string | null = "2026-04-14";

export interface TrendPoint {
  /** Position within the time window, from 0 (start) to 1 (latest). */
  t: number;
  /** Mean concentration in µg/m³. */
  value: number;
}

export interface AcsmSummary {
  /** Timestamp of the newest reading, as stored ("YYYY-MM-DD HH:MM:SS"). */
  latest: string;
  /** The pinned day being shown, or null for the latest 24 hours. */
  day: string | null;
  species: Record<AcsmField, { average: number; trend: TrendPoint[] }>;
}

const WINDOW_MS = 24 * 60 * 60 * 1000;
const TREND_BUCKETS = 48;
// Each refresh reads every document in the window (300-550), so refresh
// sparingly to stay inside Firestore's free daily read quota.
const REVALIDATE_SECONDS = 60 * 60;

// Documents are keyed by their timestamp; anything else is ignored.
const TIMESTAMP_ID = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

// The stored timestamps carry no time zone, so they are treated as UTC for
// arithmetic and formatted back the same way — the wall-clock time is kept.
const parseId = (id: string) => Date.parse(`${id.replace(" ", "T")}Z`);
const toId = (ms: number) =>
  new Date(ms).toISOString().slice(0, 19).replace("T", " ");

const dayFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  month: "short",
  day: "numeric",
  year: "numeric",
});
const timeFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  hour: "numeric",
  minute: "2-digit",
});

/** Formats a stored timestamp (or a bare "YYYY-MM-DD") as e.g. "Apr 14, 2026". */
export function formatAcsmDay(id: string) {
  return dayFormat.format(parseId(id.length === 10 ? `${id} 00:00:00` : id));
}

export function formatAcsmTime(id: string) {
  return timeFormat.format(parseId(id));
}

const average = (values: number[]) =>
  values.reduce((sum, v) => sum + v, 0) / values.length;

async function loadSummary(): Promise<AcsmSummary | null> {
  const db = getDb();
  if (!db) throw new Error("No Firestore credentials configured");
  const acsm = db.collection("acsm");

  let start: number;
  let latest: string | undefined;
  if (PINNED_DAY) {
    start = parseId(`${PINNED_DAY} 00:00:00`);
  } else {
    // ":" sorts just after the digits, which skips non-timestamp document IDs.
    const newest = await acsm
      .where(FieldPath.documentId(), "<", ":")
      .orderBy(FieldPath.documentId(), "desc")
      .limit(5)
      .get();
    latest = newest.docs.find((d) => TIMESTAMP_ID.test(d.id))?.id;
    if (!latest) return null;
    start = parseId(latest) - WINDOW_MS;
  }

  const snapshot = await acsm
    .where(FieldPath.documentId(), ">=", toId(start))
    .where(FieldPath.documentId(), "<", toId(start + WINDOW_MS + 1000))
    .get();
  const docs = snapshot.docs.filter((d) => TIMESTAMP_ID.test(d.id));
  // Timestamp IDs sort chronologically as plain strings.
  latest ??= docs.map((d) => d.id).sort().at(-1);
  if (!latest) return null;
  // A pinned day is plotted up to its last reading rather than to midnight.
  const span = Math.max(1, parseId(latest) - start);

  const species = {} as AcsmSummary["species"];
  for (const field of ACSM_FIELDS) {
    const buckets: number[][] = Array.from({ length: TREND_BUCKETS }, () => []);
    for (const doc of docs) {
      const value = doc.get(field);
      if (typeof value !== "number") continue;
      const t = (parseId(doc.id) - start) / span;
      buckets[Math.min(TREND_BUCKETS - 1, Math.floor(t * TREND_BUCKETS))].push(value);
    }
    const all = buckets.flat();
    species[field] = {
      average: all.length > 0 ? average(all) : 0,
      trend: buckets.flatMap((values, i) =>
        values.length > 0
          ? [{ t: (i + 0.5) / TREND_BUCKETS, value: average(values) }]
          : [],
      ),
    };
  }
  return { latest, day: PINNED_DAY, species };
}

const cachedSummary = unstable_cache(
  loadSummary,
  ["acsm-summary-v2", PINNED_DAY ?? "latest"],
  {
    revalidate: REVALIDATE_SECONDS,
  },
);

/**
 * Averages and trends for the pinned day, or for the 24 hours leading up to
 * the newest ACSM reading. Null if the data can't be loaded.
 */
export async function fetchAcsmSummary(): Promise<AcsmSummary | null> {
  try {
    return await cachedSummary();
  } catch (err) {
    console.error("Couldn't load ACSM data:", err);
    return null;
  }
}
