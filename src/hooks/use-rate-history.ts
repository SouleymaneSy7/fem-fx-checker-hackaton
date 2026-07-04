"use client";

import useSWR from "swr";

import { fetchRateHistory } from "@/services/rates.service";
import type { RateRangeType } from "@/types/data.types";
import { getDateRangeFromPeriod } from "@/utils/date-range";

export function useRateHistory(
  base: string,
  quotes: string[],
  range: RateRangeType,
) {
  const { from, to } = getDateRangeFromPeriod(range);
  const quotesKey = quotes.join(",");
  const key =
    base && quotesKey ? ["rate-history", base, quotesKey, range] : null;

  const { data, error, isLoading } = useSWR(key, () =>
    fetchRateHistory(base, quotes, from, to),
  );

  return { rates: data, isLoading, error };
}
