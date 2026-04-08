import type { MonthTheme } from "../types";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
] as const;

const baseHeroImage = "/calendar-cover-photo.svg";

export const monthThemes: MonthTheme[] = [
  {
    id: "january",
    monthIndex: 0,
    monthLabel: monthNames[0],
    accent: "#2ea4e7",
    accentStrong: "#167cc0",
    accentSoft: "#d8eefb",
    ring: "#f2b650",
    leftAccent: "#2ea4e7",
    rightAccent: "#2ea4e7",
    heroImage: baseHeroImage,
    heroPosition: "center top",
    heroFilter: "brightness(1.13) saturate(1.03)",
    heroOverlay:
      "linear-gradient(180deg, rgba(255,255,255,0.26), rgba(207,227,244,0.12) 42%, rgba(32,104,160,0.08) 100%)",
    heroScrim:
      "radial-gradient(circle at 34% 14%, rgba(255,255,255,0.58), transparent 34%)",
    miniMap: "linear-gradient(135deg,#edf6ff,#8ec8f3 52%,#167cc0)",
    layers: [],
    decorations: [{ type: "snow", count: 14, opacity: 0.64 }]
  },
  {
    id: "february",
    monthIndex: 1,
    monthLabel: monthNames[1],
    accent: "#5b7cfa",
    accentStrong: "#3056d3",
    accentSoft: "#dee6ff",
    ring: "#f2b650",
    leftAccent: "#5b7cfa",
    rightAccent: "#4b65da",
    heroImage: baseHeroImage,
    heroPosition: "center 20%",
    heroFilter: "brightness(1.12) saturate(1.04)",
    heroOverlay:
      "linear-gradient(180deg, rgba(246,247,255,0.26), rgba(161,180,255,0.14) 50%, rgba(47,76,150,0.1) 100%)",
    heroScrim:
      "radial-gradient(circle at 58% 16%, rgba(255,255,255,0.42), transparent 28%)",
    miniMap: "linear-gradient(135deg,#eef2ff,#8ea2ff 52%,#3056d3)",
    layers: [],
    decorations: [{ type: "snow", count: 10, opacity: 0.56 }, { type: "stars", count: 6, opacity: 0.46 }]
  },
  {
    id: "march",
    monthIndex: 2,
    monthLabel: monthNames[2],
    accent: "#2bb3a3",
    accentStrong: "#138473",
    accentSoft: "#d7f5ef",
    ring: "#f2b650",
    leftAccent: "#39b8a5",
    rightAccent: "#1b9a89",
    heroImage: baseHeroImage,
    heroPosition: "center 24%",
    heroFilter: "brightness(1.15) saturate(1.1)",
    heroOverlay:
      "linear-gradient(180deg, rgba(245,255,249,0.24), rgba(153,237,208,0.12) 45%, rgba(39,130,100,0.07) 100%)",
    heroScrim:
      "radial-gradient(circle at 28% 18%, rgba(255,249,208,0.5), transparent 24%)",
    miniMap: "linear-gradient(135deg,#effdf7,#91ead8 52%,#138473)",
    layers: [],
    decorations: [{ type: "orb", style: { top: "14%", left: "12%", background: "#fff4bf" } }]
  },
  {
    id: "april",
    monthIndex: 3,
    monthLabel: monthNames[3],
    accent: "#3f8fc2",
    accentStrong: "#245f87",
    accentSoft: "#d8edf9",
    ring: "#f2b650",
    leftAccent: "#68aeda",
    rightAccent: "#3f8fc2",
    heroImage: baseHeroImage,
    heroPosition: "center 26%",
    heroFilter: "brightness(1.12) saturate(1.06)",
    heroOverlay:
      "linear-gradient(180deg, rgba(250,252,255,0.2), rgba(173,205,227,0.16) 48%, rgba(61,109,149,0.08) 100%)",
    heroScrim:
      "radial-gradient(circle at 64% 18%, rgba(255,247,214,0.26), transparent 28%)",
    miniMap: "linear-gradient(135deg,#f3f9fc,#90c1e2 52%,#245f87)",
    layers: [],
    decorations: [{ type: "rain", count: 10, opacity: 0.18 }, { type: "mist", opacity: 0.12 }]
  },
  {
    id: "may",
    monthIndex: 4,
    monthLabel: monthNames[4],
    accent: "#58a93d",
    accentStrong: "#33751f",
    accentSoft: "#e3f4d7",
    ring: "#f2b650",
    leftAccent: "#7ec55f",
    rightAccent: "#58a93d",
    heroImage: baseHeroImage,
    heroPosition: "center 24%",
    heroFilter: "brightness(1.17) saturate(1.12)",
    heroOverlay:
      "linear-gradient(180deg, rgba(249,255,243,0.22), rgba(173,231,146,0.12) 45%, rgba(75,147,52,0.06) 100%)",
    heroScrim:
      "radial-gradient(circle at 26% 18%, rgba(255,247,198,0.5), transparent 25%)",
    miniMap: "linear-gradient(135deg,#f3ffe9,#a7e17a 52%,#33751f)",
    layers: [],
    decorations: [{ type: "orb", style: { top: "16%", left: "14%", background: "#fff7cb" } }]
  },
  {
    id: "june",
    monthIndex: 5,
    monthLabel: monthNames[5],
    accent: "#1ea5d9",
    accentStrong: "#0f6f98",
    accentSoft: "#d9f3fe",
    ring: "#f2b650",
    leftAccent: "#49c0ef",
    rightAccent: "#1ea5d9",
    heroImage: baseHeroImage,
    heroPosition: "center 22%",
    heroFilter: "brightness(1.18) saturate(1.12)",
    heroOverlay:
      "linear-gradient(180deg, rgba(244,253,255,0.2), rgba(146,227,255,0.12) 44%, rgba(32,132,176,0.06) 100%)",
    heroScrim:
      "radial-gradient(circle at 76% 15%, rgba(255,246,198,0.52), transparent 24%)",
    miniMap: "linear-gradient(135deg,#effcff,#8adfff 52%,#0f6f98)",
    layers: [],
    decorations: [{ type: "orb", style: { top: "12%", right: "12%", background: "#fff0ad" } }]
  },
  {
    id: "july",
    monthIndex: 6,
    monthLabel: monthNames[6],
    accent: "#ef7f44",
    accentStrong: "#c55117",
    accentSoft: "#fde4d7",
    ring: "#f2b650",
    leftAccent: "#f59a62",
    rightAccent: "#ef7f44",
    heroImage: baseHeroImage,
    heroPosition: "center 21%",
    heroFilter: "brightness(1.2) saturate(1.15)",
    heroOverlay:
      "linear-gradient(180deg, rgba(255,249,241,0.16), rgba(255,193,133,0.14) 42%, rgba(193,102,44,0.08) 100%)",
    heroScrim:
      "radial-gradient(circle at 76% 16%, rgba(255,232,160,0.52), transparent 22%)",
    miniMap: "linear-gradient(135deg,#fff3eb,#ffb37a 52%,#c55117)",
    layers: [],
    decorations: [{ type: "orb", style: { top: "14%", right: "14%", background: "#ffe8a6" } }]
  },
  {
    id: "august",
    monthIndex: 7,
    monthLabel: monthNames[7],
    accent: "#d69328",
    accentStrong: "#a96b08",
    accentSoft: "#f8ebcb",
    ring: "#f2b650",
    leftAccent: "#ebb44f",
    rightAccent: "#d69328",
    heroImage: baseHeroImage,
    heroPosition: "center 18%",
    heroFilter: "brightness(1.2) saturate(1.13)",
    heroOverlay:
      "linear-gradient(180deg, rgba(255,250,233,0.18), rgba(247,202,105,0.15) 45%, rgba(176,119,25,0.08) 100%)",
    heroScrim:
      "radial-gradient(circle at 72% 18%, rgba(255,231,168,0.5), transparent 23%)",
    miniMap: "linear-gradient(135deg,#fff8df,#f2c86a 52%,#a96b08)",
    layers: [],
    decorations: [{ type: "mist", opacity: 0.11 }]
  },
  {
    id: "september",
    monthIndex: 8,
    monthLabel: monthNames[8],
    accent: "#c97b42",
    accentStrong: "#964d16",
    accentSoft: "#f5dfd0",
    ring: "#f2b650",
    leftAccent: "#db9560",
    rightAccent: "#c97b42",
    heroImage: baseHeroImage,
    heroPosition: "center 20%",
    heroFilter: "brightness(1.17) saturate(1.11)",
    heroOverlay:
      "linear-gradient(180deg, rgba(255,248,240,0.18), rgba(236,168,120,0.13) 46%, rgba(167,92,46,0.07) 100%)",
    heroScrim:
      "radial-gradient(circle at 28% 18%, rgba(255,235,180,0.42), transparent 24%)",
    miniMap: "linear-gradient(135deg,#fff2e9,#e6aa80 52%,#964d16)",
    layers: [],
    decorations: [{ type: "mist", opacity: 0.11 }]
  },
  {
    id: "october",
    monthIndex: 9,
    monthLabel: monthNames[9],
    accent: "#9d64d5",
    accentStrong: "#6d34ad",
    accentSoft: "#ecdffb",
    ring: "#f2b650",
    leftAccent: "#b081e3",
    rightAccent: "#8b5bc2",
    heroImage: baseHeroImage,
    heroPosition: "center 24%",
    heroFilter: "brightness(1.14) saturate(1.1)",
    heroOverlay:
      "linear-gradient(180deg, rgba(250,247,255,0.18), rgba(194,151,238,0.14) 44%, rgba(122,86,178,0.08) 100%)",
    heroScrim:
      "radial-gradient(circle at 70% 17%, rgba(255,234,188,0.26), transparent 20%)",
    miniMap: "linear-gradient(135deg,#f7f3ff,#c29df2 52%,#6d34ad)",
    layers: [],
    decorations: [{ type: "stars", count: 7, opacity: 0.34 }, { type: "mist", opacity: 0.1 }]
  },
  {
    id: "november",
    monthIndex: 10,
    monthLabel: monthNames[10],
    accent: "#708095",
    accentStrong: "#475569",
    accentSoft: "#e1e8ef",
    ring: "#f2b650",
    leftAccent: "#8a98ab",
    rightAccent: "#708095",
    heroImage: baseHeroImage,
    heroPosition: "center 24%",
    heroFilter: "brightness(1.12) saturate(1.02)",
    heroOverlay:
      "linear-gradient(180deg, rgba(250,252,255,0.18), rgba(188,198,209,0.15) 46%, rgba(99,118,137,0.08) 100%)",
    heroScrim:
      "radial-gradient(circle at 32% 15%, rgba(255,249,228,0.22), transparent 25%)",
    miniMap: "linear-gradient(135deg,#f8fafc,#b5c0ce 52%,#475569)",
    layers: [],
    decorations: [{ type: "rain", count: 6, opacity: 0.14 }, { type: "mist", opacity: 0.12 }]
  },
  {
    id: "december",
    monthIndex: 11,
    monthLabel: monthNames[11],
    accent: "#275fdf",
    accentStrong: "#1741b2",
    accentSoft: "#dce7ff",
    ring: "#f2b650",
    leftAccent: "#4d7cf2",
    rightAccent: "#275fdf",
    heroImage: baseHeroImage,
    heroPosition: "center 18%",
    heroFilter: "brightness(1.13) saturate(1.06)",
    heroOverlay:
      "linear-gradient(180deg, rgba(244,248,255,0.24), rgba(158,190,255,0.14) 44%, rgba(38,74,162,0.09) 100%)",
    heroScrim:
      "radial-gradient(circle at 38% 13%, rgba(255,255,255,0.5), transparent 28%)",
    miniMap: "linear-gradient(135deg,#eff5ff,#8eacff 52%,#1741b2)",
    layers: [],
    decorations: [{ type: "snow", count: 16, opacity: 0.62 }, { type: "stars", count: 5, opacity: 0.4 }]
  }
];

export const getMonthTheme = (monthIndex: number) =>
  monthThemes[monthIndex] ?? monthThemes[0];
