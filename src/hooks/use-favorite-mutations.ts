"use client";

import { useSession } from "@/lib/auth-client";
import { createFavorite, deleteFavorite } from "@/services/favorites.service";
import { useFavoritesStore } from "@/store/favorites-store";

// Single entry point for pinning/unpinning — used by use-converter.ts,
// use-compare.ts, and (via use-favorites.ts) FavoritesPanel, so every
// mutation path stays sync-aware without duplicating the "also tell the
// server" logic in each caller.
export function useFavoriteMutations() {
  const { data: session } = useSession();

  const storePinPair = useFavoritesStore((state) => state.pinPair);
  const storeUnpinPair = useFavoritesStore((state) => state.unpinPair);

  const pinPair = (fromCurrency: string, toCurrency: string) => {
    storePinPair(fromCurrency, toCurrency);
    if (session) {
      createFavorite(fromCurrency, toCurrency).catch(() => {
        // Best-effort: local state already reflects the pin either way.
      });
    }
  };

  // `id` is always `${fromCurrency}-${toCurrency}` (see favorites-store.ts),
  // so it's split back apart rather than plumbing separate params through
  // every caller that already only has the id (e.g. FavoritesPanel rows).
  const unpinPair = (id: string) => {
    storeUnpinPair(id);
    if (session) {
      const [fromCurrency, toCurrency] = id.split("-");
      if (fromCurrency && toCurrency) {
        deleteFavorite(fromCurrency, toCurrency).catch(() => {});
      }
    }
  };

  return { pinPair, unpinPair };
}
