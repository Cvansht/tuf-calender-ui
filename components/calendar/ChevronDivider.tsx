type ChevronDividerProps = {
  accent: string;
};

export function ChevronDivider({ accent }: ChevronDividerProps) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-[92px] md:h-[140px]"
      style={{
        background: accent,
        clipPath: "polygon(0 0, 40% 0, 50% 74%, 60% 0, 100% 0, 100% 100%, 0 100%)"
      }}
    />
  );
}
