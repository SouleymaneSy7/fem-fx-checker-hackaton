"use client";

import * as React from "react";

import { useRecentPairMutations } from "@/hooks/use-recent-pair-mutations";
import { useConverterStore } from "@/store/converter-store";

/**
 * Renders nothing — mounted once in layout.tsx (see AccountSync for the
 * same pattern). Watches the converter's active pair and records it as
 * "recently used" on every change, skipping the very first effect run so
 * the default pair (or one hydrated from a shared URL) isn't recorded
 * before the user has actually done anything.
 *
 * `addRecentPair` is read through a ref rather than listed as an effect
 * dependency: it's a new closure on every render (it captures
 * `useSession()` inside useRecentPairMutations), so depending on it
 * directly would re-fire this effect — and re-record the same pair — on
 * every session revalidation, not just on an actual pair change.
 */
const RecentPairsTracker = () => {
  const fromCurrency = useConverterStore((state) => state.fromCurrency);
  const toCurrency = useConverterStore((state) => state.toCurrency);
  const { addRecentPair } = useRecentPairMutations();

  const addRecentPairRef = React.useRef(addRecentPair);
  addRecentPairRef.current = addRecentPair;

  const hasMounted = React.useRef(false);

  React.useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    addRecentPairRef.current(fromCurrency, toCurrency);
  }, [fromCurrency, toCurrency]);

  return null;
};

RecentPairsTracker.displayName = "RecentPairsTracker";

export default RecentPairsTracker;
