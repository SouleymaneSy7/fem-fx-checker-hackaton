import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { MAX_RECENT_PAIRS, STORAGE_KEY_RECENT_PAIRS } from "@/constants";
import type { RecentPairsStoreType } from "@/types";
import { safeLocalStorage } from "@/utils/safe-storage";

const buildPairId = (from: string, to: string) => `${from}-${to}`;

export const useRecentPairsStore = create<RecentPairsStoreType>()(
  persist(
    (set) => ({
      recentPairs: [],

      // Re-using a pair moves it to the front instead of duplicating it —
      // same MRU behavior as favorites-store.ts's pinPair, just without
      // the "already pinned" guard since re-ordering is the whole point.
      // `lastUsedAt` is passed in rather than read via `Date.now()` here
      // so the caller (useRecentPairMutations) sends the server the exact
      // same timestamp that lands in the local store.
      addRecentPair: (fromCurrency, toCurrency, lastUsedAt) => {
        const id = buildPairId(fromCurrency, toCurrency);

        set((state) => {
          const withoutExisting = state.recentPairs.filter(
            (pair) => pair.id !== id,
          );

          return {
            recentPairs: [
              { id, fromCurrency, toCurrency, lastUsedAt },
              ...withoutExisting,
            ].slice(0, MAX_RECENT_PAIRS),
          };
        });
      },

      removeRecentPair: (id) =>
        set((state) => ({
          recentPairs: state.recentPairs.filter((pair) => pair.id !== id),
        })),

      // Wholesale swap-in of the server's canonical list — used once on
      // sign-in by AccountSync, mirrors favorites/log/alerts' own replace
      // action.
      replaceRecentPairs: (recentPairs) => set({ recentPairs }),
    }),
    {
      name: STORAGE_KEY_RECENT_PAIRS,
      storage: createJSONStorage(() => safeLocalStorage),
    },
  ),
);
