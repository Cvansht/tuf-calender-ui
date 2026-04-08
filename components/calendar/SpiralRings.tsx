type SpiralRingsProps = {
  count?: number;
};

export function SpiralRings({ count = 31 }: SpiralRingsProps) {
  return (
    <div className="relative pb-1 print:hidden">
      <div className="pointer-events-none absolute left-1/2 top-0 h-4 w-5 -translate-x-1/2 rounded-full bg-black/12 blur-[3px]" />

      <div className="relative mx-auto mb-1 h-7 w-[min(98%,560px)]">
        <span className="absolute left-1/2 top-0 h-3 w-[3px] -translate-x-1/2 rounded-full bg-slate-700 shadow-[0_1px_0_rgba(255,255,255,0.45)]" />
        <span className="absolute left-1/2 top-[9px] h-3 w-[3px] -translate-x-1/2 rounded-full bg-slate-700 shadow-[0_1px_0_rgba(255,255,255,0.35)]" />

        <div className="absolute inset-x-[4.5%] top-3 h-[2px] rounded-full bg-slate-700 shadow-[0_1px_0_rgba(255,255,255,0.45)]" />
        <div className="absolute inset-x-[5%] top-[13px] h-[1px] rounded-full bg-slate-900/15 blur-[0.8px]" />

        <span className="absolute left-[6%] top-[9px] h-[6px] w-[6px] rounded-full border-2 border-slate-700 bg-white shadow-[0_1px_0_rgba(255,255,255,0.45)]" />
        <span className="absolute right-[6%] top-[9px] h-[6px] w-[6px] rounded-full border-2 border-slate-700 bg-white shadow-[0_1px_0_rgba(255,255,255,0.45)]" />

        <span className="absolute left-1/2 top-[1px] h-5 w-8 -translate-x-1/2 rounded-t-full border-[3px] border-b-0 border-slate-700 shadow-[0_1px_0_rgba(255,255,255,0.35)]" />
      </div>

      <div className="relative mx-auto h-6 w-[min(100%,570px)] overflow-hidden">
        <div className="absolute inset-x-1 top-0 h-2 rounded-[999px] bg-[linear-gradient(180deg,rgba(0,0,0,0.14),transparent)] blur-[2px]" />
        <div className="absolute inset-x-1 top-[15px] h-[4px] rounded-[999px] bg-[linear-gradient(180deg,rgba(15,23,42,0.08),transparent)] blur-[2px]" />

        <div className="relative flex justify-between px-1">
          {Array.from({ length: count }, (_, index) => {
            const isCenter = Math.abs(index - (count - 1) / 2) <= 1;
            const rotation = index % 2 === 0 ? -3 : 2;
            const offset = index % 3 === 0 ? 0 : index % 3 === 1 ? 0.4 : -0.2;

            return (
              <div
                key={index}
                className="relative flex h-6 w-[11px] items-start justify-center"
                style={{ transform: `translateY(${offset}px) rotate(${rotation}deg)` }}
              >
                <span className="absolute top-0 h-[17px] w-[6px] rounded-full border-[1.8px] border-slate-800 bg-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]" />
                <span className="absolute top-[1px] h-[14px] w-[2px] rounded-full bg-white/70 blur-[0.35px]" />
                <span
                  className={`absolute top-[1px] h-[15px] w-[1px] bg-slate-900/55 ${
                    isCenter ? "opacity-80" : "opacity-45"
                  }`}
                />
                <span className="absolute top-[16px] h-[2px] w-[5px] rounded-full bg-slate-900/12 blur-[0.4px]" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
