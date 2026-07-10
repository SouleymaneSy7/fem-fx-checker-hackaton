"use client";

import * as React from "react";

import { useSession } from "@/lib/auth-client";
import { createFavorite, deleteFavorite } from "@/services/favorites.service";
import { useFavoritesStore } from "@/store/favorites-store";

// Single entry point for pinning/unpinning — used by use-converter.ts,
// use-compare.ts, and (via use-favorites.ts) FavoritesPanel, so every
// mutation path stays sync-aware without duplicating the "also tell the
// server" logic in each caller.
//
// `pendingIds` tracks in-flight server calls per pair id. The store above
// already updates synchronously before each call (optimistic), so this
// isn't needed for the star icon to flip — it's for UI that keeps the row
// on screen either way (ConverterBottom's single toggle, ComparePanel's
// rows) and wants a small "still syncing" cue next to the already-updated
// icon while the background call is in flight.
export function useFavoriteMutations() {
  const { data: session } = useSession();
  const [pendingIds, setPendingIds] = React.useState<Set<string>>(new Set());

  const storePinPair = useFavoritesStore((state) => state.pinPair);
  const storeUnpinPair = useFavoritesStore((state) => state.unpinPair);

  const setPending = (id: string, pending: boolean) => {
    setPendingIds((current) => {
      const next = new Set(current);
      if (pending) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const pinPair = (fromCurrency: string, toCurrency: string) => {
    const id = `${fromCurrency}-${toCurrency}`;
    storePinPair(fromCurrency, toCurrency);

    if (!session) return;

    setPending(id, true);
    createFavorite(fromCurrency, toCurrency)
      .catch(() => {
        // Best-effort: local state already reflects the pin either way.
      })
      .finally(() => setPending(id, false));
  };

  // `id` is always `${fromCurrency}-${toCurrency}` (see favorites-store.ts),
  // so it's split back apart rather than plumbing separate params through
  // every caller that already only has the id (e.g. FavoritesPanel rows).
  const unpinPair = (id: string) => {
    storeUnpinPair(id);

    if (!session) return;

    const [fromCurrency, toCurrency] = id.split("-");
    if (!fromCurrency || !toCurrency) return;

    setPending(id, true);
    deleteFavorite(fromCurrency, toCurrency)
      .catch(() => {})
      .finally(() => setPending(id, false));
  };

  const isPending = React.useCallback(
    (id: string) => pendingIds.has(id),
    [pendingIds],
  );

  return { pinPair, unpinPair, isPending };
}
