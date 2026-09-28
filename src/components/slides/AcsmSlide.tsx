/* eslint-disable @next/next/no-img-element -- Figma SVG chart vectors */
import SlideHeader from "@/components/SlideHeader";
import { acsmComponents } from "@/data/airQuality";

interface Sparkline {
  axis: string;
  /** Y-axis tick labels, bottom to top. */
  ticks: [string, string, string];
  /** Top of the plotted area, as a percentage of the chart height. */
  top: string;
  /** Either a filled area plus a separate stroke, or one combined group. */
  area?: string;
  line?: { src: string; bottom: string; bleed: string };
  group?: { src: string; bleed: string };
}

// 24-hour trend vectors exported from the Figma design, keyed by component.
const sparklines: Record<string, Sparkline> = {
  Organics: {
    axis: "/figma/acsm-axis-organics.svg",
    ticks: ["7", "14", "28"],
    top: "8.71%",
    area: "/figma/acsm-organics-area.svg",
    line: { src: "/figma/acsm-organics-line.svg", bottom: "57.93%", bleed: "inset-[-2.14%_-0.24%_-2.14%_-0.26%]" },
  },
  Nitrates: {
    axis: "/figma/acsm-axis.svg",
    ticks: ["2", "4", "8"],
    top: "25.49%",
    group: { src: "/figma/acsm-nitrates.svg", bleed: "inset-[-0.73%_-0.26%_0_-0.19%]" },
  },
  Sulfates: {
    axis: "/figma/acsm-axis-sulfates.svg",
    ticks: ["0", "1", "2"],
    top: "6.46%",
    area: "/figma/acsm-sulfates-area.svg",
    line: { src: "/figma/acsm-sulfates-line.svg", bottom: "44.25%", bleed: "inset-[-1.41%_-0.32%_-1.41%_0]" },
  },
  Ammonium: {
    axis: "/figma/acsm-axis.svg",
    ticks: ["0", "1", "2"],
    top: "9.69%",
    area: "/figma/acsm-ammonium-area.svg",
    line: { src: "/figma/acsm-ammonium-line.svg", bottom: "59.55%", bleed: "inset-[-2.29%_-0.18%_-2.29%_-0.29%]" },
  },
  Chlorides: {
    axis: "/figma/acsm-axis.svg",
    ticks: ["0", "1", "1"],
    top: "21.95%",
    area: "/figma/acsm-chlorides-area.svg",
    line: { src: "/figma/acsm-chlorides-line.svg", bottom: "38.73%", bleed: "inset-[-1.79%_-0.3%_-1.79%_-0.26%]" },
  },
};

// Tick positions (from the top) shared by every sparkline.
const tickTops = ["72.4%", "50%", "5.21%"];

function TrendSparkline({ name }: { name: string }) {
  const s = sparklines[name];
  const plot = { top: s.top, right: "1.64%", bottom: "5.21%", left: "9.87%" };

  return (
    <div className="relative h-[140px] w-full">
      <div className="absolute inset-[5.21%_90.13%_5.21%_9.87%]">
        <div className="absolute inset-[0_-0.5px]">
          <img alt="" src={s.axis} className="block size-full max-w-none" />
        </div>
      </div>
      {s.ticks.map((label, i) => (
        <div key={i}>
          <div
            className="absolute right-[90.13%] left-[7.89%]"
            style={{ top: tickTops[i], bottom: `calc(100% - ${tickTops[i]})` }}
          >
            <div className="absolute inset-[-0.5px_0]">
              <img alt="" src="/figma/acsm-tick.svg" className="block size-full max-w-none" />
            </div>
          </div>
          <p
            className="absolute right-[92.76%] -translate-y-1/2 text-right text-[10px] text-[#6b7280]"
            style={{ top: tickTops[i] }}
          >
            {label}
          </p>
        </div>
      ))}
      {s.area && (
        <div className="absolute" style={plot}>
          <img alt="" src={s.area} className="absolute inset-0 block size-full max-w-none" />
        </div>
      )}
      {s.line && (
        <div className="absolute" style={{ ...plot, bottom: s.line.bottom }}>
          <div className={`absolute ${s.line.bleed}`}>
            <img alt="" src={s.line.src} className="block size-full max-w-none" />
          </div>
        </div>
      )}
      {s.group && (
        <div className="absolute" style={plot}>
          <div className={`absolute ${s.group.bleed}`}>
            <img alt="" src={s.group.src} className="block size-full max-w-none" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function AcsmSlide() {
  return (
    <>
      <SlideHeader title="ACSM" variant="deep" />
      <div className="flex flex-col gap-10 px-4 pt-6 pb-10 lg:px-[52px] lg:pt-12 lg:pb-0">
        <div className="flex flex-col gap-6">
          <h3 className="text-xl leading-8 font-bold text-ink lg:text-[32px] lg:leading-9">
            What particles are in the air? One way we can determine this is
            through aerosol chemical speciation monitoring (ACSM)
          </h3>

          <div className="card rounded-[14px] p-4 lg:px-8 lg:pt-8 lg:pb-[76px]">
            <div className="flex h-16 overflow-hidden rounded-[10px] shadow-[inset_0_2px_4px_rgb(0_0_0/0.05)] lg:h-24">
              {acsmComponents.map((c) => (
                <div
                  key={c.name}
                  className="flex items-center justify-center px-2 text-center text-white"
                  style={{ width: `${c.barWidth}%`, backgroundColor: c.color }}
                >
                  <div className="hidden lg:block">
                    <p className="text-sm leading-5 opacity-90">{c.barName}</p>
                    <p className="text-xl leading-7">{c.value} µg/m³</p>
                  </div>
                </div>
              ))}
            </div>
            {/* The bar is too narrow for labels on small screens. */}
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-body sm:grid-cols-3 lg:hidden">
              {acsmComponents.map((c) => (
                <li key={c.name} className="flex items-center gap-2">
                  <span
                    className="size-3 shrink-0 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  {c.barName} <span className="font-semibold">{c.value} µg/m³</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {acsmComponents.map((c) => (
            <div key={c.name} className="card rounded-[14px] p-6 lg:h-[576px]">
              <div className="flex items-center gap-3">
                <span
                  className="size-6 shrink-0 rounded-full"
                  style={{ backgroundColor: c.color }}
                />
                <h4 className="text-xl leading-7 font-bold text-ink">{c.name}</h4>
              </div>
              <div className="mt-4">
                <TrendSparkline name={c.name} />
              </div>
              <p className="text-center text-xs leading-4 font-bold text-[#6a7282]">
                24-hour trend (µg/m³)
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
