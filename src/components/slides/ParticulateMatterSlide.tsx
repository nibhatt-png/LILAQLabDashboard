import PmTrendChart from "@/components/PmTrendChart";
import SlideHeader from "@/components/SlideHeader";
import { getPmCategory } from "@/lib/aqi";
import { fetchQuantAqSummary } from "@/lib/quantaq";

// The sensor is on campus, so show times in campus time.
const TIME_ZONE = "America/Los_Angeles";
const hourFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  hour: "numeric",
});
const timestampFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const NO_DATA_COLOR = "#a1a1aa";
// PM1 has no EPA standard, so its bar doesn't get an air quality color.
const UNRATED_COLOR = "#5e5873";
// EPA 24-hour standard for PM2.5, in µg/m³.
const PM25_DAILY_LIMIT = 35;

const definitions = [
  {
    title: "PM1",
    plain: "Very fine particles",
    text: "Fine particles, even smaller than 2.5, which usually come from combustion sources like vehicle engines and wildfires.  Their size makes it easy for them to enter the body and can lead to complications including heart disease.",
  },
  {
    title: "PM2.5",
    plain: "Fine particles",
    text: "Fine particles, that come from similar sources to PM1 including gas stoves and industrial emissions. They are also quite small and can travel deep into the lungs and the bloodstream.",
  },
  {
    title: "PM10",
    plain: "Coarse particles",
    text: "Coarse particles that include dust, bacteria, and mold spores. These particles can irritate the airways, eyes, nose, throat.",
  },
];

export default async function ParticulateMatterSlide() {
  const summary = await fetchQuantAqSummary();
  const rows = (summary?.hours ?? []).map(({ time, ...pm }) => ({
    label: hourFormat.format(time),
    ...pm,
  }));
  // The headline numbers are the average of the most recent hour.
  const now = summary?.hours.at(-1);
  const prefix = summary?.isCurrent ? "Current" : "Latest";

  // Bars fill relative to a reference level (the EPA 24-hour standard for
  // PM2.5 and PM10).
  const metrics = [
    { name: "PM1", plain: "very fine", value: now?.PM1, category: undefined, reference: 20 },
    { name: "PM2.5", plain: "fine", value: now?.PM2_5, category: now && getPmCategory(now.PM2_5, "pm25"), reference: PM25_DAILY_LIMIT },
    { name: "PM10", plain: "coarse", value: now?.PM10, category: now && getPmCategory(now.PM10, "pm10"), reference: 150 },
  ];

  return (
    <div className="flex flex-col gap-8 px-4 pt-8 pb-12 lg:h-full lg:px-[52px] lg:pt-10 lg:pb-0">
      <SlideHeader title="Particulate Matter" />
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
        <div className="flex flex-col gap-8 lg:w-[860px] lg:shrink-0">
          <div>
            <h3 className="text-2xl font-semibold tracking-[-0.025em] text-ink lg:text-[32px]">
              What is Particulate Matter (PM)?
            </h3>
            <p className="mt-3 text-base leading-[1.55] text-body lg:text-xl">
              Particulate matter (PM) refers to tiny particles or droplets in
              the air. These particles come from vehicle exhaust, wood burning,
              industrial processes, and natural sources like dust and pollen.
              Smaller particles are more dangerous because they can travel
              deeper into your lungs and bloodstream.
            </p>
          </div>

          <dl className="border-b border-rule">
            {definitions.map((d) => (
              <div
                key={d.title}
                className="flex flex-col gap-1.5 border-t border-rule py-5 lg:flex-row lg:gap-8"
              >
                <dt className="shrink-0 lg:w-[190px]">
                  <p className="text-xl font-semibold tracking-[-0.015em] text-ink">
                    {d.title}
                  </p>
                  <p className="mono-label mt-1 lg:text-sm">{d.plain}</p>
                </dt>
                <dd className="text-base leading-[1.5] text-body lg:text-lg">
                  {d.text}
                </dd>
              </div>
            ))}
          </dl>

          <div className="grid grid-cols-3">
            {metrics.map((m) => (
              <div
                key={m.name}
                className="flex flex-col gap-2 border-rule pr-3 [&:not(:first-child)]:border-l [&:not(:first-child)]:pl-4 lg:pr-6 lg:[&:not(:first-child)]:pl-6"
              >
                <p className="mono-label text-[11px] lg:text-xs">
                  {prefix} {m.name} ({m.plain})
                </p>
                <p
                  className="text-4xl font-medium tracking-[-0.04em] text-ink lg:text-[56px] lg:leading-none"
                  style={m.value === undefined ? { color: NO_DATA_COLOR } : undefined}
                >
                  {m.value?.toFixed(1) ?? "–"}
                </p>
                <p className="flex items-center gap-1.5 text-xs text-subtle lg:text-sm">
                  µg/m³
                  {m.category && (
                    <>
                      <span aria-hidden>·</span>
                      <span
                        aria-hidden
                        className="size-2 rounded-full"
                        style={{ backgroundColor: m.category.color }}
                      />
                      <span className="font-medium text-ink">{m.category.label}</span>
                    </>
                  )}
                </p>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-rule">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min((m.value ?? 0) / m.reference, 1) * 100}%`,
                      backgroundColor: m.category?.color ?? UNRATED_COLOR,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card flex min-w-0 flex-col gap-4 p-5 lg:h-[860px] lg:flex-1 lg:p-8">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-semibold tracking-[-0.02em] text-ink lg:text-[28px]">
              Particulate Matter Over 24 Hours
            </h3>
            <p className="mono-label mt-1 lg:text-sm">
              {summary
                ? `Hourly averages for the 24 hours ending ${timestampFormat.format(summary.latest)}`
                : "QuantAQ data is unavailable right now."}
            </p>
            <p className="text-sm text-body lg:text-base">
              For reference, the EPA&apos;s daily limit for PM2.5 is{" "}
              <span className="font-semibold text-ink">{PM25_DAILY_LIMIT} µg/m³</span>.
            </p>
          </div>
          <div className="h-80 lg:h-auto lg:flex-1">
            {rows.length > 0 && <PmTrendChart rows={rows} />}
          </div>
        </div>
      </div>
    </div>
  );
}
