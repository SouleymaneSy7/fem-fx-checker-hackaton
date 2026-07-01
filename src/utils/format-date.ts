import { differenceInHours, differenceInMinutes, format } from "date-fns";
import type { RateRangeType } from "@/components/features/markets/range-selector";

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
