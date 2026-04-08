"use client";

import type { WheelEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform
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
const DRAG_FLIP_THRESHOLD = 118;
const WHEEL_FLIP_THRESHOLD = 95;
const FLIP_LOCK_MS = 1150;

const getStoredRecord = (key: string) => {
  if (typeof window === "undefined") {
    return {};
  }

  const value = window.localStorage.getItem(key);
  return value ? (JSON.parse(value) as Record<string, string>) : {};
};

const formatNoteDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

const toRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace("#", "");
  const safe =
    normalized.length === 3
      ? normalized
          .split("")
          .map((part) => `${part}${part}`)
          .join("")
      : normalized;

  const value = Number.parseInt(safe, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

export function WallCalendar() {
  const today = useMemo(() => new Date(), []);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(2022, 0, 1));
  const [backgroundMonth, setBackgroundMonth] = useState(() => new Date(2022, 0, 1));
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
  const isFlippingRef = useRef(false);
  const flipUnlockTimeoutRef = useRef<number | null>(null);
  const wheelAccumulatorRef = useRef(0);
  const wheelDirectionRef = useRef<1 | -1 | 0>(0);
  const wheelResetTimeoutRef = useRef<number | null>(null);
  const dragY = useMotionValue(0);
  const dragRotate = useTransform(dragY, [-140, 0, 140], [4.5, 0, -4.5]);
  const dragLift = useTransform(dragY, [-140, 0, 140], [3, 0, -2]);
  const dragScale = useTransform(dragY, [-140, 0, 140], [0.998, 1, 0.999]);

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
        `radial-gradient(circle at 84% 10%, ${toRgba(
          backgroundTheme.accentSoft,
          0.92
        )}, transparent 28%)`,
        `linear-gradient(180deg, #f7f3ec 0%, ${toRgba(
          backgroundTheme.accentSoft,
          0.82
        )} 56%, ${toRgba(backgroundTheme.rightAccent, 0.18)} 100%)`
      ].join(", "),
    [backgroundTheme]
  );
  const pageGlow = useMemo(
    () =>
      `radial-gradient(circle at 76% 18%, ${toRgba(
        backgroundTheme.accent,
        0.2
      )} 0%, ${toRgba(backgroundTheme.leftAccent, 0.11)} 36%, transparent 70%)`,
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
      if (flipUnlockTimeoutRef.current) {
        window.clearTimeout(flipUnlockTimeoutRef.current);
      }

      if (wheelResetTimeoutRef.current) {
        window.clearTimeout(wheelResetTimeoutRef.current);
      }
    };
  }, []);

  const unlockFlip = () => {
    isFlippingRef.current = false;

    if (flipUnlockTimeoutRef.current) {
      window.clearTimeout(flipUnlockTimeoutRef.current);
      flipUnlockTimeoutRef.current = null;
    }
  };

  const transitionMonth = (nextMonth: Date, nextDirection: number) => {
    if (isFlippingRef.current) {
      return;
    }

    isFlippingRef.current = true;
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
      const nextImportantDates = { ...importantDates };

      if (importantDate === iso) {
        delete nextImportantDates[monthKey];
      } else {
        nextImportantDates[monthKey] = iso;
      }

      persistImportantDates(nextImportantDates);
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

    if (iso === rangeStart) {
      setRangeEnd(iso);
      return;
    }

    setRangeEnd(iso);
  };

  const handleHoverDay = (iso: string) => {
    if (selectionMode === "range" && rangeStart && !rangeEnd) {
      setPreviewEnd(iso);
    }
  };

  const flipToNextMonth = () => {
    transitionMonth(
      new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1),
      1
    );
  };

  const flipToPreviousMonth = () => {
    transitionMonth(
      new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1),
      -1
    );
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { y: number } }
  ) => {
    if (info.offset.y <= -DRAG_FLIP_THRESHOLD) {
      flipToNextMonth();
      dragY.set(0);
      return;
    }

    if (info.offset.y >= DRAG_FLIP_THRESHOLD) {
      flipToPreviousMonth();
    }

    dragY.set(0);
  };

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (isFlippingRef.current) {
      return;
    }

    if (Math.abs(event.deltaY) < 20) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const wheelDirection = event.deltaY > 0 ? 1 : -1;

    if (wheelDirectionRef.current !== 0 && wheelDirectionRef.current !== wheelDirection) {
      wheelAccumulatorRef.current = 0;
    }

    wheelDirectionRef.current = wheelDirection;
    wheelAccumulatorRef.current += Math.abs(event.deltaY);

    if (wheelResetTimeoutRef.current) {
      window.clearTimeout(wheelResetTimeoutRef.current);
    }

    wheelResetTimeoutRef.current = window.setTimeout(() => {
      wheelAccumulatorRef.current = 0;
      wheelDirectionRef.current = 0;
    }, 180);

    if (wheelAccumulatorRef.current < WHEEL_FLIP_THRESHOLD) {
      return;
    }

    wheelAccumulatorRef.current = 0;
    wheelDirectionRef.current = 0;

    if (wheelDirection > 0) {
      flipToNextMonth();
    } else {
      flipToPreviousMonth();
    }
  };

  return (
    <>
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

      <section className="relative z-10 mx-auto grid w-full max-w-[540px] gap-2 md:max-w-[600px] print:max-w-none">
        <div className="rounded-[24px] bg-[linear-gradient(180deg,#fffdfa_0%,#f8f4eb_100%)] p-2 shadow-[0_18px_50px_rgba(18,33,58,0.14)] md:p-3 print:bg-white print:p-0 print:shadow-none">
          <SpiralRings />

          <motion.div
            className="overflow-hidden rounded-[20px] border border-slate-200/70 bg-[#fffdf8] print:rounded-none print:border-0"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.1}
            dragMomentum={false}
            dragTransition={{ bounceStiffness: 180, bounceDamping: 20 }}
            whileTap={{ cursor: "grabbing", scale: 0.998 }}
            onDrag={(_, info) => dragY.set(info.offset.y)}
            onDragEnd={handleDragEnd}
            onWheel={handleWheel}
            style={{
              touchAction: "none",
              y: dragLift,
              rotateX: dragRotate,
              scale: dragScale
            }}
          >
            <div className="relative overflow-hidden bg-white [perspective:1800px]">
              <AnimatePresence
                initial={false}
                custom={direction}
                mode="wait"
                onExitComplete={() => {
                  setBackgroundMonth(visibleMonth);
                }}
              >
                <motion.div
                  key={`${visibleMonth.getFullYear()}-${visibleMonth.getMonth()}`}
                  custom={direction}
                  style={{ transformStyle: "preserve-3d" }}
                  initial={{
                    rotateX: direction >= 0 ? 78 : -78,
                    opacity: 0.42,
                    y: direction >= 0 ? -16 : 16,
                    scale: 0.992,
                    transformPerspective: 1800
                  }}
                  animate={{
                    rotateX: 0,
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      rotateX: {
                        type: "spring",
                        stiffness: 88,
                        damping: 18,
                        mass: 1.18
                      },
                      y: {
                        type: "spring",
                        stiffness: 96,
                        damping: 17,
                        mass: 1.06
                      },
                      scale: {
                        type: "spring",
                        stiffness: 100,
                        damping: 19,
                        mass: 1
                      },
                      opacity: { duration: 0.56, ease: [0.22, 1, 0.36, 1] }
                    }
                  }}
                  exit={{
                    rotateX: direction >= 0 ? -72 : 72,
                    opacity: 0.14,
                    y: direction >= 0 ? 14 : -14,
                    scale: 0.992,
                    transition: {
                      duration: 0.5,
                      ease: [0.32, 0, 0.2, 1]
                    }
                  }}
                  className="origin-top will-change-transform"
                >
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
                        const nextImportantDates = { ...importantDates };
                        delete nextImportantDates[monthKey];
                        persistImportantDates(nextImportantDates);
                        setSelectionMode("range");
                      }}
                      onMonthNoteChange={(value) =>
                        persistMonthNotes({
                          ...monthNotes,
                          [monthKey]: value
                        })
                      }
                      onRangeNoteChange={(value) =>
                        persistRangeNotes({
                          ...rangeNotes,
                          [selectedRangeKey]: value
                        })
                      }
                      onResetNotes={() => {
                        persistMonthNotes({
                          ...monthNotes,
                          [monthKey]: ""
                        });
                        persistRangeNotes({
                          ...rangeNotes,
                          [selectedRangeKey]: ""
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
