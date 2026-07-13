"use client";

import useSWR from "swr";
import { SWR_STALE_5M } from "@/constants";

import { useRate } from "@/hooks/use-rate";
import { fetchRate } from "@/services/rate.service";
import { useConverterStore } from "@/store/converter-store";
import type { HistoricalRatesResultType } from "@/types/data.types";

// `date` undefined means "no date picked yet" — the historical fetch stays
// idle (SWR key is null) until the user selects one, but the current rate
// still loads eagerly so it's ready the instant a date lands.
export function useHistoricalRates(date: string | undefined) {
  const amount = useConverterStore((state) => state.amount);
  const fromCurrency = useConverterStore((state) => state.fromCurrency);
  const toCurrency = useConverterStore((state) => state.toCurrency);

  // Reuses the same SWR cache key as the converter's own rate lookup — no
  // duplicate network call for "today's rate" just because this panel is
  // open at the same time.
  const {
    rate: currentRate,
    date: currentDate,
    isLoading: isCurrentLoading,
    error: currentError,
  } = useRate(fromCurrency, toCurrency);

  const historicalKey =
    date && fromCurrency && toCurrency
      ? ["historical-rates", fromCurrency, toCurrency, date]
      : null;

  const {
    data: historical,
    isLoading: isHistoricalLoading,
    error: historicalError,
  } = useSWR(historicalKey, () => fetchRate(fromCurrency, toCurrency, date), {
    dedupingInterval: SWR_STALE_5M,
  });

  // Frankfurter snaps weekends/holidays to the nearest earlier business
  // day, so `historical.date` may not equal the requested `date` — both
  // are kept so the panel can flag the difference to the user.
  const result: HistoricalRatesResultType | undefined =
    date && historical && currentRate !== undefined
      ? {
          requestedDate: date,
          historicalDate: historical.date,
          historicalRate: historical.rate,
          currentRate,
          currentDate: currentDate ?? "",
          historicalAmount: amount * historical.rate,
          currentAmount: amount * currentRate,
          absoluteChange: amount * currentRate - amount * historical.rate,
          percentChange:
            ((currentRate - historical.rate) / historical.rate) * 100,
        }
      : undefined;

  return {
    amount,
    fromCurrency,
    toCurrency,
    result,
    isLoading: isHistoricalLoading || (Boolean(date) && isCurrentLoading),
    error: historicalError ?? currentError,
  };
}
