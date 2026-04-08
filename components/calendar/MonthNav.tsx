type MonthNavProps = {
  onPrev: () => void;
  onNext: () => void;
};

export function MonthNav({
  onPrev,
  onNext
}: MonthNavProps) {
  return (
    <div className="pointer-events-none absolute inset-x-3 top-3 z-20 flex items-center justify-between print:hidden md:inset-x-4 md:top-4">
      <button
        type="button"
        className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-white/80 text-sm text-slate-700 shadow-sm backdrop-blur transition hover:scale-105 hover:bg-white"
        aria-label="Previous month"
        onClick={onPrev}
      >
        {"<"}
      </button>
      <button
        type="button"
        className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-white/80 text-sm text-slate-700 shadow-sm backdrop-blur transition hover:scale-105 hover:bg-white"
        aria-label="Next month"
        onClick={onNext}
      >
        {">"}
      </button>
    </div>
  );
}
