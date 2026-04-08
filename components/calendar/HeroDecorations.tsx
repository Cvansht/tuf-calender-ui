import { motion } from "motion/react";

import type { SceneDecoration } from "./types";

type HeroDecorationsProps = {
  decorations?: SceneDecoration[];
};

const buildOffsets = (
  count: number,
  xStep: number,
  yStep: number,
  xStart = 8,
  yStart = 10
) =>
  Array.from({ length: count }, (_, index) => ({
    left: `${(xStart + (index * xStep) % 84).toFixed(2)}%`,
    top: `${(yStart + (index * yStep) % 54).toFixed(2)}%`
  }));

export function HeroDecorations({ decorations }: HeroDecorationsProps) {
  if (!decorations?.length) {
    return null;
  }

  return (
    <>
      {decorations.map((decoration, decorationIndex) => {
        if (decoration.type === "orb") {
          return (
            <motion.span
              key={`orb-${decorationIndex}`}
              className={`absolute h-14 w-14 rounded-full blur-[1px] md:h-20 md:w-20 ${decoration.className ?? ""}`}
              style={{
                opacity: 0.78,
                ...decoration.style
              }}
              animate={{ scale: [1, 1.08, 1], x: [0, 6, 0], y: [0, -4, 0] }}
              transition={{
                duration: 8 + decorationIndex,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          );
        }

        if (decoration.type === "mist") {
          return (
            <motion.span
              key={`mist-${decorationIndex}`}
              className="absolute top-[8%] right-[6%] h-[22%] w-[42%] rounded-[999px] blur-3xl"
              style={{
                opacity: decoration.opacity ?? 0.18,
                background:
                  "radial-gradient(circle at center, rgba(255,248,214,0.95), rgba(255,255,255,0.28) 58%, rgba(255,255,255,0) 100%)"
              }}
              animate={{ scale: [1, 1.08, 1], x: [0, -10, 0], y: [0, 3, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />
          );
        }

        const points =
          decoration.type === "stars"
            ? buildOffsets(decoration.count, 13.3, 7.9, 10, 10)
            : decoration.type === "snow"
              ? buildOffsets(decoration.count, 9.1, 11.7, 6, 8)
              : buildOffsets(decoration.count, 10.6, 9.8, 7, 14);

        return points.map((point, pointIndex) => {
          if (decoration.type === "stars") {
            return (
              <motion.span
                key={`star-${decorationIndex}-${pointIndex}`}
                className="absolute h-1.5 w-1.5 rounded-full bg-white"
                style={{
                  ...point,
                  opacity: decoration.opacity ?? 0.72
                }}
                animate={{
                  opacity: [
                    (decoration.opacity ?? 0.72) * 0.45,
                    decoration.opacity ?? 0.72,
                    (decoration.opacity ?? 0.72) * 0.55
                  ],
                  scale: [1, 1.18, 1]
                }}
                transition={{
                  duration: 2.6 + (pointIndex % 4) * 0.55,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: pointIndex * 0.12
                }}
              />
            );
          }

          if (decoration.type === "snow") {
            return (
              <motion.span
                key={`snow-${decorationIndex}-${pointIndex}`}
                className="absolute h-1.5 w-1.5 rounded-full bg-white"
                style={{
                  ...point,
                  opacity: decoration.opacity ?? 0.82,
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.2)"
                }}
                animate={{
                  y: [0, 150 + (pointIndex % 5) * 16],
                  x: [0, pointIndex % 2 === 0 ? 12 : -12],
                  opacity: [0, decoration.opacity ?? 0.82, 0]
                }}
                transition={{
                  duration: 7 + (pointIndex % 5) * 0.65,
                  repeat: Infinity,
                  ease: "linear",
                  delay: pointIndex * 0.18
                }}
              />
            );
          }

          return (
            <motion.span
              key={`rain-${decorationIndex}-${pointIndex}`}
              className="absolute h-6 w-px -rotate-[28deg] rounded-full bg-white/70"
              style={{
                ...point,
                opacity: decoration.opacity ?? 0.32
              }}
              animate={{
                y: [-6, 92],
                x: [0, -14],
                opacity: [0, decoration.opacity ?? 0.32, 0]
              }}
              transition={{
                duration: 1.2 + (pointIndex % 4) * 0.16,
                repeat: Infinity,
                ease: "linear",
                delay: pointIndex * 0.08
              }}
            />
          );
        });
      })}
    </>
  );
}
