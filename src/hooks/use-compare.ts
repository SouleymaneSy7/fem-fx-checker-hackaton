"use client";

import * as React from "react";

import { useConverterStore, useFavoritesStore } from "@/store";
import type { CompareRowType } from "@/types";
import { useFavoriteMutations } from "./use-favorite-mutations";
import { useLatestRates } from "./use-latest-rates";

export function useCompare(targetCurrencies: string[]) {
  const amount = useConverterStore((state) => state.amount);
  const baseCurrency = useConverterStore((state) => state.fromCurrency);

  const quotes = React.useMemo(
    () => targetCurrencies.filter((code) => code !== baseCurrency),
    [targetCurrencies, baseCurrency],
  );

  const { rates, isLoading, error } = useLatestRates(baseCurrency, quotes);

  const favorites = useFavoritesStore((state) => state.favorites);
  const { pinPair, unpinPair, isPending } = useFavoriteMutations();

  const rows = React.useMemo<CompareRowType[]>(() => {
    return quotes.map((currency) => {
      const rate = rates?.[currency];
      const pairId = `${baseCurrency}-${currency}`;

      return {
        currency,
        rate,
        convertedAmount: rate !== undefined ? amount * rate : undefined,
        isPinned: favorites.some((pair) => pair.id === pairId),
        isFavoriteSyncing: isPending(pairId),
      };
    });
  }, [rates, quotes, amount, baseCurrency, favorites, isPending]);

  function toggleFavorite(currency: string) {
    const pairId = `${baseCurrency}-${currency}`;
    const existing = favorites.find((pair) => pair.id === pairId);

    if (existing) {
      unpinPair(existing.id);
    } else {
      pinPair(baseCurrency, currency);
    }
  }

  return { amount, baseCurrency, rows, isLoading, error, toggleFavorite };
}
