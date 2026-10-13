import SlideHeader from "@/components/SlideHeader";
import { acsmComponents } from "@/data/airQuality";
import {
  fetchAcsmSummary,
  formatAcsmDay,
  formatAcsmTime,
  type TrendPoint,
} from "@/lib/acsm";

// Every species keeps at least this share of the bar so its label fits; the
// rest of the bar is split in proportion to concentration.
const MIN_BAR_SHARE = 8;

// Plot area within the sparkline, as percentages of its box.
const PLOT = { top: 5.21, right: 1.64, bottom: 5.21, left: 9.87 };

function formatTick(value: number, range: number) {
  const text = value.toFixed(range < 1 ? 2 : 1);
  return Number(text) === 0 ? "0" : text;
}

function TrendSparkline({ trend, color }: { trend: TrendPoint[]; color: string }) {
  if (trend.length < 2) {
    return (
      <div className="flex h-[140px] w-full items-center justify-center text-sm text-[#6b7280]">
        No data
      </div>
    );
  }

  // ACSM readings hover around zero and can dip below it, so the axis
  // always includes zero.
  const values = trend.map((p) => p.value);
  const low = Math.min(0, ...values);
  const high = Math.max(...values) > low ? Math.max(...values) : low + 1;
  const range = high - low;
  const ticks = [low, low + range / 2, high];
  const tickTop = (value: number) =>
    PLOT.top + (1 - (value - low) / range) * (100 - PLOT.top - PLOT.bottom);

  const points = trend.map(
    (p) => `${(p.t * 100).toFixed(2)},${((1 - (p.value - low) / range) * 100).toFixed(2)}`,
  );
  const line = `M${points.join("L")}`;
  const area = `${line}L${(trend.at(-1)!.t * 100).toFixed(2)},100L${(trend[0].t * 100).toFixed(2)},100Z`;

  return (
    <div className="relative h-[140px] w-full">
      <div
        className="absolute w-px bg-[#666666]"
        style={{ top: `${PLOT.top}%`, bottom: `${PLOT.bottom}%`, left: `${PLOT.left}%` }}
      />
      {ticks.map((tick, i) => (
        <div key={i}>
          <div
            className="absolute right-[90.13%] left-[7.89%] h-px bg-[#666666]"
            style={{ top: `${tickTop(tick)}%` }}
          />
          <p
            className="absolute right-[92.76%] -translate-y-1/2 text-right text-[10px] text-[#6b7280]"
            style={{ top: `${tickTop(tick)}%` }}
          >
            {formatTick(tick, range)}
          </p>
        </div>
      ))}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute overflow-visible"
        style={{
          top: `${PLOT.top}%`,
          left: `${PLOT.left}%`,
          width: `${100 - PLOT.left - PLOT.right}%`,
          height: `${100 - PLOT.top - PLOT.bottom}%`,
        }}
      >
        <path d={area} fill={color} fillOpacity={0.2} />
        <path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

export default async function AcsmSlide() {
  const summary = await fetchAcsmSummary();
  const components = acsmComponents.map((c) => ({
    ...c,
    average: summary?.species[c.field].average ?? null,
    trend: summary?.species[c.field].trend ?? [],
  }));
  // Readings below zero are instrument noise, so they take no share of the bar.
  const total = components.reduce((sum, c) => sum + Math.max(0, c.average ?? 0), 0);
  const barWidth = (value: number | null) =>
    MIN_BAR_SHARE +
    (total > 0 ? Math.max(0, value ?? 0) / total : 1 / components.length) *
      (100 - MIN_BAR_SHARE * components.length);
  const formatValue = (value: number | null) =>
    value === null ? "–" : `${value.toFixed(2)} µg/m³`;

  return (
    <>
      <SlideHeader title="ACSM" variant="deep" />
      <div className="flex flex-col gap-10 px-4 pt-6 pb-10 lg:px-[52px] lg:pt-12 lg:pb-0">
        <div className="flex flex-col gap-6">
          <h3 className="text-xl leading-8 font-bold text-ink lg:text-[32px] lg:leading-9">
            What particles are in the air? One way we can determine this is
            through aerosol chemical speciation monitoring (ACSM)
          </h3>

          <div className="card rounded-[14px] p-4 lg:px-8 lg:pt-8 lg:pb-8">
            <div className="flex h-16 overflow-hidden rounded-[10px] shadow-[inset_0_2px_4px_rgb(0_0_0/0.05)] lg:h-24">
              {components.map((c) => (
                <div
                  key={c.name}
                  className="flex items-center justify-center px-2 text-center text-white"
                  style={{ width: `${barWidth(c.average)}%`, backgroundColor: c.color }}
                >
                  <div className="hidden lg:block">
                    <p className="text-sm leading-5 opacity-90">{c.barName}</p>
                    <p className="text-xl leading-7">{formatValue(c.average)}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* The bar is too narrow for labels on small screens. */}
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-body sm:grid-cols-3 lg:hidden">
              {components.map((c) => (
                <li key={c.name} className="flex items-center gap-2">
                  <span
                    className="size-3 shrink-0 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  {c.barName} <span className="font-semibold">{formatValue(c.average)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm leading-5 text-subtle lg:text-base lg:leading-6">
              {!summary
                ? "ACSM data is unavailable right now."
                : summary.day
                  ? `Average for ${formatAcsmDay(summary.day)} (readings through ${formatAcsmTime(summary.latest)})`
                  : `Average over the 24 hours ending ${formatAcsmDay(summary.latest)}, ${formatAcsmTime(summary.latest)}`}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {components.map((c) => (
            <div key={c.name} className="card rounded-[14px] p-6 lg:h-[576px]">
              <div className="flex items-center gap-3">
                <span
                  className="size-6 shrink-0 rounded-full"
                  style={{ backgroundColor: c.color }}
                />
                <h4 className="text-xl leading-7 font-bold text-ink">{c.name}</h4>
              </div>
              <div className="mt-4">
                <TrendSparkline trend={c.trend} color={c.color} />
              </div>
              <p className="text-center text-xs leading-4 font-bold text-[#6a7282]">
                {summary?.day
                  ? `Trend on ${formatAcsmDay(summary.day)} (µg/m³)`
                  : "24-hour trend (µg/m³)"}
              </p>
              <div className="mt-[38px] text-base leading-[22.75px] text-body">
                <p className="font-bold">What are they?</p>
                <p>{c.whatAreThey}</p>
                <p className="mt-[22.75px] font-bold">Effects</p>
                <p>{c.effects}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
