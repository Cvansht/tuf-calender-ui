import { DayCell } from "./DayCell";
import type { CalendarDay, Holiday, RangeState } from "./types";
import { toIsoDate } from "./utils/date";

type CalendarGridProps = {
  days: CalendarDay[];
  today: Date;
  rangeStart: string | null;
  rangeEnd: string | null;
  previewEnd: string | null;
  accent: string;
  accentStrong: string;
  accentSoft: string;
  todayRing: string;
  importantDate: string | null;
  holidays: Holiday[];
  onSelectDay: (iso: string) => void;
  onHoverDay: (iso: string) => void;
};

const getHolidayMap = (holidays: Holiday[]) =>
  Object.fromEntries(holidays.map((holiday) => [holiday.date, holiday.label]));

const getEffectiveEnd = (
  rangeStart: string | null,
  rangeEnd: string | null,
  previewEnd: string | null
) => {
  if (rangeEnd) {
    return rangeEnd;
  }

  if (rangeStart && previewEnd) {
    return previewEnd;
  }

  return null;
};

const getRangeState = (
  iso: string,
  rangeStart: string | null,
  rangeEnd: string | null,
  previewEnd: string | null
): RangeState => {
  if (!rangeStart) {
    return "none";
  }

  if (iso === rangeStart) {
    return "start";
  }

  const effectiveEnd = getEffectiveEnd(rangeStart, rangeEnd, previewEnd);

  if (!effectiveEnd) {
    return "none";
  }

  if (iso === effectiveEnd) {
    return rangeEnd ? "end" : "preview";
  }

  const low = rangeStart < effectiveEnd ? rangeStart : effectiveEnd;
  const high = rangeStart < effectiveEnd ? effectiveEnd : rangeStart;

  if (iso > low && iso < high) {
    return rangeEnd ? "in-range" : "preview";
  }

  return "none";
};

export function CalendarGrid({
  days,
  today,
  rangeStart,
  rangeEnd,
  previewEnd,
  accent,
  accentStrong,
  accentSoft,
  todayRing,
  importantDate,
  holidays,
  onSelectDay,
  onHoverDay
}: CalendarGridProps) {
  const todayIso = toIsoDate(today);
  const holidayMap = getHolidayMap(holidays);
  const labels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  return (
    <div className="px-4 pt-3 pb-4 md:px-7 md:pt-4 md:pb-5">
      <div className="mb-2 grid grid-cols-7 gap-x-1">
        {labels.map((label, index) => (
          <div
            key={`${label}-${index}`}
            className={`text-center text-[8px] font-semibold uppercase tracking-[0.02em] md:text-[10px] ${
              index >= 5 ? "text-sky-600" : "text-slate-500"
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1 md:gap-y-1.5">
        {days.map((day) => (
          <DayCell
            key={day.iso}
            iso={day.iso}
            dayNumber={day.dayNumber}
            isCurrentMonth={day.isCurrentMonth}
            isToday={day.iso === todayIso}
            isWeekend={[0, 6].includes(day.date.getDay())}
            rangeState={getRangeState(day.iso, rangeStart, rangeEnd, previewEnd)}
            accent={accent}
            accentStrong={accentStrong}
            accentSoft={accentSoft}
            todayRing={todayRing}
            isImportant={day.iso === importantDate}
            holidayLabel={holidayMap[day.iso]}
            onClick={() => onSelectDay(day.iso)}
            onHover={() => onHoverDay(day.iso)}
          />
        ))}
      </div>
    </div>
  );
}
