# Interactive Wall Calendar Challenge

A polished React and Next.js submission for the frontend engineering challenge. The component is designed to feel like a printed wall calendar while still behaving like a modern interactive planner.

## What's included

- Physical wall-calendar styling with hanger, spiral binding, editorial hero art, and a paper-like sheet
- Date-range selection with clear start, end, in-range, weekend, and today states
- Integrated notes for the visible month and the currently selected date range
- Responsive layout that shifts from a split desktop composition to a stacked mobile flow
- Local persistence with `localStorage`
- Theme and artwork switching to demonstrate product thinking beyond the baseline requirements

## Tech choices

- Next.js App Router for a minimal modern React setup
- TypeScript for predictable state and component logic
- Plain CSS in `app/globals.css` to keep the submission lightweight and easy to review
- SVG artwork stored locally in `public/` so the project has no external image dependency

## Project structure

- `app/page.tsx` renders the challenge page
- `components/WallCalendar.tsx` contains the interactive calendar experience
- `app/globals.css` contains the wall-calendar aesthetic and responsive styles
- `public/*.svg` contains the built-in hero artwork themes

## Running locally

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open `http://localhost:3000`

## Interaction notes

- Click a day once to set the range start
- Click another day to set the range end
- Click a new day after completing a range to begin a new selection
- Month notes are stored per month
- Range notes are stored per exact start/end pair

## Submission checklist

- Source code: this repository
- Live demo: deploy to Vercel or Netlify if desired
- Video demonstration: record a short walkthrough showing desktop layout, mobile responsive behavior, range selection, notes persistence, and theme switching
