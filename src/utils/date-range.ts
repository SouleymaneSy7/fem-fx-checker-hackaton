import { addDays, format } from "date-fns";
import { DAYS_BY_RANGE } from "@/constants";
import type { RateRangeType } from "@/types";

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
