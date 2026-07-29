import { differenceInHours, differenceInMinutes, format } from "date-fns";
import type { RateRangeType } from "@/types";

export const formatRelativeTime = (isoDate: string) => {
  const loggedDate = new Date(isoDate);
  const now = new Date();

  const diffMinutes = differenceInMinutes(now, loggedDate);

  if (diffMinutes < 1) return "now";
  if (diffMinutes < 60) return `${diffMinutes}m`;

  const diffHours = differenceInHours(now, loggedDate);
  if (diffHours < 24) return `${diffHours}h`;

  return format(loggedDate, "d MMM");
};

// Full date/time for tooltips — pairs with `formatRelativeTime`, which
// only shows the compact form ("20m", "1h", "13 May") in the log itself.
export const formatFullDateTime = (isoDate: string) => {
  return format(new Date(isoDate), "d MMM yyyy 'at' HH:mm");
};

// Full date with year — needed anywhere a date could be more than a year
// old (Time Machine spans 1999 to today), where `formatShortDate`'s
// "MMM dd" would be ambiguous about which year is meant.
export const formatFullDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return format(date, "MMM d, yyyy");
};

export const formatDateForRange = (isoDate: string, range: RateRangeType) => {
  const date = new Date(isoDate);

  if (range === "1d") {
    // Frankfurter only returns EOD rates (no real intraday timestamp), so
    // "16:00 CET" is the ECB's fixed daily reference-rate publication time —
    // not a value computed from the payload.
    return `${format(date, "MMM d")} 16:00 CET`;
  }

  if (range === "1y" || range === "5y") {
    return format(date, "MMM yy");
  }

  return `${format(date, "MMM d")} 16:00 CET`;
};

export const formatShortDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return format(date, "MMM dd");
};

export const formatChartDate = (isoDate: string, range: RateRangeType) => {
  const date = new Date(isoDate);

  if (range === "1d") {
    return format(date, "HH:mm");
  }

  if (range === "1y" || range === "5y") {
    return format(date, "MMM yy");
  }

  return formatShortDate(isoDate);
};
