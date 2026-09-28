# LILAQLabDashboard

The LILAQ Lab air quality display: a four-slide rotating dashboard (Air
Quality Index, Particulate Matter, ACSM, About Us) built with Next.js,
TypeScript and Tailwind CSS from the "LILAQ Lab Display V-1" Figma design.

On large screens the slides are laid out on a 1920px stage that scales to fit
the screen and auto-advances every 15 seconds (arrow keys and the dots also
switch slides). On phones and tablets the slides stack into one scrolling
page.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Scripts

- `npm run dev`: start the dev server
- `npm run build`: production build
- `npm run start`: serve the production build
- `npm run lint`: run ESLint

## Structure

- `src/data/airQuality.ts`: the readings shown on the slides (AQI, sensors,
  QuantAQ hourly PM, ACSM composition). Swap these for live data.
- `src/components/slides/`: one component per slide
- `src/components/SlideShow.tsx`: stage scaling and slide rotation
- `public/figma/`: icons, chart vectors and photos exported from Figma
