import type { CalendarDay } from "../types";

export const weekdayLabels = ["M", "T", "W", "T", "F", "S", "S"];

export const toIsoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export const formatMonthHeading = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric"
  }).format(date);

export const formatRangeLabel = (startIso: string, endIso?: string | null) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  });

  const start = formatter.format(new Date(`${startIso}T00:00:00`));

  if (!endIso) {
    return start;
  }

  return `${start} - ${formatter.format(new Date(`${endIso}T00:00:00`))}`;
};

export const formatLongDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(new Date(`${iso}T00:00:00`));

export const addDays = (date: Date, amount: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
};

export const getStartOfMonthGrid = (date: Date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const offset = (start.getDay() + 6) % 7;
  return addDays(start, -offset);
};

export const buildMonthDays = (date: Date): CalendarDay[] => {
  const start = getStartOfMonthGrid(date);

  return Array.from({ length: 42 }, (_, index) => {
    const current = addDays(start, index);
    return {
      iso: toIsoDate(current),
      date: current,
      dayNumber: current.getDate(),
      isCurrentMonth: current.getMonth() === date.getMonth()
    };
  });
};

export const getInclusiveRangeDays = (
  startIso: string | null,
  endIso: string | null
) => {
  if (!startIso || !endIso) {
    return 0;
  }

  const start = new Date(`${startIso}T00:00:00`);
  const end = new Date(`${endIso}T00:00:00`);
  return Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
};

export const getYearOptions = (centerYear: number, radius = 4) =>
  Array.from({ length: radius * 2 + 1 }, (_, index) => centerYear - radius + index);
