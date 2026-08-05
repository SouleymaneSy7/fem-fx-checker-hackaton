"use client";

import * as React from "react";
import { toast } from "sonner";

import { useSession } from "@/lib/auth-client";
import { createFavorite, deleteFavorite } from "@/services";
import { useFavoritesStore } from "@/store";
import { runOptimisticMutation } from "@/utils";

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

  const pinPair = async (fromCurrency: string, toCurrency: string) => {
    const id = `${fromCurrency}-${toCurrency}`;
    const toastId = `favorite-${id}`;

    if (!session) {
      storePinPair(fromCurrency, toCurrency);
      toast.success(`${fromCurrency}/${toCurrency} added to your favorites.`, {
        id: toastId,
      });
      return;
    }

    setPending(id, true);

    await runOptimisticMutation({
      apply: () => {
        storePinPair(fromCurrency, toCurrency);
        toast.success(
          `${fromCurrency}/${toCurrency} added to your favorites.`,
          { id: toastId },
        );
      },
      rollback: () => {
        storeUnpinPair(id);
        toast.error(`Couldn't pin ${fromCurrency}/${toCurrency} — try again.`, {
          id: toastId,
        });
      },
      request: () => createFavorite(fromCurrency, toCurrency),
    });

    setPending(id, false);
  };

  const unpinPair = async (id: string) => {
    const [fromCurrency, toCurrency] = id.split("-");
    if (!fromCurrency || !toCurrency) return;

    const toastId = `favorite-${id}`;

    if (!session) {
      storeUnpinPair(id);
      toast.success(
        `${fromCurrency}/${toCurrency} removed from your favorites.`,
        { id: toastId },
      );
      return;
    }

    setPending(id, true);

    await runOptimisticMutation({
      apply: () => {
        storeUnpinPair(id);
        toast.success(
          `${fromCurrency}/${toCurrency} removed from your favorites.`,
          { id: toastId },
        );
      },
      rollback: () => {
        storePinPair(fromCurrency, toCurrency);
        toast.error(
          `Couldn't unpin ${fromCurrency}/${toCurrency} — try again.`,
          { id: toastId },
        );
      },
      request: () => deleteFavorite(fromCurrency, toCurrency),
    });

    setPending(id, false);
  };

  const isPending = React.useCallback(
    (id: string) => pendingIds.has(id),
    [pendingIds],
  );

  return { pinPair, unpinPair, isPending };
}
