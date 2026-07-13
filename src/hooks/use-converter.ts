"use client";

import * as React from "react";

import { DEBOUNCE_DEFAULT_MS } from "@/constants";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useFavoriteMutations } from "@/hooks/use-favorite-mutations";
import { useLogMutations } from "@/hooks/use-log-mutations";
import { useRate } from "@/hooks/use-rate";
import { useConverterStore } from "@/store/converter-store";
import { useFavoritesStore } from "@/store/favorites-store";
import { useLogStore } from "@/store/log-store";

export function useConverter() {
  // Converter
  const amount = useConverterStore((state) => state.amount);
  const fromCurrency = useConverterStore((state) => state.fromCurrency);
  const toCurrency = useConverterStore((state) => state.toCurrency);
  const setAmount = useConverterStore((state) => state.setAmount);
  const setFromCurrency = useConverterStore((state) => state.setFromCurrency);
  const setToCurrency = useConverterStore((state) => state.setToCurrency);
  const swapCurrencies = useConverterStore((state) => state.swapCurrencies);

  // Single-pair shortcut — cheaper than fetching the whole rates array for
  // one quote.
  const { rate, isLoading, error } = useRate(fromCurrency, toCurrency);

  const debouncedAmount = useDebouncedValue(amount, DEBOUNCE_DEFAULT_MS);

  const convertedAmount = React.useMemo(() => {
    if (rate === undefined) return null;

    return debouncedAmount * rate;
  }, [debouncedAmount, rate]);

  // Favorite
  const favorites = useFavoritesStore((state) => state.favorites);
  const {
    pinPair,
    unpinPair,
    isPending: isFavoritePending,
  } = useFavoriteMutations();

  const pairId = `${fromCurrency}-${toCurrency}`;
  const isPinned = favorites.some((pair) => pair.id === pairId);
  const isFavoriteSyncing = isFavoritePending(pairId);

  function toggleFavorite() {
    const existing = favorites.find((pair) => pair.id === pairId);

    if (existing) {
      unpinPair(existing.id);
    } else {
      pinPair(fromCurrency, toCurrency);
    }
  }

  // Log
  const logEntries = useLogStore((state) => state.entries);
  const { addLogEntry, removeLogEntriesForPair, isAddPending } =
    useLogMutations();

  // Logged status is pair-based, not amount-based — mirrors the favorite
  // pin/unpin logic: a pair is either logged or it isn't.
  const isLogged = logEntries.some(
    (entry) =>
      entry.fromCurrency === fromCurrency && entry.toCurrency === toCurrency,
  );
  const isLogSyncing = isAddPending(fromCurrency, toCurrency);

  async function toggleLog() {
    if (isLogged) {
      removeLogEntriesForPair(fromCurrency, toCurrency);
      return;
    }

    if (rate === undefined || convertedAmount === null) return;

    await addLogEntry({
      fromCurrency,
      toCurrency,
      sendAmount: amount,
      receiveAmount: convertedAmount,
      rate,
    });
  }

  return {
    amount,
    fromCurrency,
    toCurrency,
    rate,
    convertedAmount,
    isLoading,
    error,
    isPinned,
    isFavoriteSyncing,
    isLogged,
    isLogSyncing,
    setAmount,
    setFromCurrency,
    setToCurrency,
    swapCurrencies,
    toggleFavorite,
    toggleLog,
  };
}
