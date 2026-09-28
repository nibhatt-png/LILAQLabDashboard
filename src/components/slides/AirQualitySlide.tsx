/* eslint-disable @next/next/no-img-element -- Figma SVG icons */
import type { CSSProperties, ReactNode } from "react";
import SlideHeader from "@/components/SlideHeader";
import { campusAqi, sensors } from "@/data/airQuality";
import {
  AQI_CATEGORIES,
  getAqiCategory,
  getAqiScalePosition,
} from "@/lib/aqi";

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

export default function AirQualitySlide() {
  const category = getAqiCategory(campusAqi);

  return (
    <>
      <SlideHeader title="Air Quality Index" variant="bright" />
      <div className="flex flex-col gap-6 px-4 pt-6 pb-10 lg:gap-8 lg:px-[52px] lg:pt-[67px] lg:pb-0">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* AQI hero */}
          <div className="flex flex-col gap-6 lg:w-[889px] lg:shrink-0">
            <div className="flex gap-4 lg:gap-12">
              <div
                className="card flex h-36 w-36 shrink-0 items-center justify-center rounded-2xl text-[72px] leading-none text-white lg:h-[282px] lg:w-[315px] lg:text-[140px]"
                style={{ backgroundColor: category.color }}
              >
                {campusAqi}
              </div>
              <div
                className="card flex h-36 flex-1 items-center justify-center rounded-[14px] text-[40px] leading-none lg:h-[281px] lg:w-[497px] lg:flex-none lg:text-[100px]"
                style={{ color: category.color }}
              >
                {category.label}
              </div>
            </div>

            <div className="card flex flex-col gap-6 rounded-2xl p-5 lg:h-[486px] lg:w-[864px] lg:px-8 lg:pt-8 lg:pb-0">
              <div>
                <p className="text-xl leading-5 font-bold text-subtle">
                  AQI Scale
                </p>
                <div className="relative mt-2 flex h-8 overflow-hidden rounded-[10px] shadow-[inset_0_2px_4px_rgb(0_0_0/0.05)]">
                  {AQI_CATEGORIES.map((c) => (
                    <div
                      key={c.label}
                      className="flex-1"
                      style={{ backgroundColor: c.color }}
                    />
                  ))}
                  <div
                    aria-label={`Current AQI: ${campusAqi}`}
                    className="absolute inset-y-0 w-1 bg-[#101828]"
                    style={{ left: `${getAqiScalePosition(campusAqi)}%` }}
                  />
                </div>
                <div className="mt-3 flex justify-between gap-2 text-[10px] leading-4 font-bold text-subtle lg:text-xs">
                  {scaleLabels.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
              </div>

              <div className="text-base leading-[29.25px] text-body lg:w-[801px] lg:text-lg">
                <p className="font-bold">What is PM 2.5?</p>
                <p>
                  PM 2.5 refers to the tiny particles floating in the air
                  smaller than 2.5 micrometers in diameter. They can come from
                  sources including vehicle exhaust, power plants, wildfires,
                  agriculture, and household activities like cooking, heating,
                  and burning candles. Unfortunately, high exposure to PM 2.5
                  levels is linked to respiratory issues in the long term, and
                  irritation in the short term.
                </p>
                <p className="font-bold">What is the Air Quality Index?</p>
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
          </div>

          {/* Campus sensor map */}
          <div className="card rounded-2xl p-5 lg:h-[792px] lg:w-[889px] lg:shrink-0 lg:px-8 lg:pt-8">
            <h3 className="text-xl leading-8 font-bold text-subtle lg:text-[30px] lg:leading-10">
              We have sensors that take air quality readings all around
              campus!
            </h3>
            <div
              className="relative mt-5 aspect-[825/592] w-full rounded-[14px] border-[1.5px] border-[#e9d4ff] [--m:0.45] sm:[--m:0.7] lg:mt-[29px] lg:w-[825px] lg:[--m:1]"
              style={{
                backgroundImage:
                  "linear-gradient(144.3deg, rgb(250 245 255) 0%, rgb(243 232 255) 100%)",
              }}
            >
              <div className="absolute top-[0.25%] left-[-2.24%] h-[99.5%] w-[104.36%]">
                <img
                  alt=""
                  src="/figma/campus-map.svg"
                  className="absolute inset-0 block size-full max-w-none"
                />
              </div>
              {sensors.map((sensor) => (
                <SensorMarker key={sensor.name} {...sensor} />
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="grid gap-4 lg:flex lg:justify-between">
          <Recommendation
            iconBg="#d7fec2"
            icon={<WindIcon />}
            label="Ventilation"
            text="Open your windows."
            className="lg:w-[545px]"
          />
          <Recommendation
            iconBg="#fef9c2"
            icon={
              <img alt="" src="/figma/icon-sun.svg" className="size-8" />
            }
            label="Outdoor Activity"
            text="It’s a great day to be outdoors!"
            className="lg:w-[550px]"
          />
          <Recommendation
            iconBg="#fec2d5"
            icon={
              <img
                alt=""
                src="/figma/icon-heart-pulse.svg"
                className="size-6"
              />
            }
            label="Sensitive Groups"
            text="It’s safe to go outside!"
            className="lg:w-[529px]"
          />
        </div>
      </div>
    </>
  );
}

function SensorMarker({
  name,
  aqi,
  x,
  y,
  labelX,
  labelY,
}: (typeof sensors)[number]) {
  // --m scales marker size and label offsets with the map on small screens.
  const markerStyle: CSSProperties = {
    left: `${x}%`,
    top: `${y}%`,
    backgroundColor: getAqiCategory(aqi).color,
  };
  const labelStyle: CSSProperties = {
    left: `calc(${x}% + var(--m) * ${labelX}px)`,
    top: `calc(${y}% + var(--m) * ${labelY}px)`,
  };

  return (
    <>
      <div
        className="absolute z-10 flex size-[calc(var(--m)*48px)] min-h-6 min-w-6 -translate-1/2 items-center justify-center rounded-full border-[calc(var(--m)*3.75px)] border-white text-[max(10px,calc(var(--m)*14px))] leading-5 font-semibold text-black drop-shadow-[0_10px_7.5px_rgb(0_0_0/0.1)]"
        style={markerStyle}
      >
        {aqi}
      </div>
      <div
        className="absolute z-20 rounded-[10px] bg-white px-[calc(var(--m)*12px)] py-[calc(var(--m)*6px)] text-[max(9px,calc(var(--m)*14px))] leading-[1.43] font-semibold whitespace-nowrap text-[#0a0a0a] drop-shadow-[0_4px_3px_rgb(0_0_0/0.1)]"
        style={labelStyle}
      >
        {name}
      </div>
    </>
  );
}

function Recommendation({
  icon,
  iconBg,
  label,
  text,
  className = "",
}: {
  icon: ReactNode;
  iconBg: string;
  label: string;
  text: string;
  className?: string;
}) {
  return (
    <div
      className={`card flex h-[104px] items-center gap-4 rounded-[14px] p-6 ${className}`}
    >
      <div
        className="flex size-14 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: iconBg }}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm leading-5 text-subtle">{label}</p>
        <p className="text-lg leading-7 text-[#0a0a0a]">{text}</p>
      </div>
    </div>
  );
}
