import type { RateRangeType } from "@/types";

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

// Keyed by KeyboardEvent.key (the character produced: "1".."6"), not
// .code — see constants/shortcut-registry.ts. This is what makes the
// shortcut reachable on layouts like AZERTY, where typing a digit
// requires Shift and would never satisfy a code-based, implicit
// no-Shift match.
export const RANGE_BY_KEY: Record<string, (typeof RANGE_KEYS)[number]> = {
  "1": "1d",
  "2": "1w",
  "3": "1m",
  "4": "3m",
  "5": "1y",
  "6": "5y",
};

export const RANGES: {
  value: RateRangeType;
  label: string;
  shortcut: string;
}[] = [
  { value: "1d", label: "1d", shortcut: "1" },
  { value: "1w", label: "1w", shortcut: "2" },
  { value: "1m", label: "1m", shortcut: "3" },
  { value: "3m", label: "3m", shortcut: "4" },
  { value: "1y", label: "1y", shortcut: "5" },
  { value: "5y", label: "5y", shortcut: "6" },
];
