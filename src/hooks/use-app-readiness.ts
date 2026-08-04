"use client";

import { TICKER_BASE_CURRENCY, TICKER_QUOTE_CURRENCIES } from "@/constants";
import { useConverterStore, usePreferencesStore } from "@/store";
import { useCurrencies } from "./use-currencies";
import { useRate } from "./use-rate";
import { useRateChart } from "./use-rate-chart";
import { useTicker } from "./use-ticker";

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

  // Must match header.tsx's own resolution exactly — otherwise this
  // fires a differently-keyed SWR request instead of deduping with the
  // real ticker, and the splash screen could clear before (or never
  // exactly when) the visible ticker actually finishes loading.
  const tickerQuoteCurrencies = usePreferencesStore(
    (state) => state.tickerQuoteCurrencies,
  );
  const effectiveTickerCurrencies =
    tickerQuoteCurrencies ?? TICKER_QUOTE_CURRENCIES;

  const { isLoading: isCurrenciesLoading } = useCurrencies();
  const { isLoading: isTickerLoading } = useTicker(
    TICKER_BASE_CURRENCY,
    effectiveTickerCurrencies,
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
