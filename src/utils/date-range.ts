// Kept in sync with RangeSelector's lowercase literals so the two are
// structurally interchangeable without an adapter.

import { addDays, format } from "date-fns";
import type { RateRangeType } from "@/types/data.types";

const DAYS_BY_RANGE: Record<RateRangeType, number> = {
  "1d": 1, // most providers publish once per business day — 1D shows a single point
  "1w": 7,
  "1m": 30,
  "3m": 90,
  "1y": 365,
  "5y": 365 * 5,
};

function toISODate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function getDateRangeFromPeriod(range: RateRangeType): {
  from: string;
  to: string;
} {
  const to = new Date();
  const from = addDays(to, -DAYS_BY_RANGE[range]);

  return { from: toISODate(from), to: toISODate(to) };
}
