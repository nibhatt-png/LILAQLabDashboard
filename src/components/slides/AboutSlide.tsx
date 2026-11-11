import Image from "next/image";
import SlideHeader from "@/components/SlideHeader";

// Each photo is cropped inside a fixed frame, matching the Figma image fills.
const instruments = [
  {
    name: "Purpleair",
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
    <div className="flex flex-col gap-8 px-4 pt-8 pb-12 lg:h-full lg:px-[52px] lg:pt-10 lg:pb-0">
      <SlideHeader title="About Us" />
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
        <div className="flex flex-col gap-8 lg:w-[860px] lg:shrink-0 lg:gap-6">
          <div>
            <h3 className="text-2xl font-semibold tracking-[-0.025em] text-ink lg:text-[32px]">
              About Us!
            </h3>
            <p className="mt-3 text-base leading-[1.55] text-body lg:text-lg">
              We are LILAQ, a group of students and professors across
              disciplines at Harvey Mudd College united with the shared mission
              of improving knowledge around air quality. We manage a network of
              sensors across HMC that collect air quality information, and
              analyze the data from these sensors to understand more about the
              air around us.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold tracking-[-0.02em] text-ink lg:text-2xl">
              Some of Our Instruments!
            </h4>
            <ul className="mt-4 border-b border-rule">
              {instruments.map((inst) => (
                <li
                  key={inst.name}
                  className="flex items-center gap-5 border-t border-rule py-5 lg:gap-6 lg:py-4"
                >
                  <div className="hidden size-[104px] shrink-0 items-center justify-center rounded-md bg-tint sm:flex">
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
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xl font-semibold tracking-[-0.015em] text-ink">
                      {inst.name}
                    </p>
                    <p className="text-base leading-[1.5] text-body lg:text-lg">
                      {inst.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2 rounded-lg bg-ink p-6 lg:px-8">
            <h3 className="text-2xl font-semibold tracking-[-0.03em] text-white lg:text-[28px]">
              Get Involved
            </h3>
            <p className="text-lg leading-snug text-[#d9d4e6] lg:text-2xl">
              Interested in joining our lab or learning more? Please reach
              out!
            </p>
            {/* TODO: add the lab's contact email here. */}
          </div>
        </div>

        <figure className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="relative aspect-[952/824] overflow-hidden rounded-lg">
            <Image
              src="/figma/team-photo.jpg"
              alt="LILAQ lab members standing together outside"
              width={952}
              height={1266}
              className="absolute top-[-26.92%] left-[-0.02%] h-[153.73%] w-full max-w-none"
            />
          </div>
          <figcaption className="text-base leading-snug text-body lg:text-xl">
            <span className="mono-label mr-2 lg:text-sm">From left to right:</span>
            Grey, Prof. Hawkins, Prof. Medero, Beverly, Nikhita, Aria, Ben,
            Esteban, Aadi
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
