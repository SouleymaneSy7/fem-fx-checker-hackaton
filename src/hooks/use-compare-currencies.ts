"use client";

import { useCompareCurrenciesStore } from "@/store";

export function useCompareCurrencies() {
  const currencies = useCompareCurrenciesStore((state) => state.currencies);
  const addCurrency = useCompareCurrenciesStore((state) => state.addCurrency);
  const removeCurrency = useCompareCurrenciesStore(
    (state) => state.removeCurrency,
  );

  return { currencies, addCurrency, removeCurrency };
}
