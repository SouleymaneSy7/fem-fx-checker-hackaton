"use client";

import * as React from "react";

import type { TickerEntryType } from "@/types";
import { useLatestRates } from "./use-latest-rates";
import { useRateHistory } from "./use-rate-history";

export function useTicker(base: string, quotes: string[]) {
  const {
    rates,
    isLoading: isLoadingLatest,
    error: latestError,
  } = useLatestRates(base, quotes);

  // "1w" guarantees a previous business day to compare against, even
  // across weekends or public holidays.
  const {
    rates: history,
    isLoading: isLoadingHistory,
    error: historyError,
  } = useRateHistory(base, quotes, "1w");

  const entries = React.useMemo<TickerEntryType[]>(() => {
    if (!rates) return [];

    const dates = history
      ? Array.from(new Set(history.map((row) => row.date))).sort()
      : [];
    const previousDate = dates[dates.length - 2]; // last entry before today

    const previousRates = previousDate
      ? Object.fromEntries(
          (history ?? [])
            .filter((row) => row.date === previousDate)
            .map((row) => [row.quote, row.rate]),
        )
      : undefined;

    return quotes.map((currency) => {
      const rate = rates[currency];
      const previousRate = previousRates?.[currency];

      if (rate === undefined) {
        return { currency, rate: 0, change: null };
      }

      const change =
        previousRate !== undefined
          ? {
              absolute: rate - previousRate,
              percentage: ((rate - previousRate) / previousRate) * 100,
            }
          : null;

      return { currency, rate, change };
    });
  }, [rates, history, quotes]);

  return {
    entries,
    isLoading: isLoadingLatest || isLoadingHistory,
    error: latestError ?? historyError,
  };
}
