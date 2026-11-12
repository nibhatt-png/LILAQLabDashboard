"use client";

import {
  useEffect,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";

// The design is laid out on a fixed 1920px-wide stage. On large screens the
// stage is scaled to fit the viewport; on small screens the slides stack.
const STAGE_WIDTH = 1920;
const STAGE_HEIGHT = 1187;
// How long each slide stays up before the next one.
const ROTATE_MS = 30_000;

function subscribeToResize(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function getStageScale() {
  return Math.min(
    window.innerWidth / STAGE_WIDTH,
    window.innerHeight / STAGE_HEIGHT,
  );
}

export interface Slide {
  title: string;
  content: ReactNode;
}

export default function SlideShow({ slides }: { slides: Slide[] }) {
  const [active, setActive] = useState(0);
  const scale = useSyncExternalStore(subscribeToResize, getStageScale, () => 1);

  // Restarting the timer whenever the slide changes means manual navigation
  // gets a full interval before the next auto-advance.
  useEffect(() => {
    const id = setTimeout(
      () => setActive((i) => (i + 1) % slides.length),
      ROTATE_MS,
    );
    return () => clearTimeout(id);
  }, [active, slides.length]);

  // A link to "#particulate-matter" etc. opens on that slide. Keyed on the
  // titles, since the data refresh hands over a new slides array each time.
  const ids = slides.map((s) => slideId(s.title)).join(" ");
  useEffect(() => {
    const onHashChange = () => {
      const i = ids.split(" ").indexOf(location.hash.slice(1));
      if (i !== -1) setActive(i);
    };
    onHashChange();
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [ids]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setActive((i) => (i + 1) % slides.length);
      if (e.key === "ArrowLeft")
        setActive((i) => (i - 1 + slides.length) % slides.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [slides.length]);

  return (
    <div
      className="lg:flex lg:h-dvh lg:items-center lg:justify-center lg:overflow-hidden"
      style={{ "--stage-scale": scale } as CSSProperties}
    >
      <div className="relative lg:flex lg:h-[1187px] lg:w-[1920px] lg:shrink-0 lg:flex-col lg:[scale:var(--stage-scale)]">
        <header className="sticky top-0 z-30 border-b border-rule bg-white lg:static">
          <nav
            aria-label="Slides"
            className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 px-4 py-4 lg:px-[52px] lg:py-6"
          >
            <a href="#top" className="flex items-center gap-2.5 text-ink">
              <svg width="30" height="22" viewBox="0 0 64 46" aria-hidden="true">
                <path
                  d="M16 44a14 14 0 0 1-2-27.9A18 18 0 0 1 48 12a12 12 0 0 1 2 32Z"
                  className="fill-accent"
                />
              </svg>
              <span className="text-[19px] font-semibold tracking-[-0.02em] lg:text-2xl">
                LILAQ
              </span>
            </a>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px] lg:gap-10 lg:text-lg">
              {slides.map((slide, i) => (
                <a
                  key={slide.title}
                  href={`#${slideId(slide.title)}`}
                  onClick={() => setActive(i)}
                  aria-current={i === active}
                  className={`border-b-[1.5px] pb-0.5 transition-colors hover:text-accent ${
                    i === active ? "border-ink text-ink" : "border-transparent text-body"
                  }`}
                >
                  {slide.title}
                </a>
              ))}
            </div>
          </nav>
        </header>

        <main id="top" className="lg:relative lg:min-h-0 lg:flex-1">
          {slides.map((slide, i) => (
            <section
              key={slide.title}
              id={slideId(slide.title)}
              aria-label={slide.title}
              className={`scroll-mt-28 ${i === active ? "lg:animate-slide-in" : "lg:hidden"}`}
            >
              {slide.content}
            </section>
          ))}
        </main>

        {/* Shows how long until the next slide. */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 hidden h-[3px] bg-rule lg:block">
          <div
            key={active}
            className="h-full origin-left bg-accent"
            style={{ animation: `slide-progress ${ROTATE_MS}ms linear` }}
          />
        </div>
      </div>
    </div>
  );
}

const slideId = (title: string) => title.toLowerCase().replace(/\s+/g, "-");
