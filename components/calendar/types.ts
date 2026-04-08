import type { CSSProperties } from "react";

export type ThemeId =
  | "january"
  | "february"
  | "march"
  | "april"
  | "may"
  | "june"
  | "july"
  | "august"
  | "september"
  | "october"
  | "november"
  | "december";

export type SceneDecoration =
  | {
      type: "orb";
      className?: string;
      style?: CSSProperties;
    }
  | {
      type: "stars";
      count: number;
      opacity?: number;
    }
  | {
      type: "snow";
      count: number;
      opacity?: number;
    }
  | {
      type: "rain";
      count: number;
      opacity?: number;
    }
  | {
      type: "mist";
      opacity?: number;
    };

export type SceneLayerData = {
  id: string;
  className?: string;
  style: CSSProperties;
};

export type MonthTheme = {
  id: ThemeId;
  monthIndex: number;
  monthLabel: string;
  accent: string;
  accentStrong: string;
  accentSoft: string;
  ring: string;
  heroImage: string;
  heroPosition: string;
  heroFilter: string;
  heroOverlay: string;
  heroScrim?: string;
  leftAccent: string;
  rightAccent: string;
  miniMap: string;
  layers: SceneLayerData[];
  decorations?: SceneDecoration[];
};

export type CalendarDay = {
  iso: string;
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
};

export type Holiday = {
  date: string;
  label: string;
};

export type RangeState = "none" | "start" | "end" | "in-range" | "preview";

export type SelectionMode = "range" | "important";
