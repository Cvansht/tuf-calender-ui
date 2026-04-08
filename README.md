# Interactive Wall Calendar

An interactive wall-calendar UI built with Next.js, React, TypeScript, Tailwind CSS, and Motion for React.

The goal of this project is to translate a static poster-style calendar reference into a tactile, responsive frontend experience. The component keeps the visual language of a printed wall calendar while adding modern interaction patterns such as date-range selection, notes, important-date marking, seasonal theming, and animated month flipping.

## Highlights

- Poster-style calendar layout with a spiral-bound header, hero image panel, notes column, and monthly date grid
- Gesture-driven month navigation with a paper-flip animation powered by `motion/react`
- Start/end range selection with in-range and preview states
- Important single-date marking for reminders, holidays, or special events
- Notes area that adapts to the current selection context
- Month-based seasonal theme system with animated hero decorations and ambient page backgrounds
- Responsive layout tuned for both desktop and mobile without introducing horizontal scrolling
- Client-side persistence using `localStorage`
- No backend, database, or external API dependency

## Tech Stack

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS v4
- Motion for React (`motion/react`)
- Local SVG assets in `public/`

## Core Features

### 1. Wall Calendar Presentation

The interface is designed as a single centered calendar sheet:

- realistic spiral binding and hanging hook
- hero artwork at the top
- notes panel on the left
- month grid on the right
- paper-like shell, shadows, and soft background lighting

### 2. Range Selection

Users can select a date range directly from the grid.

- first click sets the start date
- second click sets the end date
- hovering after the first click previews the tentative range
- start and end dates are visually labeled
- in-range dates receive a softer filled treatment

### 3. Important Date Marking

The notes panel includes a `Range` / `Mark` mode switch.

- `Range` mode is for standard start/end date selection
- `Mark` mode lets the user pin one important date for the visible month
- important dates are visually distinct in the grid and reflected in the notes context

### 4. Notes System

The notes panel supports two contexts:

- month-level notes when no range is active
- range-specific notes when a date range is selected

This keeps the interaction lightweight while still allowing the user to capture both general month planning and selection-specific details.

### 5. Seasonal Themes

Each month has a dedicated theme defined in code:

- accent colors for selection states
- hero image filter and crop tuning
- left/right wedge color treatments
- ambient background gradients
- animated decorations like snow, stars, rain, mist, or sunlight orbs

### 6. Paper Flip Motion

Month changes are animated as a physical page turn rather than a simple grid swap.

- vertical drag gestures trigger month flips
- wheel/trackpad interaction is supported
- the page tilts, lifts, and casts a shadow during the motion
- entering and exiting pages share a perspective space to mimic stacked paper

## User Interaction Model

### Month navigation

- drag the calendar page vertically to flip to the previous or next month
- trackpad or mouse-wheel gestures also trigger flips once the threshold is reached

### Range selection

- click one day to start a range
- click another day to complete it
- click a new date after completion to begin a fresh range

### Important dates

- switch to `Mark`
- click a single day to mark it as important
- click the same day again or use the clear action in notes to remove it

### Notes

- month notes are shown when no range is active
- range notes appear when a range is selected
- notes are stored locally and restored on reload

## Architecture

The app is intentionally split into presentation, interaction, theme data, and calendar utilities so the main calendar component stays readable.

### App layer

- [app/layout.tsx](/c:/Users/shiva/Desktop/tuf%20task/app/layout.tsx)
  - loads global fonts and top-level page styling
- [app/page.tsx](/c:/Users/shiva/Desktop/tuf%20task/app/page.tsx)
  - centers the calendar in the viewport
- [app/globals.css](/c:/Users/shiva/Desktop/tuf%20task/app/globals.css)
  - imports Tailwind and keeps a few global theme/print rules

### Public entry point

- [components/WallCalendar.tsx](/c:/Users/shiva/Desktop/tuf%20task/components/WallCalendar.tsx)
  - thin re-export layer

### Main feature container

- [components/calendar/WallCalendar.tsx](/c:/Users/shiva/Desktop/tuf%20task/components/calendar/WallCalendar.tsx)
  - owns month state, flip state, selection state, persistence wiring, and theme/background coordination
  - builds the calendar days for the visible month
  - coordinates drag/wheel month transitions
  - passes themed styling tokens down to the grid and notes

### Visual subcomponents

- [components/calendar/SpiralRings.tsx](/c:/Users/shiva/Desktop/tuf%20task/components/calendar/SpiralRings.tsx)
  - realistic spiral binding, hook, and punched paper details
- [components/calendar/HeroScene.tsx](/c:/Users/shiva/Desktop/tuf%20task/components/calendar/HeroScene.tsx)
  - top hero panel, month/year treatment, wedges, and animated cover presentation
- [components/calendar/HeroDecorations.tsx](/c:/Users/shiva/Desktop/tuf%20task/components/calendar/HeroDecorations.tsx)
  - seasonal animated overlays such as snow, mist, stars, and sunlight
- [components/calendar/CalendarBody.tsx](/c:/Users/shiva/Desktop/tuf%20task/components/calendar/CalendarBody.tsx)
  - composes the notes panel and the date grid into the lower half
- [components/calendar/NotesPanel.tsx](/c:/Users/shiva/Desktop/tuf%20task/components/calendar/NotesPanel.tsx)
  - notes UI, mode switching, and important-date summary
- [components/calendar/CalendarGrid.tsx](/c:/Users/shiva/Desktop/tuf%20task/components/calendar/CalendarGrid.tsx)
  - weekday headers and day-cell mapping
- [components/calendar/DayCell.tsx](/c:/Users/shiva/Desktop/tuf%20task/components/calendar/DayCell.tsx)
  - individual date rendering, selection styling, holiday markers, and hover/tap motion

### Data and utilities

- [components/calendar/data/themes.ts](/c:/Users/shiva/Desktop/tuf%20task/components/calendar/data/themes.ts)
  - one theme object per month
- [components/calendar/data/holidays.ts](/c:/Users/shiva/Desktop/tuf%20task/components/calendar/data/holidays.ts)
  - lightweight mock holiday markers
- [components/calendar/utils/date.ts](/c:/Users/shiva/Desktop/tuf%20task/components/calendar/utils/date.ts)
  - month grid generation, formatting helpers, and ISO date utilities
- [components/calendar/types.ts](/c:/Users/shiva/Desktop/tuf%20task/components/calendar/types.ts)
  - shared type definitions for themes, calendar days, and selection states

### Supporting files

The calendar folder also contains a few earlier or optional exploratory pieces that are not part of the current primary render path:

- [components/calendar/MonthMiniMap.tsx](/c:/Users/shiva/Desktop/tuf%20task/components/calendar/MonthMiniMap.tsx)
- [components/calendar/MonthNav.tsx](/c:/Users/shiva/Desktop/tuf%20task/components/calendar/MonthNav.tsx)
- [components/calendar/SceneLayer.tsx](/c:/Users/shiva/Desktop/tuf%20task/components/calendar/SceneLayer.tsx)
- [components/calendar/ChevronDivider.tsx](/c:/Users/shiva/Desktop/tuf%20task/components/calendar/ChevronDivider.tsx)
- [components/calendar/hooks/useSavedBadge.ts](/c:/Users/shiva/Desktop/tuf%20task/components/calendar/hooks/useSavedBadge.ts)

## State and Persistence

The calendar stores interaction state locally in the browser.

### In-memory UI state

- visible month
- background theme month
- current range start and end
- preview end date during hover
- selection mode (`range` or `important`)
- flip direction and flip lock state

### Persisted state

The following data is written to `localStorage`:

- `wall-calendar-month-notes`
- `wall-calendar-range-notes`
- `wall-calendar-important-dates`

This keeps the project frontend-only while still making it feel useful between sessions.

## Motion System

The flip interaction is implemented with Motion for React and is designed to feel closer to paper than standard route or list animation.

It includes:

- shared 3D perspective for entering and exiting pages
- page lift and tilt during drag
- edge highlight and cast shadow during the turn
- delayed background-theme updates so the full-page ambience tracks the visible month instead of changing too early

## Responsive Behavior

The layout is designed around a centered poster sheet rather than a full-width dashboard.

- on desktop, the notes column and date grid sit side by side
- on smaller screens, spacing, typography, and hero proportions compress to keep the calendar usable without horizontal overflow
- the calendar remains vertically focused so the whole component is easier to see in one frame

## Assets

Local assets live in `public/`:

- [calendar-cover-photo.svg](/c:/Users/shiva/Desktop/tuf%20task/public/calendar-cover-photo.svg)
- [pencil-cursor.svg](/c:/Users/shiva/Desktop/tuf%20task/public/pencil-cursor.svg)
- older art variants:
  - [alpine-wall-art.svg](/c:/Users/shiva/Desktop/tuf%20task/public/alpine-wall-art.svg)
  - [desert-wall-art.svg](/c:/Users/shiva/Desktop/tuf%20task/public/desert-wall-art.svg)
  - [forest-wall-art.svg](/c:/Users/shiva/Desktop/tuf%20task/public/forest-wall-art.svg)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

### 3. Open the app

Visit:

```text
http://localhost:3000
```

## Available Scripts

- `npm run dev` - start the local development server
- `npm run build` - create a production build
- `npm run start` - serve the production build
- `npm run lint` - run project linting if configured in the environment

## Design and Engineering Notes

- The implementation is intentionally frontend-only.
- Theme and holiday data are mock/local by design.
- The calendar is built as a single highly polished component, but the internal code is split into focused modules so the interaction and presentation layers stay maintainable.
- The project favors code-native visuals and local assets over remote media dependencies.

## Future Improvements

Potential next steps if this were taken beyond the challenge scope:

- keyboard accessibility for month flipping and date selection
- richer note organization by date instead of by month/range only
- user-uploaded hero artwork
- print/export mode for a cleaner physical-calendar output
- automated visual regression coverage for layout fidelity

## Production Check

Use the following command to validate a production build locally:

```bash
npm run build
```
