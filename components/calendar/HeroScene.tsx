import { motion } from "motion/react";

import { HeroDecorations } from "./HeroDecorations";
import type { MonthTheme } from "./types";

type HeroSceneProps = {
  monthLabel: string;
  year: number;
  animateKey: string;
  theme: MonthTheme;
};

const getMonthScaleClass = (monthLabel: string) => {
  if (monthLabel.length >= 9) {
    return "text-[1.28rem] md:text-[2.1rem]";
  }

  if (monthLabel.length >= 8) {
    return "text-[1.4rem] md:text-[2.34rem]";
  }

  return "text-[1.58rem] md:text-[2.7rem]";
};

export function HeroScene({
  monthLabel,
  year,
  animateKey,
  theme
}: HeroSceneProps) {
  return (
    <div className="relative h-[258px] bg-white md:h-[384px] print:hidden">
      <div
        key={animateKey}
        className="absolute inset-0 overflow-hidden rounded-t-[22px]"
        style={{
          clipPath:
            "polygon(0 0, 100% 0, 100% 84%, 81% 84%, 61% 100%, 33% 84%, 0 84%)"
        }}
      >
        <motion.div
          className="absolute inset-0 scale-[1.02]"
          style={{
            backgroundImage: `url('${theme.heroImage}')`,
            backgroundSize: "cover",
            backgroundPosition: theme.heroPosition,
            filter: theme.heroFilter
          }}
          animate={{ scale: [1.02, 1.06, 1.02], x: [0, -8, 0], y: [0, -5, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0"
          style={{ background: theme.heroOverlay }}
          animate={{ opacity: [0.9, 1, 0.92] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        {theme.heroScrim ? (
          <motion.div
            className="absolute inset-0"
            style={{ background: theme.heroScrim }}
            animate={{ scale: [1, 1.02, 1], opacity: [0.92, 1, 0.94] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02)_42%,rgba(15,23,42,0.04)_100%)]" />
        <HeroDecorations decorations={theme.decorations} />

        <motion.div
          aria-hidden="true"
          className="absolute left-0 bottom-0 z-10 h-[94px] w-[24%] md:h-[132px]"
          style={{
            background: theme.leftAccent,
            clipPath: "polygon(0 46%, 100% 100%, 0 100%)"
          }}
          animate={{ y: [0, 1.5, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          aria-hidden="true"
          className="absolute right-0 bottom-0 z-10 h-[148px] w-[48%] md:h-[210px]"
          style={{
            background: theme.rightAccent,
            clipPath: "polygon(0 100%, 100% 21%, 100% 100%)"
          }}
          animate={{ y: [0, 2, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute right-[7%] bottom-[20%] z-20 flex max-w-[168px] flex-col items-end text-right text-white md:right-[8%] md:bottom-[18%] md:max-w-[245px]"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[0.96rem] leading-none tracking-[0.03em] text-white/95 drop-shadow-[0_1px_3px_rgba(0,0,0,0.28)] md:text-[1.46rem]">
            {year}
          </p>
          <h2
            className={`mt-1 whitespace-nowrap leading-none font-bold uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)] ${getMonthScaleClass(
              monthLabel
            )}`}
          >
            {monthLabel}
          </h2>
        </motion.div>
      </div>
    </div>
  );
}
