import { monthThemes } from "./data/themes";

type MonthMiniMapProps = {
  currentMonth: number;
  onSelectMonth: (monthIndex: number) => void;
};

export function MonthMiniMap({
  currentMonth,
  onSelectMonth
}: MonthMiniMapProps) {
  return (
    <div className="hidden flex-wrap items-center justify-center gap-1.5 px-3 pt-3 pb-2 md:flex md:px-6 print:hidden">
      {monthThemes.map((theme) => {
        const active = currentMonth === theme.monthIndex;
        return (
          <button
            key={theme.id}
            type="button"
            aria-label={`Jump to ${theme.monthLabel}`}
            className="group flex items-center gap-2 rounded-full px-1 py-1"
            onClick={() => onSelectMonth(theme.monthIndex)}
          >
            <span
              className="h-3.5 w-7 rounded-full border border-white/50 shadow-sm transition group-hover:scale-105"
              style={{ background: theme.miniMap }}
            />
            {active && (
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                {theme.monthLabel.slice(0, 3)}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
