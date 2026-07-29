"use client";

import * as React from "react";
import { useRecentPairsStore } from "@/store";

// Excludes whichever pair is currently active in the converter — offering
// it back as a "recent" shortcut would be a no-op click.
export function useRecentPairs(
  activeFromCurrency: string,
  activeToCurrency: string,
) {
  const recentPairs = useRecentPairsStore((state) => state.recentPairs);

  return React.useMemo(
    () =>
      recentPairs.filter(
        (pair) =>
          !(
            pair.fromCurrency === activeFromCurrency &&
            pair.toCurrency === activeToCurrency
          ),
      ),
    [recentPairs, activeFromCurrency, activeToCurrency],
  );
}
