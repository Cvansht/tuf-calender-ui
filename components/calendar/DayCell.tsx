import type { CSSProperties } from "react";
import { motion } from "motion/react";

import type { RangeState } from "./types";

type DayCellProps = {
  iso: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  rangeState: RangeState;
  accent: string;
  accentStrong: string;
  accentSoft: string;
  todayRing: string;
  isImportant: boolean;
  holidayLabel?: string;
  onClick: () => void;
  onHover: () => void;
};

export function DayCell({
  iso,
  dayNumber,
  isCurrentMonth,
  isToday,
  isWeekend,
  rangeState,
  accent,
  accentStrong,
  accentSoft,
  todayRing,
  isImportant,
  holidayLabel,
  onClick,
  onHover
}: DayCellProps) {
  const selected = rangeState === "start" || rangeState === "end";
  const edgeLabel =
    rangeState === "start"
      ? "Start"
      : rangeState === "end"
        ? "End"
        : null;

  const style: CSSProperties =
    rangeState === "start"
      ? {
          background: accent,
          borderRadius: "999px",
          boxShadow: `0 10px 20px ${accentSoft}`
        }
      : rangeState === "end"
        ? {
            background: accentStrong,
            borderRadius: "999px",
            boxShadow: `0 10px 20px ${accentSoft}`
          }
        : rangeState === "in-range" || rangeState === "preview"
          ? {
              background: accentSoft,
              borderRadius: rangeState === "preview" ? 999 : 12
            }
          : isImportant
            ? {
                boxShadow: `inset 0 0 0 2px ${accentStrong}, 0 8px 18px ${accentSoft}`
              }
            : isToday
              ? {
                  boxShadow: `inset 0 0 0 2px ${todayRing}`
                }
              : {};

  return (
    <motion.button
      type="button"
      className={[
        "group relative flex min-h-[42px] flex-col items-center justify-center rounded-full px-0 py-1 text-center transition duration-150 hover:z-10 md:min-h-[49px] md:px-0.5 md:py-1",
        !isCurrentMonth ? "text-slate-300" : "text-slate-900",
        selected ? "font-semibold text-white" : "",
        isWeekend && !selected ? "text-sky-600" : ""
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
      onClick={onClick}
      onMouseEnter={onHover}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.975 }}
      transition={{ type: "spring", stiffness: 280, damping: 18, mass: 0.6 }}
      aria-label={`${iso}${holidayLabel ? ` ${holidayLabel}` : ""}${
        isImportant ? " important date" : ""
      }`}
    >
      {edgeLabel && (
        <span className="mb-0.5 text-[7px] font-semibold uppercase tracking-[0.16em] text-white/85 md:text-[8px]">
          {edgeLabel}
        </span>
      )}

      <span className="text-[0.86rem] font-medium md:text-[0.98rem]">
        {dayNumber}
      </span>

      {isImportant && !selected && (
        <span
          className="absolute right-1.5 top-1.5 text-[10px] leading-none md:right-2 md:top-2"
          style={{ color: accentStrong }}
        >
          ★
        </span>
      )}

      {holidayLabel && (
        <>
          <span className="mt-0.5 h-1 w-1 rounded-full bg-rose-500" />
          <span className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 rounded-full bg-slate-900 px-2 py-1 text-[10px] text-white shadow-lg group-hover:block">
            {holidayLabel}
          </span>
        </>
      )}
    </motion.button>
  );
}
