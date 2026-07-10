"use client";

import * as React from "react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { createFavorite, deleteFavorite } from "@/services/favorites.service";
import { useFavoritesStore } from "@/store/favorites-store";

// Single entry point for pinning/unpinning — used by use-converter.ts,
// use-compare.ts, and (via use-favorites.ts) FavoritesPanel, so every
// mutation path stays sync-aware without duplicating the "also tell the
// server" logic in each caller.
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
    toast.success(`${fromCurrency}/${toCurrency} added to your favorites.`);

    if (!session) return;

    setPending(id, true);
    createFavorite(fromCurrency, toCurrency)
      .catch(() => {
        toast.error(
          "Sync failed — your change was saved locally and will retry next time.",
        );
      })
      .finally(() => setPending(id, false));
  };

  const unpinPair = (id: string) => {
    storeUnpinPair(id);

    if (!session) return;

    const [fromCurrency, toCurrency] = id.split("-");
    if (!fromCurrency || !toCurrency) return;
    toast.success(`${fromCurrency}/${toCurrency} removed from your favorites.`);

    setPending(id, true);
    deleteFavorite(fromCurrency, toCurrency)
      .catch(() => {
        toast.error(
          "Sync failed — your change was saved locally and will retry next time.",
        );
      })
      .finally(() => setPending(id, false));
  };

  const isPending = React.useCallback(
    (id: string) => pendingIds.has(id),
    [pendingIds],
  );

  return { pinPair, unpinPair, isPending };
}
