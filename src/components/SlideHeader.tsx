export type HeaderVariant = "bright" | "deep" | "solid";

// Each slide's header is shaded a little differently, per the design.
const variants: Record<HeaderVariant, { className: string; background: string }> = {
  bright: {
    className: "border-b-[1.5px] border-[#c27aff] lg:text-[50px]",
    background: "linear-gradient(176.6deg, rgb(109 40 217) 0%, rgb(91 33 182) 100%)",
  },
  deep: {
    className: "lg:text-[50px]",
    background: "linear-gradient(176.66deg, rgb(91 33 182) 0%, rgb(76 29 149) 100%)",
  },
  solid: {
    className: "border-b-[3.75px] border-[#c27aff] lg:text-[40px]",
    background: "#5b21b6",
  },
};

export default function SlideHeader({
  title,
  variant,
}: {
  title: string;
  variant: HeaderVariant;
}) {
  const { className, background } = variants[variant];
  return (
    <header
      className={`flex items-center justify-between gap-4 px-4 py-4 text-xl lg:px-12 lg:py-8 ${className}`}
      style={{ background }}
    >
      <p className="text-2xl leading-none tracking-[-0.025em] text-white lg:text-[48px] lg:leading-[48px]">
        LILAQ Lab
      </p>
      <h2 className="text-right leading-tight tracking-[0.015em] text-white/95 lg:leading-9">
        {title}
      </h2>
    </header>
  );
}
