import Image from "next/image";
import SlideHeader from "@/components/SlideHeader";

// Each photo is cropped inside a fixed frame, matching the Figma image fills.
const instruments = [
  {
    name: "Purpleair",
    border: "#d7a5ff",
    titleColor: "#8200db",
    text: "Affordable sensors that measure PM 2.5. They use light scattering, which means shining a beam of light through the air, and counting the particles that are displaced. These are connected to a larger network of sensors across the world, and the information is published online.",
    image: {
      src: "/figma/instrument-purpleair.png",
      frame: "h-[75px] w-[106px]",
      crop: "top-[-21.57%] left-[-6.59%] h-[159.88%] w-[112.65%]",
      width: 120,
      height: 120,
    },
  },
  {
    name: "QuantAQ",
    border: "#ac43ff",
    titleColor: "#8200db",
    text: "Our QuantAQ sensors measure PM 1, PM 2.5, and PM 10 making them versatile in tracking different sizes of particulate matter. Similarly to PurpleAir, QuantAQ sensors also use light scattering. We have four QuantAQs!",
    image: {
      src: "/figma/instrument-quantaq.png",
      frame: "h-[99px] w-[105px]",
      crop: "top-[-40.26%] left-[-33.68%] h-[148.37%] w-[186.57%]",
      width: 196,
      height: 147,
    },
  },
  {
    name: "ACSM",
    border: "#7400d1",
    titleColor: "#7400d1",
    text: "Our ACSM sensor works by drawing air in and vaporizing it using heat. The gasses are ionized and passed through a mass spectrometer which separates molecules by their mass and identifies which chemical species they are.",
    image: {
      src: "/figma/instrument-acsm.png",
      frame: "h-[98px] w-[91px]",
      crop: "inset-0 size-full object-cover",
      width: 91,
      height: 98,
    },
  },
];

export default function AboutSlide() {
  return (
    <>
      <SlideHeader title="About Us" variant="solid" />
      <div className="flex flex-col gap-8 px-4 pt-6 pb-10 lg:flex-row lg:gap-10 lg:pt-12 lg:pr-0 lg:pb-0 lg:pl-9">
        <div className="flex flex-col gap-8 lg:h-[966px] lg:w-[860px] lg:shrink-0">
          <div className="card rounded-[14px] p-5 lg:flex-1 lg:p-8">
            <h3 className="text-2xl leading-9 text-ink lg:text-[30px]">
              About Us!
            </h3>
            <p className="mt-2 text-base leading-[29.25px] text-black lg:w-[797px] lg:text-lg">
              We are LILAQ, a group of students and professors across
              disciplines at Harvey Mudd College united with the shared mission
              of improving knowledge around air quality. We manage a network of
              sensors across HMC that collect air quality information, and
              analyze the data from these sensors to understand more about the
              air around us.
            </p>
            <h4 className="mt-[18px] text-xl leading-8 text-ink lg:text-2xl">
              Some of Our Instruments!
            </h4>
            <ul className="mt-4 flex flex-col gap-8 lg:-ml-[26px] lg:gap-12">
              {instruments.map((inst) => (
                <li key={inst.name} className="flex items-center gap-2">
                  <div className="hidden w-[106px] shrink-0 justify-center sm:flex">
                    <div className={`relative overflow-hidden ${inst.image.frame}`}>
                      <Image
                        src={inst.image.src}
                        alt={`${inst.name} sensor`}
                        width={inst.image.width}
                        height={inst.image.height}
                        className={`absolute max-w-none ${inst.image.crop}`}
                      />
                    </div>
                  </div>
                  <div
                    className="flex flex-col gap-2 border-l-[3.75px] pl-[19.746px] lg:min-h-[127px]"
                    style={{ borderColor: inst.border }}
                  >
                    <p
                      className="text-xl leading-7 font-bold"
                      style={{ color: inst.titleColor }}
                    >
                      {inst.name}
                    </p>
                    <p className="text-base leading-[22.75px] text-body lg:text-xl">
                      {inst.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card flex flex-col gap-4 rounded-[14px] p-6 lg:h-[162px] lg:pb-0">
            <h3 className="text-2xl leading-8 text-ink">Get Involved</h3>
            <div className="flex flex-col gap-2">
              <p className="text-base leading-7 font-bold text-body lg:text-lg">
                Interested in joining our lab or learning more? Please reach
                out!
              </p>
              <p className="text-base leading-6 font-semibold text-[#9810fa]">
                ___ insert lab email here
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[22px] lg:w-[952px] lg:shrink-0">
          <div className="card relative aspect-[952/824] overflow-hidden rounded-[14px]">
            <Image
              src="/figma/team-photo.jpg"
              alt="LILAQ lab members standing together outside"
              width={952}
              height={1266}
              className="absolute top-[-26.92%] left-[-0.02%] h-[153.73%] w-full max-w-none"
            />
          </div>
          <div className="card rounded-[14px] p-2.5 lg:h-[120px]">
            <p className="text-lg leading-7 text-ink lg:text-[30px] lg:leading-10">
              From left to right: Grey, Prof. Hawkins, Prof. Medero, Beverly,
              Nikhita, Aria, Ben, Esteban, Aadi
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
