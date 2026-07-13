"use client";

import { TICKER_BASE_CURRENCY, TICKER_QUOTE_CURRENCIES } from "@/constants";
import { useCurrencies } from "@/hooks/use-currencies";
import { useRate } from "@/hooks/use-rate";
import { useRateChart } from "@/hooks/use-rate-chart";
import { useTicker } from "@/hooks/use-ticker";
import { useConverterStore } from "@/store/converter-store";

/**
 * Tracks every SWR request behind the first fully-rendered paint:
 * currencies list, live markets ticker, the active pair's rate, and its
 * default-range rate history chart (the History tab, shown by default).
 * Reuses the exact hooks/keys the real components call, so SWR dedupes
 * these requests instead of firing them twice.
 */
export function useAppReadiness(): boolean {
  const fromCurrency = useConverterStore((state) => state.fromCurrency);
  const toCurrency = useConverterStore((state) => state.toCurrency);

  const { isLoading: isCurrenciesLoading } = useCurrencies();
  const { isLoading: isTickerLoading } = useTicker(
    TICKER_BASE_CURRENCY,
    TICKER_QUOTE_CURRENCIES,
  );
  const { isLoading: isRateLoading } = useRate(fromCurrency, toCurrency);
  const { isLoading: isChartLoading } = useRateChart(fromCurrency, toCurrency);

  return (
    !isCurrenciesLoading &&
    !isTickerLoading &&
    !isRateLoading &&
    !isChartLoading
  );
}
