"use client";

import type { WheelEvent } from "react";
import { useMemo, useRef, useState } from "react";
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
  const wheelLockRef = useRef(false);
  const dragY = useMotionValue(0);
  const dragRotate = useTransform(dragY, [-180, 0, 180], [7, 0, -7]);
  const dragLift = useTransform(dragY, [-180, 0, 180], [6, 0, -3]);
  const dragScale = useTransform(dragY, [-180, 0, 180], [0.996, 1, 0.998]);

  const monthTheme = useMemo(
    () => getMonthTheme(visibleMonth.getMonth()),
    [visibleMonth]
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
  const selectedRangeDates =
    rangeStart && (rangeEnd || previewEnd)
      ? {
          startLabel: formatNoteDate(rangeStart),
          endLabel: formatNoteDate(rangeEnd ?? previewEnd ?? rangeStart)
        }
      : rangeStart
        ? {
            startLabel: formatNoteDate(rangeStart),
            endLabel: null
          }
        : null;
  const importantDateLabel = importantDate ? formatNoteDate(importantDate) : null;
  const pageBackground = useMemo(
    () =>
      [
        "radial-gradient(circle at 18% 14%, rgba(255,255,255,0.92), transparent 24%)",
        `radial-gradient(circle at 84% 10%, ${toRgba(
          monthTheme.accentSoft,
          0.92
        )}, transparent 28%)`,
        `linear-gradient(180deg, #f7f3ec 0%, ${toRgba(
          monthTheme.accentSoft,
          0.82
        )} 56%, ${toRgba(monthTheme.rightAccent, 0.18)} 100%)`
      ].join(", "),
    [monthTheme]
  );
  const pageGlow = useMemo(
    () =>
      `radial-gradient(circle at 76% 18%, ${toRgba(
        monthTheme.accent,
        0.2
      )} 0%, ${toRgba(monthTheme.leftAccent, 0.11)} 36%, transparent 70%)`,
    [monthTheme]
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

  const ensureRangeNoteSeeded = (startIso: string, endIso: string) => {
    const start = startIso < endIso ? startIso : endIso;
    const end = startIso < endIso ? endIso : startIso;
    const key = `${start}_${end}`;

    setRangeNotes((previous) => {
      if (previous[key] !== undefined) {
        return previous;
      }

      const next = {
        ...previous,
        [key]: `Selected range\nStart: ${formatNoteDate(start)}\nEnd: ${formatNoteDate(
          end
        )}\n\nNotes:\n`
      };

      window.localStorage.setItem(rangeStorageKey, JSON.stringify(next));
      return next;
    });
  };

  const transitionMonth = (nextMonth: Date, nextDirection: number) => {
    setDirection(nextDirection);
    setVisibleMonth(nextMonth);
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
      ensureRangeNoteSeeded(iso, rangeStart);
      return;
    }

    if (iso === rangeStart) {
      setRangeEnd(iso);
      ensureRangeNoteSeeded(iso, iso);
      return;
    }

    setRangeEnd(iso);
    ensureRangeNoteSeeded(rangeStart, iso);
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
    if (info.offset.y <= -70) {
      flipToNextMonth();
      dragY.set(0);
      return;
    }

    if (info.offset.y >= 70) {
      flipToPreviousMonth();
    }

    dragY.set(0);
  };

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (wheelLockRef.current) {
      return;
    }

    if (Math.abs(event.deltaY) < 20) {
      return;
    }

    wheelLockRef.current = true;

    if (event.deltaY > 0) {
      flipToNextMonth();
    } else {
      flipToPreviousMonth();
    }

    window.setTimeout(() => {
      wheelLockRef.current = false;
    }, 720);
  };

  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden print:hidden">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={`page-${monthTheme.id}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
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
            dragElastic={0.18}
            dragMomentum={false}
            dragTransition={{ bounceStiffness: 220, bounceDamping: 22 }}
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
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={`${visibleMonth.getFullYear()}-${visibleMonth.getMonth()}`}
                  custom={direction}
                  style={{ transformStyle: "preserve-3d" }}
                  initial={{
                    rotateX: direction >= 0 ? 86 : -86,
                    opacity: 0.26,
                    y: direction >= 0 ? -22 : 22,
                    scale: 0.985,
                    transformPerspective: 1800,
                    filter: "blur(1.5px)"
                  }}
                  animate={{
                    rotateX: 0,
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: "blur(0px)",
                    transition: {
                      rotateX: {
                        type: "spring",
                        stiffness: 118,
                        damping: 19,
                        mass: 1.28
                      },
                      y: {
                        type: "spring",
                        stiffness: 124,
                        damping: 18,
                        mass: 1.15
                      },
                      scale: {
                        type: "spring",
                        stiffness: 130,
                        damping: 20,
                        mass: 1.04
                      },
                      opacity: { duration: 0.82, ease: [0.22, 1, 0.36, 1] },
                      filter: { duration: 0.78, ease: "easeOut" }
                    }
                  }}
                  exit={{
                    rotateX: direction >= 0 ? -82 : 82,
                    opacity: 0.08,
                    y: direction >= 0 ? 24 : -24,
                    scale: 0.985,
                    filter: "blur(1px)",
                    transition: {
                      duration: 0.72,
                      ease: [0.4, 0, 0.2, 1]
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
                      selectedRangeDates={selectedRangeDates}
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
