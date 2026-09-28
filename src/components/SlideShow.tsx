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
const ROTATE_MS = 15_000;

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
      <main className="relative lg:h-[1187px] lg:w-[1920px] lg:shrink-0 lg:[scale:var(--stage-scale)]">
        {slides.map((slide, i) => (
          <section
            key={slide.title}
            aria-label={slide.title}
            className={i === active ? "lg:animate-slide-in" : "lg:hidden"}
          >
            {slide.content}
          </section>
        ))}

        <nav
          aria-label="Slides"
          className="absolute inset-x-0 bottom-5 hidden justify-center gap-3 lg:flex"
        >
          {slides.map((slide, i) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show ${slide.title}`}
              aria-current={i === active}
              className={`h-3 rounded-full transition-all ${
                i === active
                  ? "w-8 bg-[#7c3aed]"
                  : "w-3 bg-white/70 hover:bg-white"
              }`}
            />
          ))}
        </nav>
      </main>
    </div>
  );
}
