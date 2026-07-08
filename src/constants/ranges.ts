import type { RateRangeType } from "@/types/data.types";

export const DAYS_BY_RANGE = {
  "1d": 1,
  "1w": 7,
  "1m": 30,
  "3m": 90,
  "1y": 365,
  "5y": 1825,
} as const;

export const RANGE_KEYS = ["1d", "1w", "1m", "3m", "1y", "5y"] as const;

export const DEFAULT_CHART_RANGE = "1m";

export const RANGE_BY_CODE: Record<string, (typeof RANGE_KEYS)[number]> = {
  Digit1: "1d",
  Digit2: "1w",
  Digit3: "1m",
  Digit4: "3m",
  Digit5: "1y",
  Digit6: "5y",
};

export const RANGES: {
  value: RateRangeType;
  label: string;
  shortcut: string;
}[] = [
  { value: "1d", label: "1d", shortcut: "Alt+1" },
  { value: "1w", label: "1w", shortcut: "Alt+2" },
  { value: "1m", label: "1m", shortcut: "Alt+3" },
  { value: "3m", label: "3m", shortcut: "Alt+4" },
  { value: "1y", label: "1y", shortcut: "Alt+5" },
  { value: "5y", label: "5y", shortcut: "Alt+6" },
];
