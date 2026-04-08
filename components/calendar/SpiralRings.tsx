import { useMemo } from "react";

const TARNISH_VARIANTS = [
  { hi: "#daeaf6", mid: "#a8bece", shadow: "#364452" },
  { hi: "#d2e2ee", mid: "#9eb8ca", shadow: "#303e4c" },
  { hi: "#ccd8e6", mid: "#96b0c0", shadow: "#2c3a48" },
  { hi: "#e0eaf2", mid: "#b0c4d0", shadow: "#3c4c58" },
  { hi: "#c8d8e8", mid: "#92aaba", shadow: "#28363e" },
];

function CoilRing({ index}) {
  const id = `cr${index}`;
  const tarnish = TARNISH_VARIANTS[index % TARNISH_VARIANTS.length];

  const tilt = (((index * 7 + 3) % 9) - 4) * 0.22;
  const dy = (((index * 13 + 1) % 5) - 2) * 0.28;
  const r = 5.9 + ((index * 3) % 4) * 0.12;
  const wireW = 2.3 + ((index * 5) % 3) * 0.08;

  const fcId = `fc${id}`;
  const bcId = `bc${id}`;
  const mgId = `mg${id}`;
  const bgId = `bg${id}`;

  return (
    <div
      style={{
        position: "relative",
        flexShrink: 0,
        width: 12,
        transform: `translateY(${dy}px) rotate(${tilt}deg)`,
      }}
    >
      <svg
        viewBox="0 0 14 28"
        width={12}
        height={24}
        style={{ display: "block", overflow: "visible" }}
      >
        <defs>
          <linearGradient id={mgId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2e3b46" />
            <stop offset="12%" stopColor="#5c7080" />
            <stop offset="30%" stopColor="#8caabb" />
            <stop offset="46%" stopColor={tarnish.hi} />
            <stop offset="58%" stopColor={tarnish.mid} />
            <stop offset="74%" stopColor="#607282" />
            <stop offset="88%" stopColor="#3e4e5c" />
            <stop offset="100%" stopColor="#232e38" />
          </linearGradient>
          <linearGradient id={bgId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1a2530" />
            <stop offset="40%" stopColor="#2e3e4a" />
            <stop offset="60%" stopColor="#384855" />
            <stop offset="100%" stopColor="#1a2530" />
          </linearGradient>
          <clipPath id={fcId}>
            <rect x="-3" y="-3" width="20" height="19.2" />
          </clipPath>
          <clipPath id={bcId}>
            <rect x="-3" y="16.1" width="20" height="16" />
          </clipPath>
        </defs>

        {/* Ambient shadow halo around ring */}
        <circle
          cx="7"
          cy="16"
          r={r + 2.5}
          fill="none"
          stroke="rgba(0,0,0,0.14)"
          strokeWidth="3"
        />

        {/* Back arc */}
        <circle
          cx="7"
          cy="16"
          r={r}
          fill="none"
          stroke={`url(#${bgId})`}
          strokeWidth={wireW}
          clipPath={`url(#${bcId})`}
        />
        {/* Back arc inner gleam */}
        <circle
          cx="7"
          cy="16"
          r={r - wireW * 0.35}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.5"
          clipPath={`url(#${bcId})`}
        />

        {/* Paper hole punch shadow */}
        <ellipse cx="7" cy="16" rx="4.2" ry="2.6" fill="rgba(0,0,0,0.22)" />

        {/* Paper hole inner dark */}
        <ellipse cx="7" cy="16" rx="3.4" ry="2.0" fill="rgba(5,10,15,0.6)" />
        <ellipse cx="7" cy="16.2" rx="2.6" ry="1.4" fill="rgba(0,0,0,0.78)" />

        {/* Tiny paper fiber highlight along top edge of hole */}
        <ellipse
          cx="7"
          cy="15.5"
          rx="3.2"
          ry="0.75"
          fill="none"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="0.55"
        />
        {/* Tiny paper fiber along bottom edge */}
        <ellipse
          cx="7"
          cy="16.6"
          rx="2.8"
          ry="0.65"
          fill="none"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth="0.4"
        />

        {/* Front arc — main metallic stroke */}
        <circle
          cx="7"
          cy="16"
          r={r}
          fill="none"
          stroke={`url(#${mgId})`}
          strokeWidth={wireW}
          clipPath={`url(#${fcId})`}
        />

        {/* Front arc — specular inner highlight (top of cylinder) */}
        <circle
          cx="7"
          cy="16"
          r={r - wireW * 0.38}
          fill="none"
          stroke="rgba(255,255,255,0.52)"
          strokeWidth="0.65"
          clipPath={`url(#${fcId})`}
        />

        {/* Front arc — outer edge darkening */}
        <circle
          cx="7"
          cy="16"
          r={r + wireW * 0.38}
          fill="none"
          stroke="rgba(0,0,0,0.25)"
          strokeWidth="0.55"
          clipPath={`url(#${fcId})`}
        />

        {/* Wire-entry indentation marks where wire enters paper */}
        <ellipse
          cx={7 - r - 0.2}
          cy="16"
          rx="1.1"
          ry="1.9"
          fill="rgba(0,0,0,0.22)"
        />
        <ellipse
          cx={7 + r + 0.2}
          cy="16"
          rx="1.1"
          ry="1.9"
          fill="rgba(0,0,0,0.22)"
        />

        {/* Cast shadow on paper surface */}
        <ellipse
          cx="7"
          cy="17.2"
          rx={r + 0.8}
          ry="1.3"
          fill="rgba(0,0,0,0.09)"
        />
      </svg>
    </div>
  );
}

function MountingHook() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        position: "relative",
        marginBottom: 1,
      }}
    >
      <svg
        viewBox="0 0 88 52"
        width={88}
        height={52}
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient
            id="hook-wing"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#60737e" />
            <stop offset="35%" stopColor="#a8bcc8" />
            <stop offset="55%" stopColor="#c8d8e4" />
            <stop offset="80%" stopColor="#8899a8" />
            <stop offset="100%" stopColor="#404e58" />
          </linearGradient>
          <linearGradient
            id="hook-stem"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#3a4852" />
            <stop offset="25%" stopColor="#8aa0ae" />
            <stop offset="50%" stopColor="#c0d0da" />
            <stop offset="75%" stopColor="#7890a0" />
            <stop offset="100%" stopColor="#303e48" />
          </linearGradient>
          <linearGradient id="hook-screw" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b0c4ce" />
            <stop offset="50%" stopColor="#6a7e8a" />
            <stop offset="100%" stopColor="#38484e" />
          </linearGradient>
          <filter id="hookblur">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        {/* Hook shadow on bar below */}
        <ellipse
          cx="44"
          cy="50"
          rx="18"
          ry="2.5"
          fill="rgba(0,0,0,0.18)"
          filter="url(#hookblur)"
        />

        {/* Left wing */}
        <path
          d="M 44 10 L 17 40 L 23 40 L 44 16 Z"
          fill="url(#hook-wing)"
          stroke="#202c34"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
        {/* Left wing inner edge shine */}
        <path
          d="M 44 12 L 20 40"
          fill="none"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="0.8"
        />

        {/* Right wing */}
        <path
          d="M 44 10 L 71 40 L 65 40 L 44 16 Z"
          fill="url(#hook-wing)"
          stroke="#202c34"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
        {/* Right wing inner edge shine */}
        <path
          d="M 44 12 L 68 40"
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="0.8"
        />

        {/* Center vertical stem */}
        <rect
          x="40.5"
          y="12"
          width="7"
          height="28"
          fill="url(#hook-stem)"
          stroke="#1c2830"
          strokeWidth="0.5"
          rx="1"
        />
        {/* Stem specular line */}
        <rect
          x="42"
          y="13"
          width="1.5"
          height="26"
          fill="rgba(255,255,255,0.18)"
          rx="0.7"
        />

        {/* Nail tip — triangular point */}
        <path
          d="M 40.5 12 L 44 3 L 47.5 12 Z"
          fill="url(#hook-stem)"
          stroke="#1c2830"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
        {/* Nail tip specular */}
        <path
          d="M 42.5 4.5 L 44 3 L 45.5 5.5"
          fill="none"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="0.7"
          strokeLinecap="round"
        />

        {/* Center junction cap */}
        <ellipse
          cx="44"
          cy="40"
          rx="5.5"
          ry="4.5"
          fill="url(#hook-screw)"
          stroke="#1c2830"
          strokeWidth="0.5"
        />
        <ellipse
          cx="44"
          cy="40"
          rx="3"
          ry="2.5"
          fill="rgba(0,0,0,0.35)"
        />
        <line
          x1="41.5"
          y1="40"
          x2="46.5"
          y2="40"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="0.6"
        />
        <line
          x1="44"
          y1="37.5"
          x2="44"
          y2="42.5"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="0.6"
        />

        {/* Left screw/rivet */}
        <circle
          cx="20"
          cy="40"
          r="4.5"
          fill="url(#hook-screw)"
          stroke="#1c2830"
          strokeWidth="0.5"
        />
        <circle cx="20" cy="40" r="2.5" fill="rgba(0,0,0,0.38)" />
        <line
          x1="17.5"
          y1="40"
          x2="22.5"
          y2="40"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="0.65"
        />
        <line
          x1="20"
          y1="37.5"
          x2="20"
          y2="42.5"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="0.65"
        />
        {/* Left screw edge glint */}
        <path
          d="M 17 37.5 A 4.5 4.5 0 0 1 22 37"
          fill="none"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="0.7"
        />

        {/* Right screw/rivet */}
        <circle
          cx="68"
          cy="40"
          r="4.5"
          fill="url(#hook-screw)"
          stroke="#1c2830"
          strokeWidth="0.5"
        />
        <circle cx="68" cy="40" r="2.5" fill="rgba(0,0,0,0.38)" />
        <line
          x1="65.5"
          y1="40"
          x2="70.5"
          y2="40"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="0.65"
        />
        <line
          x1="68"
          y1="37.5"
          x2="68"
          y2="42.5"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="0.65"
        />
        {/* Right screw edge glint */}
        <path
          d="M 65 37.5 A 4.5 4.5 0 0 1 70 37"
          fill="none"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="0.7"
        />
      </svg>
    </div>
  );
}

export function SpiralRings({ count = 28 }) {
  const rings = useMemo(
    () => Array.from({ length: count }, (_, i) => i),
    [count]
  );

  return (
    <div style={{ position: "relative", paddingBottom: 8, userSelect: "none" }}>
      {/* Global drop shadow cast onto calendar page below */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "4%",
          right: "4%",
          height: 14,
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(0,0,0,0.20) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* Mounting hook */}
      <MountingHook />

      {/* Horizontal wire rod */}
      <div
        style={{
          position: "relative",
          margin: "0 auto 1px",
          width: "min(98%, 560px)",
          height: 9,
        }}
      >
        {/* Rod surface shadow */}
        <div
          style={{
            position: "absolute",
            left: "3.5%",
            right: "3.5%",
            top: 7,
            height: 4,
            background: "rgba(0,0,0,0.14)",
            borderRadius: 3,
            filter: "blur(2px)",
          }}
        />
        {/* Rod body */}
        <div
          style={{
            position: "absolute",
            left: "4%",
            right: "4%",
            top: 2,
            height: 5,
            background:
              "linear-gradient(180deg, #c0d2de 0%, #96acba 30%, #607080 62%, #8ca0b0 85%, #b8ccd8 100%)",
            borderRadius: 3,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.42)",
          }}
        />
        {/* Rod specular highlight line */}
        <div
          style={{
            position: "absolute",
            left: "4.5%",
            right: "4.5%",
            top: 2.5,
            height: 1.5,
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.55) 15%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.55) 85%, transparent)",
            borderRadius: 1,
          }}
        />
        {/* Left end cap */}
        <div
          style={{
            position: "absolute",
            left: "3.2%",
            top: 0,
            width: 9,
            height: 9,
            background:
              "radial-gradient(circle at 38% 35%, #d0e2ec 0%, #7a8e9c 55%, #3a4c58 100%)",
            borderRadius: "50%",
            border: "0.5px solid #202c34",
          }}
        />
        {/* Right end cap */}
        <div
          style={{
            position: "absolute",
            right: "3.2%",
            top: 0,
            width: 9,
            height: 9,
            background:
              "radial-gradient(circle at 38% 35%, #d0e2ec 0%, #7a8e9c 55%, #3a4c58 100%)",
            borderRadius: "50%",
            border: "0.5px solid #202c34",
          }}
        />
      </div>

      {/* Rings row */}
      <div
        style={{
          position: "relative",
          margin: "0 auto",
          width: "min(100%, 570px)",
          overflow: "hidden",
          height: 26,
        }}
      >
        {/* Top shadow band */}
        <div
          style={{
            position: "absolute",
            inset: "0 6px",
            top: 0,
            height: 5,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.13), transparent)",
            filter: "blur(1.5px)",
            borderRadius: 4,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0 5px",
            height: "100%",
            alignItems: "flex-start",
          }}
        >
          {rings.map((i) => (
            <CoilRing key={i} index={i} />
          ))}
        </div>
      </div>

      {/* Paper top edge with punch holes visible below rings */}
      <div
        style={{
          position: "relative",
          margin: "0 auto",
          width: "min(98%, 562px)",
          height: 8,
          background: "linear-gradient(180deg, #ededea 0%, #e5e5e2 100%)",
          boxShadow: "inset 0 2px 3px rgba(0,0,0,0.07)",
        }}
      >
        {rings.map((i) => {
          const pct = (i / (count - 1)) * 90 + 5;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${pct}%`,
                top: 1,
                width: 7,
                height: 6,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 45% 40%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
                transform: "translateX(-50%)",
              }}
            />
          );
        })}
        {/* Paper top edge light strip */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1.5,
            background: "rgba(255,255,255,0.55)",
          }}
        />
      </div>
    </div>
  );
}