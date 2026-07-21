"use client";

import { useSession } from "@/lib/auth-client";
import {
  createRecentPair,
  deleteRecentPair,
} from "@/services/recent-pairs.service";
import { useRecentPairsStore } from "@/store/recent-pairs-store";

// Single entry point for adding/removing recent pairs — used by
// RecentPairsTracker (automatic, on every pair change) and CurrencyPicker
// (explicit removal via the "x" on a recent-pair chip), so both paths
// stay sync-aware without duplicating the "also tell the server" logic.
// Unlike useFavoriteMutations/useLogMutations, neither action surfaces a
// toast: adding fires silently on every currency change (a toast there
// would fire on nearly every interaction), and removing a low-stakes,
// easily-regenerated chip doesn't warrant one either — the chip
// disappearing from the list is feedback enough.
export function useRecentPairMutations() {
  const { data: session } = useSession();

  const storeAddRecentPair = useRecentPairsStore(
    (state) => state.addRecentPair,
  );
  const storeRemoveRecentPair = useRecentPairsStore(
    (state) => state.removeRecentPair,
  );

  const addRecentPair = (fromCurrency: string, toCurrency: string) => {
    const lastUsedAt = Date.now();
    storeAddRecentPair(fromCurrency, toCurrency, lastUsedAt);

    if (!session) return;

    // Fire-and-forget: a failed sync here just means this device's
    // activity doesn't reach the server this time — not worth a retry
    // toast on every currency swap.
    createRecentPair(fromCurrency, toCurrency, lastUsedAt).catch(() => {});
  };

  const removeRecentPair = (id: string) => {
    storeRemoveRecentPair(id);

    if (!session) return;

    const [fromCurrency, toCurrency] = id.split("-");
    if (!fromCurrency || !toCurrency) return;

    deleteRecentPair(fromCurrency, toCurrency).catch(() => {});
  };

  return { addRecentPair, removeRecentPair };
}
