"use client";

import { useSession } from "@/lib/auth-client";
import { createRecentPair, deleteRecentPair } from "@/services";
import { useRecentPairsStore } from "@/store";
import { runOptimisticMutation } from "@/utils";

// Single entry point for adding/removing recent pairs — used by
// RecentPairsTracker (automatic, on every pair change) and CurrencyPicker
// (explicit removal via the "x" on a recent-pair chip), so both paths
// stay sync-aware without duplicating the "also tell the server" logic.
// Both actions stay silent on failure (no toast) — this fires on every
// currency swap, and a failed background sync is low-stakes enough that
// a retry toast would just be noise. Rollback is silent for the same
// reason: the chip quietly not appearing (or reappearing) is sufficient
// feedback on its own.
export function useRecentPairMutations() {
  const { data: session } = useSession();

  const storeAddRecentPair = useRecentPairsStore(
    (state) => state.addRecentPair,
  );
  const storeRemoveRecentPair = useRecentPairsStore(
    (state) => state.removeRecentPair,
  );
  const storeReplaceRecentPairs = useRecentPairsStore(
    (state) => state.replaceRecentPairs,
  );

  const addRecentPair = async (fromCurrency: string, toCurrency: string) => {
    const lastUsedAt = Date.now();

    if (!session) {
      storeAddRecentPair(fromCurrency, toCurrency, lastUsedAt);
      return;
    }

    const snapshot = useRecentPairsStore.getState().recentPairs;

    await runOptimisticMutation({
      apply: () => storeAddRecentPair(fromCurrency, toCurrency, lastUsedAt),
      rollback: () => storeReplaceRecentPairs(snapshot),
      request: () => createRecentPair(fromCurrency, toCurrency, lastUsedAt),
    });
  };

  const removeRecentPair = async (id: string) => {
    if (!session) {
      storeRemoveRecentPair(id);
      return;
    }

    const [fromCurrency, toCurrency] = id.split("-");
    if (!fromCurrency || !toCurrency) return;

    const snapshot = useRecentPairsStore.getState().recentPairs;

    await runOptimisticMutation({
      apply: () => storeRemoveRecentPair(id),
      rollback: () => storeReplaceRecentPairs(snapshot),
      request: () => deleteRecentPair(fromCurrency, toCurrency),
    });
  };

  return { addRecentPair, removeRecentPair };
}
