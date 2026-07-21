"use client";

import { MAX_CHART_CURRENCIES } from "@/constants";
import { useCompareChartCurrenciesStore } from "@/store/compare-chart-currencies-store";

export function useCompareChartCurrencies() {
  const currencies = useCompareChartCurrenciesStore(
    (state) => state.currencies,
  );
  const addCurrency = useCompareChartCurrenciesStore(
    (state) => state.addCurrency,
  );
  const removeCurrency = useCompareChartCurrenciesStore(
    (state) => state.removeCurrency,
  );

  const isFull = currencies.length >= MAX_CHART_CURRENCIES;

  return { currencies, addCurrency, removeCurrency, isFull };
}
