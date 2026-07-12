"use client";

import * as React from "react";

import { useConverterStore } from "@/store/converter-store";
import { useRecentPairsStore } from "@/store/recent-pairs-store";

/**
 * Renders nothing — mounted once in layout.tsx (see AccountSync for the
 * same pattern). Watches the converter's active pair and records it as
 * "recently used" on every change, skipping the very first effect run so
 * the default pair (or one hydrated from a shared URL) isn't recorded
 * before the user has actually done anything.
 */
const RecentPairsTracker = () => {
  const fromCurrency = useConverterStore((state) => state.fromCurrency);
  const toCurrency = useConverterStore((state) => state.toCurrency);
  const addRecentPair = useRecentPairsStore((state) => state.addRecentPair);

  const hasMounted = React.useRef(false);

  React.useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    addRecentPair(fromCurrency, toCurrency);
  }, [fromCurrency, toCurrency, addRecentPair]);

  return null;
};

RecentPairsTracker.displayName = "RecentPairsTracker";

export default RecentPairsTracker;
