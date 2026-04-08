import type { Holiday } from "../types";

export const holidaysByMonth: Record<number, Holiday[]> = {
  0: [{ date: "2026-01-01", label: "New Year's Day" }],
  1: [{ date: "2026-02-14", label: "Valentine's Day" }],
  2: [{ date: "2026-03-17", label: "St. Patrick's Day" }],
  4: [{ date: "2026-05-25", label: "Memorial Day Weekend" }],
  6: [{ date: "2026-07-04", label: "Independence Day" }],
  9: [{ date: "2026-10-31", label: "Halloween" }],
  10: [{ date: "2026-11-26", label: "Thanksgiving" }],
  11: [{ date: "2026-12-25", label: "Christmas Day" }]
};
