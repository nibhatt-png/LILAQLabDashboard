import PmTrendChart from "@/components/PmTrendChart";
import SlideHeader from "@/components/SlideHeader";
import { currentPm } from "@/data/airQuality";
import { getPmColor } from "@/lib/aqi";

const definitions = [
  {
    title: "PM1",
    border: "#c27aff",
    text: "Fine particles, even smaller than 2.5, which usually come from combustion sources like vehicle engines and wildfires.  Their size makes it easy for them to enter the body and can lead to complications including heart disease.",
  },
  {
    title: "PM2.5",
    border: "#ad46ff",
    text: "Fine particles, that come from similar sources to PM1 including gas stoves and industrial emissions. They are also quite small and can travel deep into the lungs and the bloodstream.",
  },
  {
    title: "PM10",
    border: "#9810fa",
    text: "Course particles that include dust, bacteria, and mold spores. These particles can irritate the airways, eyes, nose, throat.",
  },
];

const pm1 = currentPm("PM1");
const pm25 = currentPm("PM2_5");
const pm10 = currentPm("PM10");

// Bars fill relative to a reference level (the EPA 24-hour standard for
// PM2.5 and PM10).
const metrics = [
  { label: "Current PM1", value: pm1, color: "#00c950", fill: pm1 / 20 },
  { label: "Current PM2.5", value: pm25, color: getPmColor(pm25, "pm25"), fill: pm25 / 35 },
  { label: "Current PM10", value: pm10, color: getPmColor(pm10, "pm10"), fill: pm10 / 150 },
];

export default function ParticulateMatterSlide() {
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
                </p>
                <p className="text-base leading-[22.75px] text-body lg:text-xl">
                  {d.text}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:mt-3">
            {metrics.map((m) => (
              <div key={m.label} className="card rounded-[14px] p-4 lg:h-[128px]">
                <p className="text-xs leading-4 font-bold text-subtle">
                  {m.label}
                </p>
                <p
                  className="mt-1 text-2xl leading-9 lg:text-[30px]"
                  style={{ color: m.color }}
                >
                  {m.value.toFixed(1)}
                </p>
                <p className="mt-2 text-xs leading-4 text-subtle">µg/m³</p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e5e7eb]">
                  <div
                    className="h-full"
                    style={{
                      width: `${Math.min(m.fill, 1) * 100}%`,
                      backgroundColor: m.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card flex flex-col gap-4 rounded-[14px] px-4 pt-6 pb-6 lg:h-[826.5px] lg:flex-1 lg:px-6">
          <h3 className="text-xl leading-7 font-bold text-ink">
            Particulate Matter in the Past 24 Hours
          </h3>
          <div className="h-80 lg:h-auto lg:flex-1">
            <PmTrendChart />
          </div>
        </div>
      </div>
    </>
  );
}
