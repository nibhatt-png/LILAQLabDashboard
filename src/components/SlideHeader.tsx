import type { ReactNode } from "react";

/** Slide title over a hairline rule, like the section heads on the website. */
export default function SlideHeader({
  title,
  aside,
}: {
  title: string;
  /** Optional note shown opposite the title, e.g. where the data is from. */
  aside?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-ink pb-4 lg:pb-5">
      <h2 className="text-4xl font-semibold tracking-[-0.035em] text-ink lg:text-[64px] lg:leading-[1.05]">
        {title}
      </h2>
      {aside && <div className="mono-label lg:text-sm">{aside}</div>}
    </header>
  );
}
