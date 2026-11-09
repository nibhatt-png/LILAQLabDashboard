// Server-only: reads QuantAQ particulate matter readings from the QuantAQ API.
import { unstable_cache } from "next/cache";

// The lab's QuantAQ MODULAIR-PM on the Jacobs roof.
const DEVICE = "MOD-PM-00116";
const DATA_URL = `https://api.quant-aq.com/v1/devices/${DEVICE}/data/`;
// The API's page size limit; a day of minute readings takes two pages.
const PAGE_SIZE = 1000;

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

/** One calibrated ("final") reading as the API returns it. */
interface Reading {
  timestamp: string; // UTC, "YYYY-MM-DDTHH:MM:SS"
  pm1: number | null;
  pm25: number | null;
  pm10: number | null;
}

interface Page {
  data: Reading[];
  meta: { next_url: string | null };
}

const HOUR_MS = 60 * 60 * 1000;
const HOURS = 24;
const REVALIDATE_SECONDS = 10 * 60;
// Readings older than this no longer count as current conditions.
const CURRENT_MS = 2 * HOUR_MS;

const parseTimestamp = (ts: string) => Date.parse(`${ts}Z`);
const toTimestamp = (ms: number) => new Date(ms).toISOString().slice(0, 19);

async function getPage(url: string, apiKey: string): Promise<Page> {
  const res = await fetch(url, {
    // The API key is the username, with an empty password.
    headers: { Authorization: `Basic ${btoa(`${apiKey}:`)}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`QuantAQ API responded ${res.status}`);
  return res.json();
}

async function loadSummary(): Promise<QuantAqSummary | null> {
  const apiKey = process.env.QUANTAQ_API_KEY;
  if (!apiKey) throw new Error("QUANTAQ_API_KEY is not set");

  const newest = await getPage(
    `${DATA_URL}?per_page=1&sort=timestamp,desc`,
    apiKey,
  );
  if (newest.data.length === 0) return null;
  const latest = parseTimestamp(newest.data[0].timestamp);

  // Every reading in the 24 hours up to and including the newest one. The API
  // ignores a second filter condition, so readings that arrive after the
  // newest one are dropped when bucketing instead.
  const end = latest + 1000;
  const start = end - HOURS * HOUR_MS;
  const readings: Reading[] = [];
  let url: string | null =
    `${DATA_URL}?per_page=${PAGE_SIZE}&sort=timestamp,asc&filter=timestamp,ge,${toTimestamp(start)}`;
  while (url) {
    const page = await getPage(url, apiKey);
    readings.push(...page.data);
    url = page.meta.next_url;
  }

  // Average each hour, skipping readings the sensor couldn't calibrate.
  const sums = Array.from({ length: HOURS }, () => ({ n: 0, PM1: 0, PM2_5: 0, PM10: 0 }));
  for (const r of readings) {
    if (r.pm1 === null || r.pm25 === null || r.pm10 === null) continue;
    const i = Math.floor((parseTimestamp(r.timestamp) - start) / HOUR_MS);
    if (i < 0 || i >= HOURS) continue;
    sums[i].n++;
    sums[i].PM1 += r.pm1;
    sums[i].PM2_5 += r.pm25;
    sums[i].PM10 += r.pm10;
  }
  const hours = sums.flatMap(({ n, PM1, PM2_5, PM10 }, i) =>
    n === 0
      ? []
      : [{ time: start + i * HOUR_MS, PM1: PM1 / n, PM2_5: PM2_5 / n, PM10: PM10 / n }],
  );
  return { latest, hours };
}

const cachedSummary = unstable_cache(loadSummary, ["quantaq-api-summary"], {
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
