import type { Metadata } from "next";
import Link from "next/link";
import {
  DailyChart,
  HourlyChart,
  type ChartRow,
} from "@/components/purpleair/PurpleAirCharts";
import {
  SENSORS,
  fetchSensorHistory,
  hasApiKey,
  type Reading,
  type SensorHistory,
} from "@/lib/purpleair";

export const metadata: Metadata = {
  title: "PurpleAir Sensors · LILAQ Lab",
};

const RANGES = [
  { days: 1, label: "24 hours" },
  { days: 7, label: "7 days" },
  { days: 14, label: "14 days" },
];

// The sensors are on campus, so show times in campus time on server and client.
const TIME_ZONE = "America/Los_Angeles";
const hourFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  month: "short",
  day: "numeric",
  hour: "numeric",
});
const dayFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  month: "short",
  day: "numeric",
});

const average = (values: number[]) =>
  values.reduce((sum, v) => sum + v, 0) / values.length;

function buildRows(
  histories: { name: string; readings: Reading[] }[],
  bucket: (time: number) => string,
  aggregate: (values: number[]) => number,
): ChartRow[] {
  // Visiting readings in time order makes the Map's insertion order
  // chronological, even when sensors report at different times.
  const all = histories
    .flatMap(({ name, readings }) => readings.map((r) => ({ name, ...r })))
    .sort((a, b) => a.time - b.time);

  const buckets = new Map<string, Map<string, number[]>>();
  for (const r of all) {
    const key = bucket(r.time);
    if (!buckets.has(key)) buckets.set(key, new Map());
    const bySensor = buckets.get(key)!;
    bySensor.set(r.name, [...(bySensor.get(r.name) ?? []), r.pm25]);
  }

  return [...buckets.entries()].map(([label, bySensor]) => {
      const row: ChartRow = { label };
      for (const [name, values] of bySensor) {
        row[name] = Math.round(aggregate(values) * 10) / 10;
      }
      return row;
    });
}

export default async function PurpleAirPage({
  searchParams,
}: PageProps<"/purpleair">) {
  const requested = Number((await searchParams).days);
  const days = RANGES.some((r) => r.days === requested) ? requested : 7;

  return (
    <div className="min-h-dvh">
      <header
        className="flex flex-wrap items-center justify-between gap-4 border-b-[1.5px] border-[#c27aff] px-4 py-5 lg:px-12 lg:py-8"
        style={{
          background:
            "linear-gradient(176.6deg, rgb(109 40 217) 0%, rgb(91 33 182) 100%)",
        }}
      >
        <Link href="/" className="text-2xl tracking-tight text-white lg:text-[40px]">
          LILAQ Lab
        </Link>
        <h1 className="text-xl text-white/95 lg:text-[32px]">PurpleAir Sensors</h1>
      </header>

      <main className="mx-auto flex max-w-[1824px] flex-col gap-6 px-4 py-6 lg:px-12 lg:py-10">
        {hasApiKey() ? <SensorData days={days} /> : <MissingKey />}
      </main>
    </div>
  );
}

async function SensorData({ days }: { days: number }) {
  const histories = await Promise.all(
    SENSORS.map((s) => fetchSensorHistory(s, days)),
  );
  const ok = histories.filter(
    (h): h is Extract<SensorHistory, { readings: Reading[] }> =>
      h.readings !== undefined && h.readings.length > 0,
  );
  const failed = histories.filter((h) => h.error);
  const series = ok.map((h) => ({ name: h.sensor.name, color: h.sensor.color }));
  const named = ok.map((h) => ({ name: h.sensor.name, readings: h.readings }));

  const hourlyRows = buildRows(named, (t) => hourFormat.format(t * 1000), average);
  const dailyRows = buildRows(named, (t) => dayFormat.format(t * 1000), average);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-body">
          Hourly PM2.5 (<code>pm2.5_atm</code>) over the last{" "}
          {RANGES.find((r) => r.days === days)!.label}. Refreshes every 10
          minutes.
        </p>
        <nav className="flex gap-1 rounded-full bg-white/60 p-1" aria-label="Time range">
          {RANGES.map((r) => (
            <Link
              key={r.days}
              href={`/purpleair?days=${r.days}`}
              aria-current={r.days === days ? "page" : undefined}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                r.days === days
                  ? "bg-[#6d28d9] text-white"
                  : "text-[#5b21b6] hover:bg-white"
              }`}
            >
              {r.label}
            </Link>
          ))}
        </nav>
      </div>

      {failed.length > 0 && (
        <div className="rounded-[14px] border border-[#f44336]/40 bg-white p-4 text-sm text-body">
          <p className="font-bold text-[#b91c1c]">
            Couldn&apos;t load {failed.length} sensor
            {failed.length > 1 ? "s" : ""}:
          </p>
          <ul className="mt-1 list-disc pl-5">
            {failed.map((h) => (
              <li key={h.sensor.id}>
                {h.sensor.name} ({h.sensor.id}): {h.error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ok.map(({ sensor, readings }) => (
          <SensorCard key={sensor.id} name={sensor.name} id={sensor.id} color={sensor.color} readings={readings} />
        ))}
      </div>

      {ok.length > 0 && (
        <>
          <section className="card rounded-[14px] p-4 lg:p-6">
            <h2 className="text-xl font-bold text-ink">PM2.5 over time</h2>
            <div className="mt-4 h-80 lg:h-105">
              <HourlyChart rows={hourlyRows} series={series} />
            </div>
          </section>

          <section className="card rounded-[14px] p-4 lg:p-6">
            <h2 className="text-xl font-bold text-ink">Daily average by sensor</h2>
            <div className="mt-4 h-72 lg:h-85">
              <DailyChart rows={dailyRows} series={series} />
            </div>
          </section>
        </>
      )}
    </>
  );
}

function SensorCard({
  name,
  id,
  color,
  readings,
}: {
  name: string;
  id: number;
  color: string;
  readings: Reading[];
}) {
  const latest = readings.at(-1)!;
  const values = readings.map((r) => r.pm25);

  return (
    <div className="card rounded-[14px] p-5">
      <div className="flex items-center gap-2">
        <span className="size-3 rounded-full" style={{ backgroundColor: color }} />
        <h2 className="font-bold text-ink">{name}</h2>
        <span className="ml-auto text-xs text-subtle">#{id}</span>
      </div>
      <div className="mt-3 flex items-end gap-3">
        <p className="text-4xl leading-none text-ink">{latest.pm25.toFixed(1)}</p>
        <p className="pb-0.5 text-sm text-subtle">µg/m³ latest hour</p>
      </div>
      <p className="mt-1 text-xs text-subtle">
        as of {hourFormat.format(latest.time * 1000)}
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-[#e5e7eb] pt-3 text-sm">
        <div>
          <dt className="text-subtle">Average</dt>
          <dd className="font-semibold text-ink">{average(values).toFixed(1)}</dd>
        </div>
        <div>
          <dt className="text-subtle">Peak</dt>
          <dd className="font-semibold text-ink">{Math.max(...values).toFixed(1)}</dd>
        </div>
      </dl>
    </div>
  );
}

function MissingKey() {
  return (
    <div className="card mx-auto max-w-2xl rounded-[14px] p-6 text-body">
      <h2 className="text-xl font-bold text-ink">Add your PurpleAir API key</h2>
      <p className="mt-2">
        Create a file named <code>.env.local</code> in the project folder
        with:
      </p>
      <pre className="mt-3 overflow-x-auto rounded-lg bg-[#f3e8ff] p-3 text-sm">
        PURPLEAIR_API_KEY=your-read-key-here
      </pre>
      <p className="mt-3">
        Then restart the dev server. The key stays on the server and is never
        sent to the browser.
      </p>
    </div>
  );
}
