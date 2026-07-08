"use client";

import * as React from "react";
import useSWR from "swr";
import { SWR_STALE_5M } from "@/constants";
import { fetchLatestRates, fetchRateHistory } from "@/services/rates.service";
import { useFavoritesStore } from "@/store/favorites-store";
import type { FavoriteRowType } from "@/types/data.types";
import { getDateRangeFromPeriod } from "@/utils/date-range";

export function useFavorites() {
  const favorites = useFavoritesStore((state) => state.favorites);
  const unpinPair = useFavoritesStore((state) => state.unpinPair);

  // Group pinned pairs by base currency so pairs sharing a base ride a
  // single batched request instead of one call per pair.
  const groups = React.useMemo(() => {
    const map = new Map<string, string[]>();

    for (const pair of favorites) {
      const quotes = map.get(pair.fromCurrency) ?? [];
      if (!quotes.includes(pair.toCurrency)) quotes.push(pair.toCurrency);
      map.set(pair.fromCurrency, quotes);
    }

    return Array.from(map.entries());
  }, [favorites]);

  const swrKey =
    groups.length > 0
      ? [
          "favorites-rates",
          groups
            .map(([base, quotes]) => `${base}:${quotes.join(",")}`)
            .join("|"),
        ]
      : null;

  // A single SWR key fans out into one Promise.all per base — keeps this
  // hook to one call regardless of how many pairs are pinned, and avoids
  // calling hooks inside a loop (which the Rules of Hooks forbid).
  const { data, isLoading, error } = useSWR(
    swrKey,
    async () => {
      const { from, to } = getDateRangeFromPeriod("1w");

      return Promise.all(
        groups.map(async ([base, quotes]) => {
          const [latest, history] = await Promise.all([
            fetchLatestRates(base, quotes),
            fetchRateHistory(base, quotes, from, to),
          ]);
          return { base, latest, history };
        }),
      );
    },
    { dedupingInterval: SWR_STALE_5M },
  );

  const rows = React.useMemo<FavoriteRowType[]>(() => {
    return favorites.map((pair) => {
      const group = data?.find((entry) => entry.base === pair.fromCurrency);

      const latestRow = group?.latest.find(
        (row) => row.quote === pair.toCurrency,
      );

      const historyRows =
        group?.history.filter((row) => row.quote === pair.toCurrency) ?? [];

      const sortedDates = Array.from(
        new Set(historyRows.map((row) => row.date)),
      ).sort();

      const previousDate = sortedDates[sortedDates.length - 2];

      const previousRate = historyRows.find(
        (row) => row.date === previousDate,
      )?.rate;

      const rate = latestRow?.rate;

      const changePercent =
        rate !== undefined && previousRate
          ? ((rate - previousRate) / previousRate) * 100
          : undefined;

      return { ...pair, rate, changePercent };
    });
  }, [data, favorites]);

  return { rows, unpinPair, isLoading, error };
}
