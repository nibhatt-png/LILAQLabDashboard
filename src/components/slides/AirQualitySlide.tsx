/* eslint-disable @next/next/no-img-element -- Figma SVG icons */
import type { CSSProperties, ReactNode } from "react";
import AutoRefresh from "@/components/AutoRefresh";
import CampusMap from "@/components/CampusMap";
import { projectToMap } from "@/components/campusMapData";
import SlideHeader from "@/components/SlideHeader";
import {
  AQI_CATEGORIES,
  getAqiCategory,
  getAqiScalePosition,
  pm25ToAqi,
} from "@/lib/aqi";
import {
  CURRENT_REVALIDATE_SECONDS,
  fetchCurrentReadings,
  type CurrentReading,
} from "@/lib/purpleair";

const OFFLINE_COLOR = "#a1a1aa";

const scaleLabels = [
  "Good (0)",
  "Moderate",
  "Somewhat Unhealthy",
  "Unhealthy",
  "Very Unhealthy",
  "Hazardous (500)",
];

// Three strokes positioned exactly as in the Figma icon frame.
const windStrokes = [
  { src: "/figma/wind-1.svg", box: "inset-[66.67%_33.33%_16.67%_8.33%]", bleed: "inset-[-25%_-5.36%]" },
  { src: "/figma/wind-2.svg", box: "inset-[29.17%_8.33%_50%_8.33%]", bleed: "inset-[-20%_-3.75%]" },
  { src: "/figma/wind-3.svg", box: "inset-[16.67%_45.83%_66.67%_8.33%]", bleed: "inset-[-25%_-6.82%]" },
];

function WindIcon() {
  return (
    <div className="relative h-6 w-8 overflow-hidden">
      {windStrokes.map(({ src, box, bleed }) => (
        <div key={src} className={`absolute ${box}`}>
          <div className={`absolute ${bleed}`}>
            <img alt="" src={src} className="block size-full max-w-none" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function AirQualitySlide() {
  const readings = await fetchCurrentReadings();
  // Campus AQI is the AQI of the mean PM2.5 across the sensors reporting.
  const reporting = readings.flatMap((r) => (r.pm25 === null ? [] : [r.pm25]));
  const campusAqi =
    reporting.length > 0
      ? pm25ToAqi(reporting.reduce((sum, v) => sum + v, 0) / reporting.length)
      : null;
  const category = campusAqi === null ? null : getAqiCategory(campusAqi);

  return (
    <div className="flex flex-col gap-8 px-4 pt-8 pb-12 lg:h-full lg:px-[52px] lg:pt-10 lg:pb-0">
      <AutoRefresh seconds={CURRENT_REVALIDATE_SECONDS} />
      <SlideHeader title="Air Quality Index" />
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
        <div className="flex flex-col gap-10 lg:w-[860px] lg:shrink-0">
          {/* AQI hero */}
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            <div className="flex flex-col gap-1">
              <span className="mono-label lg:text-sm">US AQI</span>
              <span className="text-[112px] leading-[0.9] font-medium tracking-[-0.05em] text-ink lg:text-[220px]">
                {campusAqi ?? "–"}
              </span>
            </div>
            <div className="flex items-center gap-3 lg:gap-4">
              <span
                aria-hidden
                className="size-4 shrink-0 rounded-full lg:size-6"
                style={{ backgroundColor: category?.color ?? OFFLINE_COLOR }}
              />
              <span className="text-4xl font-semibold tracking-[-0.03em] text-ink lg:text-[64px]">
                {category?.label ?? "No data"}
              </span>
            </div>
          </div>

          <div>
            <p className="mono-label lg:text-sm">AQI Scale</p>
            <div className="relative mt-3 flex h-3 gap-1">
              {AQI_CATEGORIES.map((c) => (
                <div
                  key={c.label}
                  className="flex-1 first:rounded-l-full last:rounded-r-full"
                  style={{ backgroundColor: c.color }}
                />
              ))}
              {campusAqi !== null && (
                <div
                  aria-label={`Current AQI: ${campusAqi}`}
                  className="absolute top-1/2 size-6 -translate-1/2 rounded-full border-4 border-white bg-ink shadow-[0_2px_8px_rgb(28_24_48/0.25)]"
                  style={{ left: `${getAqiScalePosition(campusAqi)}%` }}
                />
              )}
            </div>
            <div className="mono-label mt-3 flex justify-between gap-2 text-[10px] lg:text-xs">
              {scaleLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 text-base leading-[1.55] text-body lg:text-lg">
            <p className="font-semibold text-ink">What is PM 2.5?</p>
            <p>
              PM 2.5 refers to the tiny particles floating in the air
              smaller than 2.5 micrometers in diameter. They can come from
              sources including vehicle exhaust, power plants, wildfires,
              agriculture, and household activities like cooking, heating,
              and burning candles. Unfortunately, high exposure to PM 2.5
              levels is linked to respiratory issues in the long term, and
              irritation in the short term.
            </p>
            <p className="mt-3 font-semibold text-ink">What is the Air Quality Index?</p>
            <p>
              The Air Quality Index (AQI) is a number from 0 to 500 that
              translates PM 2.5 concentrations into a number that indicates
              air quality. A lower number means cleaner air. We calculate
              our campus AQI using PM 2.5 readings from PurpleAir sensors
              placed around Harvey Mudd, so the number you&apos;re seeing
              reflects the air quality right here, right now.
            </p>
          </div>
        </div>

        {/* Campus sensor map */}
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <h3 className="text-xl font-semibold tracking-[-0.02em] text-ink lg:text-[28px] lg:leading-tight">
            We have sensors that take air quality readings all around
            campus!
          </h3>
          <div
            role="img"
            aria-label="Map of Harvey Mudd College campus with PurpleAir sensors colored by air quality"
            className="relative aspect-[825/592] w-full overflow-hidden rounded-lg bg-[#eaf6ee] [--m:0.45] sm:[--m:0.7] lg:[--m:1]"
          >
            <CampusMap className="absolute inset-0 block size-full" />
            <span className="absolute right-0 bottom-0 z-30 rounded-tl bg-white/80 px-1.5 py-0.5 font-mono text-[9px] text-subtle lg:text-[11px]">
              © OpenStreetMap contributors
            </span>
            {readings.map((reading) => (
              <SensorMarker key={reading.sensor.id} {...reading} />
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="grid border-t border-rule lg:grid-cols-3">
        <Recommendation
          icon={<WindIcon />}
          label="Ventilation"
          text="Open your windows."
        />
        <Recommendation
          icon={<img alt="" src="/figma/icon-sun.svg" className="size-8" />}
          label="Outdoor Activity"
          text="It’s a great day to be outdoors!"
        />
        <Recommendation
          icon={
            <img
              alt=""
              src="/figma/icon-heart-pulse.svg"
              className="size-6"
            />
          }
          label="Sensitive Groups"
          text="It’s safe to go outside!"
        />
      </div>
    </div>
  );
}

function SensorMarker({ sensor, pm25 }: CurrentReading) {
  const { name, labelX, labelY } = sensor;
  const { x, y } = projectToMap(sensor.lat, sensor.lon);
  const aqi = pm25 === null ? null : pm25ToAqi(pm25);
  const category = aqi === null ? null : getAqiCategory(aqi);
  // --m scales marker size and label offsets with the map on small screens.
  const labelStyle: CSSProperties = {
    left: `calc(${x}% + var(--m) * ${labelX}px)`,
    top: `calc(${y}% + var(--m) * ${labelY}px)`,
  };

  return (
    <>
      <div
        className="absolute z-10 flex h-[calc(var(--m)*40px)] min-h-6 min-w-[calc(var(--m)*56px)] -translate-1/2 items-center justify-center gap-[calc(var(--m)*8px)] rounded-full bg-white px-[calc(var(--m)*14px)] text-[max(10px,calc(var(--m)*18px))] font-semibold text-ink shadow-[0_2px_8px_rgb(28_24_48/0.18)]"
        style={{ left: `${x}%`, top: `${y}%` }}
      >
        <span
          aria-hidden
          className="size-[max(6px,calc(var(--m)*12px))] shrink-0 rounded-full"
          style={{ backgroundColor: category?.color ?? OFFLINE_COLOR }}
        />
        {aqi ?? "–"}
      </div>
      <div
        className="absolute z-20 font-mono text-[max(8px,calc(var(--m)*13px))] whitespace-nowrap text-subtle"
        style={labelStyle}
      >
        {name}
      </div>
    </>
  );
}

function Recommendation({
  icon,
  label,
  text,
}: {
  icon: ReactNode;
  label: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-4 border-rule py-5 lg:gap-5 lg:px-6 lg:py-6 lg:first:pl-0 lg:[&:not(:first-child)]:border-l">
      <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-tint">
        {icon}
      </div>
      <div>
        <p className="mono-label lg:text-sm">{label}</p>
        <p className="mt-1 text-lg text-ink lg:text-[22px]">{text}</p>
      </div>
    </div>
  );
}
