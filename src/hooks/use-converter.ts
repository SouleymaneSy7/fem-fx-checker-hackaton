import * as React from "react";

import { DEBOUNCE_DEFAULT_MS } from "@/constants";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
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
  const pinPair = useFavoritesStore((state) => state.pinPair);
  const unpinPair = useFavoritesStore((state) => state.unpinPair);

  const pairId = `${fromCurrency}-${toCurrency}`;
  const isPinned = favorites.some((pair) => pair.id === pairId);

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
  const addEntry = useLogStore((state) => state.addEntry);
  const removeEntriesForPair = useLogStore(
    (state) => state.removeEntriesForPair,
  );

  // Logged status is pair-based, not amount-based — mirrors the favorite
  // pin/unpin logic: a pair is either logged or it isn't.
  const isLogged = logEntries.some(
    (entry) =>
      entry.fromCurrency === fromCurrency && entry.toCurrency === toCurrency,
  );

  function toggleLog() {
    if (isLogged) {
      removeEntriesForPair(fromCurrency, toCurrency);
      return;
    }

    if (rate === undefined || convertedAmount === null) return;

    addEntry({
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
    isLogged,
    setAmount,
    setFromCurrency,
    setToCurrency,
    swapCurrencies,
    toggleFavorite,
    toggleLog,
  };
}
