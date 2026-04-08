"use client";

import type { WheelEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";

import { CalendarBody } from "./CalendarBody";
import { HeroScene } from "./HeroScene";
import { SpiralRings } from "./SpiralRings";
import { holidaysByMonth } from "./data/holidays";
import { getMonthTheme } from "./data/themes";
import { buildMonthDays, formatRangeLabel, getMonthKey } from "./utils/date";

const monthStorageKey = "wall-calendar-month-notes";
const rangeStorageKey = "wall-calendar-range-notes";
const importantDateStorageKey = "wall-calendar-important-dates";
const DRAG_FLIP_THRESHOLD = 112;
const WHEEL_FLIP_THRESHOLD = 90;
const FLIP_LOCK_MS = 980;

/* --- Paper-physics timing -----------------------------------------------
   Exit  : page peels off the bar slowly, then accelerates away over the top.
           Real paper has inertia - it resists leaving the surface.
   Enter : page swoops in from behind the bar (unseen), then falls with a
           heavy spring. Mass 1.7 + damping 16 -> slight over-shoot "thwap".
   Drag  : tilt/lift/shadow all react proportionally to finger displacement.
------------------------------------------------------------------------- */

const EXIT_EASE: [number, number, number, number] = [0.32, 0, 0.72, 0.18];

const getStoredRecord = (key: string) => {
  if (typeof window === "undefined") return {};
  const value = window.localStorage.getItem(key);
  return value ? (JSON.parse(value) as Record<string, string>) : {};
};

const formatNoteDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const toRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace("#", "");
  const safe =
    normalized.length === 3
      ? normalized
          .split("")
          .map((p) => `${p}${p}`)
          .join("")
      : normalized;
  const value = Number.parseInt(safe, 16);
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
};

export function WallCalendar() {
  const today = useMemo(() => new Date(), []);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(2022, 0, 1));
  const [backgroundMonth, setBackgroundMonth] = useState(
    () => new Date(2022, 0, 1)
  );
  const [rangeStart, setRangeStart] = useState<string | null>(null);
  const [rangeEnd, setRangeEnd] = useState<string | null>(null);
  const [previewEnd, setPreviewEnd] = useState<string | null>(null);
  const [monthNotes, setMonthNotes] = useState<Record<string, string>>(() =>
    getStoredRecord(monthStorageKey)
  );
  const [rangeNotes, setRangeNotes] = useState<Record<string, string>>(() =>
    getStoredRecord(rangeStorageKey)
  );
  const [importantDates, setImportantDates] = useState<Record<string, string>>(
    () => getStoredRecord(importantDateStorageKey)
  );
  const [selectionMode, setSelectionMode] = useState<"range" | "important">(
    "range"
  );
  const [direction, setDirection] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const isFlippingRef = useRef(false);
  const flipUnlockTimeoutRef = useRef<number | null>(null);
  const wheelAccumulatorRef = useRef(0);
  const wheelDirectionRef = useRef<1 | -1 | 0>(0);
  const wheelResetTimeoutRef = useRef<number | null>(null);

  // -- Drag motion values ------------------------------------------------
  const dragY = useMotionValue(0);

  // Page tilts around the top binding as you pull it down/up
  const dragRotate = useTransform(dragY, [-140, 0, 140], [6.5, 0, -6.5]);

  // Slight upward / downward lift
  const dragLift = useTransform(dragY, [-140, 0, 140], [5, 0, -3]);

  // Very subtle scale to sell the perspective recede
  const dragScale = useTransform(dragY, [-140, 0, 140], [0.9965, 1, 0.998]);

  // Shadow opacity: increases the more the page is pulled
  const dragShadowOpacity = useTransform(
    dragY,
    [-140, -60, 0, 60, 140],
    [0.28, 0.1, 0, 0.1, 0.28]
  );

  // Edge-catch highlight at top: paper edge lights up as it lifts
  const dragEdgeHighlight = useTransform(
    dragY,
    [-140, -20, 0, 20, 140],
    [0.9, 0.4, 0, 0.4, 0.9]
  );

  // Keep isFlipping state in sync so the shadow re-renders
  useMotionValueEvent(dragY, "change", (v) => {
    if (Math.abs(v) > 18 && !isFlipping) setIsFlipping(true);
    if (Math.abs(v) < 4 && isFlipping) setIsFlipping(false);
  });

  const monthTheme = useMemo(
    () => getMonthTheme(visibleMonth.getMonth()),
    [visibleMonth]
  );
  const backgroundTheme = useMemo(
    () => getMonthTheme(backgroundMonth.getMonth()),
    [backgroundMonth]
  );

  const monthKey = getMonthKey(visibleMonth);
  const days = useMemo(() => buildMonthDays(visibleMonth), [visibleMonth]);
  const holidays = holidaysByMonth[visibleMonth.getMonth()] ?? [];
  const monthNote = monthNotes[monthKey] ?? "";
  const importantDate = importantDates[monthKey] ?? null;
  const selectedRangeKey =
    rangeStart && rangeEnd ? `${rangeStart}_${rangeEnd}` : "draft";
  const rangeNote = rangeNotes[selectedRangeKey] ?? "";
  const selectedRangeLabel =
    rangeStart && (rangeEnd || previewEnd)
      ? formatRangeLabel(rangeStart, rangeEnd ?? previewEnd)
      : rangeStart
        ? formatRangeLabel(rangeStart)
        : null;
  const importantDateLabel = importantDate ? formatNoteDate(importantDate) : null;

  const pageBackground = useMemo(
    () =>
      [
        "radial-gradient(circle at 18% 14%, rgba(255,255,255,0.92), transparent 24%)",
        `radial-gradient(circle at 84% 10%, ${toRgba(backgroundTheme.accentSoft, 0.92)}, transparent 28%)`,
        `linear-gradient(180deg, #f7f3ec 0%, ${toRgba(backgroundTheme.accentSoft, 0.82)} 56%, ${toRgba(backgroundTheme.rightAccent, 0.18)} 100%)`,
      ].join(", "),
    [backgroundTheme]
  );
  const pageGlow = useMemo(
    () =>
      `radial-gradient(circle at 76% 18%, ${toRgba(backgroundTheme.accent, 0.2)} 0%, ${toRgba(backgroundTheme.leftAccent, 0.11)} 36%, transparent 70%)`,
    [backgroundTheme]
  );

  const persistMonthNotes = (next: Record<string, string>) => {
    setMonthNotes(next);
    window.localStorage.setItem(monthStorageKey, JSON.stringify(next));
  };
  const persistRangeNotes = (next: Record<string, string>) => {
    setRangeNotes(next);
    window.localStorage.setItem(rangeStorageKey, JSON.stringify(next));
  };
  const persistImportantDates = (next: Record<string, string>) => {
    setImportantDates(next);
    window.localStorage.setItem(importantDateStorageKey, JSON.stringify(next));
  };

  useEffect(() => {
    return () => {
      if (flipUnlockTimeoutRef.current)
        window.clearTimeout(flipUnlockTimeoutRef.current);
      if (wheelResetTimeoutRef.current)
        window.clearTimeout(wheelResetTimeoutRef.current);
    };
  }, []);

  const unlockFlip = () => {
    isFlippingRef.current = false;
    setIsFlipping(false);
    if (flipUnlockTimeoutRef.current) {
      window.clearTimeout(flipUnlockTimeoutRef.current);
      flipUnlockTimeoutRef.current = null;
    }
  };

  const transitionMonth = (nextMonth: Date, nextDirection: number) => {
    if (isFlippingRef.current) return;
    isFlippingRef.current = true;
    setIsFlipping(true);
    wheelAccumulatorRef.current = 0;
    wheelDirectionRef.current = 0;
    setDirection(nextDirection);
    setVisibleMonth(nextMonth);
    flipUnlockTimeoutRef.current = window.setTimeout(() => {
      unlockFlip();
      setBackgroundMonth(nextMonth);
    }, FLIP_LOCK_MS);
  };

  const handleSelectDay = (iso: string) => {
    setPreviewEnd(null);
    if (selectionMode === "important") {
      const next = { ...importantDates };
      if (importantDate === iso) delete next[monthKey];
      else next[monthKey] = iso;
      persistImportantDates(next);
      setSelectionMode("range");
      return;
    }
    if (!rangeStart || rangeEnd) {
      setRangeStart(iso);
      setRangeEnd(null);
      return;
    }
    if (iso < rangeStart) {
      setRangeEnd(rangeStart);
      setRangeStart(iso);
      return;
    }
    setRangeEnd(iso);
  };

  const handleHoverDay = (iso: string) => {
    if (selectionMode === "range" && rangeStart && !rangeEnd)
      setPreviewEnd(iso);
  };

  const flipToNextMonth = () =>
    transitionMonth(
      new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1),
      1
    );

  const flipToPreviousMonth = () =>
    transitionMonth(
      new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1),
      -1
    );

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { y: number } }
  ) => {
    if (info.offset.y <= -DRAG_FLIP_THRESHOLD) {
      flipToNextMonth();
    } else if (info.offset.y >= DRAG_FLIP_THRESHOLD) {
      flipToPreviousMonth();
    }
    dragY.set(0);
  };

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (isFlippingRef.current) return;
    if (Math.abs(event.deltaY) < 20) return;
    event.preventDefault();
    event.stopPropagation();

    const wheelDirection = event.deltaY > 0 ? 1 : -1;
    if (
      wheelDirectionRef.current !== 0 &&
      wheelDirectionRef.current !== wheelDirection
    )
      wheelAccumulatorRef.current = 0;

    wheelDirectionRef.current = wheelDirection;
    wheelAccumulatorRef.current += Math.abs(event.deltaY);

    if (wheelResetTimeoutRef.current)
      window.clearTimeout(wheelResetTimeoutRef.current);
    wheelResetTimeoutRef.current = window.setTimeout(() => {
      wheelAccumulatorRef.current = 0;
      wheelDirectionRef.current = 0;
    }, 180);

    if (wheelAccumulatorRef.current < WHEEL_FLIP_THRESHOLD) return;
    wheelAccumulatorRef.current = 0;
    wheelDirectionRef.current = 0;

    if (wheelDirection > 0) flipToNextMonth();
    else flipToPreviousMonth();
  };

  return (
    <>
      {/* -- Ambient background ------------------------------------------ */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden print:hidden">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={`page-${backgroundTheme.id}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: pageBackground }}
          />
        </AnimatePresence>
        <motion.div
          className="absolute inset-0"
          style={{ background: pageGlow, filter: "blur(26px)" }}
          animate={{ scale: [1, 1.035, 1], x: [0, 10, 0], y: [0, -6, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* -- Calendar shell ---------------------------------------------- */}
      <section className="relative z-10 mx-auto grid w-full max-w-[540px] gap-2 md:max-w-[600px] print:max-w-none">
        <div className="rounded-[24px] bg-[linear-gradient(180deg,#fffdfa_0%,#f8f4eb_100%)] p-2 shadow-[0_18px_50px_rgba(18,33,58,0.14)] md:p-3 print:bg-white print:p-0 print:shadow-none">
          <SpiralRings />

          {/*
           * The draggable wrapper: y motion -> lift + tilt + scale.
           * transformPerspective lives here so it's applied once to the
           * viewport, not per-page - avoids the "wobble" you get when
           * AnimatePresence replaces elements with their own perspective.
           */}
          <motion.div
            className="overflow-hidden rounded-[20px] border border-slate-200/70 bg-[#fffdf8] print:rounded-none print:border-0"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.08}
            dragMomentum={false}
            dragTransition={{ bounceStiffness: 220, bounceDamping: 26 }}
            whileTap={{ cursor: "grabbing" }}
            onDrag={(_, info) => dragY.set(info.offset.y)}
            onDragEnd={handleDragEnd}
            onWheel={handleWheel}
            style={{
              touchAction: "none",
              y: dragLift,
              rotateX: dragRotate,
              scale: dragScale,
              transformPerspective: 2000,
              transformOrigin: "50% 0%",
            }}
          >
            {/*
             * Perspective + clip wrapper. The `[perspective:...]` on a
             * parent of the AnimatePresence target creates a shared
             * vanishing point, so entering / exiting pages share the same
             * 3-D space.
             */}
            <div
              className="relative overflow-hidden bg-white"
              style={{ perspective: "2400px", perspectiveOrigin: "50% -8%" }}
            >
              {/* -- "Page beneath" - visible during flip ---------------- */}
              {/*
               * This stationary layer mimics the next calendar page
               * sitting on the stack. It becomes visible when the top
               * page peels away, giving the stacked-pages illusion.
               */}
              <div
                className="pointer-events-none absolute inset-0"
                aria-hidden
                style={{
                  background:
                    "linear-gradient(180deg, #f2ede4 0%, #ede8df 100%)",
                  zIndex: 0,
                }}
              />

              {/* -- Flip shadow (cast by the turning page) -------------- */}
              {/*
               * A gradient that simulates the shadow the rotating page
               * casts downward as it lifts away from the surface.
               * Only visible while a flip (or drag) is in progress.
               */}
              <motion.div
                className="pointer-events-none absolute inset-x-0 top-0 z-30"
                style={{
                  height: "28%",
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.26) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)",
                  opacity: isFlipping ? dragShadowOpacity : 0,
                }}
                animate={{ opacity: isFlipping ? 1 : 0 }}
                transition={{ duration: isFlipping ? 0.12 : 0.38 }}
              />

              {/* -- Paper-edge catch-light ------------------------------ */}
              {/*
               * The very top edge of a page looks bright when it lifts
               * (light grazes the edge of the paper). A thin 1-px line
               * that fades in during drag/flip sells this completely.
               */}
              <motion.div
                className="pointer-events-none absolute inset-x-0 top-0 z-30 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.88) 30%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0.88) 70%, transparent 100%)",
                  opacity: dragEdgeHighlight,
                }}
              />

              {/* -- Animated page -------------------------------------- */}
              <AnimatePresence
                initial={false}
                custom={direction}
                mode="wait"
                onExitComplete={() => setBackgroundMonth(visibleMonth)}
              >
                <motion.div
                  key={`${visibleMonth.getFullYear()}-${visibleMonth.getMonth()}`}
                  custom={direction}
                  className="relative z-10 origin-top will-change-transform"
                  style={{
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                  /*
                   * ENTER - the page arrives from behind the spiral bar.
                   * It starts fully rotated away (96 deg) so it's hidden,
                   * then a heavy spring lets it fall into place.
                   *
                   * Spring anatomy:
                   *   stiffness 60 -> slow, deliberate landing
                   *   damping   16 -> slight over-shoot ("thwap" feel)
                   *   mass      1.7 -> the paper is heavy
                   *
                   * opacity snaps to 1 in 80ms so the page appears to
                   * materialise from behind the binding rather than
                   * cross-fading in from nothing.
                   */
                  initial={{
                    rotateX: direction >= 0 ? 97 : -97,
                    opacity: 0,
                    scale: 0.982,
                  }}
                  animate={{
                    rotateX: 0,
                    opacity: 1,
                    scale: 1,
                    transition: {
                      rotateX: {
                        type: "spring",
                        stiffness: 60,
                        damping: 16,
                        mass: 1.7,
                      },
                      opacity: {
                        duration: 0.07,
                        ease: "linear",
                      },
                      scale: {
                        type: "spring",
                        stiffness: 82,
                        damping: 22,
                        mass: 1.1,
                      },
                    },
                  }}
                  /*
                   * EXIT - the page peels off and flips over the bar.
                   *
                   * EXIT_EASE [0.32, 0, 0.72, 0.18]:
                   *   - Starts relatively slow (inertia of paper at rest)
                   *   - Accelerates through mid-flight
                   *   - Slight ease-out at the very end (dampened by air)
                   * This curve is the single biggest realism improvement
                   * vs a linear or standard ease-in-out.
                   *
                   * opacity goes to 0.04 (not 0) so the very last trace of
                   * the page is visible above the bar - exactly like a
                   * physical calendar page disappearing over the binding.
                   */
                  exit={{
                    rotateX: direction >= 0 ? -86 : 86,
                    opacity: 0.04,
                    scale: 0.988,
                    transition: {
                      duration: 0.41,
                      ease: EXIT_EASE,
                    },
                  }}
                  onAnimationStart={() => setIsFlipping(true)}
                  onAnimationComplete={() => {
                    /* Only clear flipping state on the enter-complete,
                       not on exit-complete (AnimatePresence fires both). */
                    if (!isFlippingRef.current) setIsFlipping(false);
                  }}
                >
                  {/*
                   * Inner surface shadow:
                   * A real page has slight darkening near the binding edge
                   * (the paper bends slightly where it's punched / coiled).
                   * This is a purely additive detail - it never moves.
                   */}
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 z-20 h-6"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0.055) 0%, transparent 100%)",
                    }}
                    aria-hidden
                  />

                  <HeroScene
                    monthLabel={visibleMonth
                      .toLocaleString("en-US", { month: "long" })
                      .toUpperCase()}
                    year={visibleMonth.getFullYear()}
                    animateKey={`${visibleMonth.getFullYear()}-${visibleMonth.getMonth()}`}
                    theme={monthTheme}
                  />

                  <div className="bg-white">
                    <CalendarBody
                      days={days}
                      today={today}
                      rangeStart={rangeStart}
                      rangeEnd={rangeEnd}
                      previewEnd={previewEnd}
                      accent={monthTheme.accent}
                      accentStrong={monthTheme.accentStrong}
                      accentSoft={monthTheme.accentSoft}
                      todayRing={monthTheme.ring}
                      holidays={holidays}
                      monthKey={monthKey}
                      monthNote={monthNote}
                      rangeNote={rangeNote}
                      selectedRangeLabel={selectedRangeLabel}
                      importantDate={importantDate}
                      importantDateLabel={importantDateLabel}
                      selectionMode={selectionMode}
                      onSelectDay={handleSelectDay}
                      onHoverDay={handleHoverDay}
                      onSelectionModeChange={setSelectionMode}
                      onClearImportantDate={() => {
                        const next = { ...importantDates };
                        delete next[monthKey];
                        persistImportantDates(next);
                        setSelectionMode("range");
                      }}
                      onMonthNoteChange={(value) =>
                        persistMonthNotes({ ...monthNotes, [monthKey]: value })
                      }
                      onRangeNoteChange={(value) =>
                        persistRangeNotes({
                          ...rangeNotes,
                          [selectedRangeKey]: value,
                        })
                      }
                      onResetNotes={() => {
                        persistMonthNotes({ ...monthNotes, [monthKey]: "" });
                        persistRangeNotes({
                          ...rangeNotes,
                          [selectedRangeKey]: "",
                        });
                      }}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
