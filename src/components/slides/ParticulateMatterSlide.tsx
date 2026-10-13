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

const NO_DATA_COLOR = "#9ca3af";
// PM1 has no EPA standard, so its bar doesn't get an air quality color.
const UNRATED_COLOR = "#6b7280";
// EPA 24-hour standard for PM2.5, in µg/m³.
const PM25_DAILY_LIMIT = 35;

const definitions = [
  {
    title: "PM1",
    plain: "Very fine particles",
    border: "#c27aff",
    text: "Fine particles, even smaller than 2.5, which usually come from combustion sources like vehicle engines and wildfires.  Their size makes it easy for them to enter the body and can lead to complications including heart disease.",
  },
  {
    title: "PM2.5",
    plain: "Fine particles",
    border: "#ad46ff",
    text: "Fine particles, that come from similar sources to PM1 including gas stoves and industrial emissions. They are also quite small and can travel deep into the lungs and the bloodstream.",
  },
  {
    title: "PM10",
    plain: "Coarse particles",
    border: "#9810fa",
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
    <>
      <SlideHeader title="Particulate Matter" variant="bright" />
      <div className="flex flex-col gap-8 px-4 pt-6 pb-10 lg:flex-row lg:px-[52px] lg:pt-[74px] lg:pb-0">
        <div className="flex flex-col gap-6 lg:w-[872px] lg:shrink-0">
          <div>
            <h3 className="text-2xl leading-9 font-bold text-ink lg:text-[30px]">
              What is Particulate Matter (PM)?
            </h3>
            <p className="mt-4 text-base leading-[26px] font-bold text-body lg:pb-[26px] lg:text-xl">
              Particulate matter (PM) refers to tiny particles or droplets in
              the air. These particles come from vehicle exhaust, wood burning,
              industrial processes, and natural sources like dust and pollen.
              Smaller particles are more dangerous because they can travel
              deeper into your lungs and bloodstream.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {definitions.map((d) => (
              <div
                key={d.title}
                className="card flex flex-col gap-2 rounded-[14px] border-l-[3.75px] pt-5 pr-5 pb-4 pl-[23.742px] lg:min-h-[136px]"
                style={{ borderColor: d.border }}
              >
                <p className="text-lg leading-7 font-bold text-violet-title">
                  {d.title}
                  <span className="font-normal text-body"> · {d.plain}</span>
                </p>
                <p className="text-base leading-[22.75px] text-body lg:text-xl">
                  {d.text}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:mt-3">
            {metrics.map((m) => (
              <div key={m.name} className="card rounded-[14px] p-4 lg:h-[128px]">
                <p className="text-xs leading-4 font-bold text-subtle">
                  {prefix} {m.name} ({m.plain})
                </p>
                <p
                  className="mt-1 text-2xl leading-9 text-ink lg:text-[30px]"
                  style={m.value === undefined ? { color: NO_DATA_COLOR } : undefined}
                >
                  {m.value?.toFixed(1) ?? "–"}
                </p>
                <p className="mt-2 text-xs leading-4 text-subtle">
                  µg/m³
                  {m.category && (
                    <span className="font-bold"> · {m.category.label}</span>
                  )}
                </p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e5e7eb]">
                  <div
                    className="h-full"
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

        <div className="card flex flex-col gap-4 rounded-[14px] px-4 pt-6 pb-6 lg:h-[826.5px] lg:flex-1 lg:px-6">
          <div>
            <h3 className="text-xl leading-7 font-bold text-ink">
              Particulate Matter Over 24 Hours
            </h3>
            <p className="text-sm leading-5 text-subtle lg:text-base lg:leading-6">
              {summary
                ? `Hourly averages for the 24 hours ending ${timestampFormat.format(summary.latest)}`
                : "QuantAQ data is unavailable right now."}
            </p>
            <p className="text-sm leading-5 text-subtle lg:text-base lg:leading-6">
              For reference, the EPA&apos;s daily limit for PM2.5 is{" "}
              <span className="font-bold">{PM25_DAILY_LIMIT} µg/m³</span>.
            </p>
          </div>
          <div className="h-80 lg:h-auto lg:flex-1">
            {rows.length > 0 && <PmTrendChart rows={rows} />}
          </div>
        </div>
      </div>
    </>
  );
}
