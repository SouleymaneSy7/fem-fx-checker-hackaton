import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { MAX_RECENT_PAIRS, STORAGE_KEY_RECENT_PAIRS } from "@/constants";
import type { RecentPairsStoreType } from "@/types/data.types";
import { safeLocalStorage } from "@/utils/safe-storage";

const buildPairId = (from: string, to: string) => `${from}-${to}`;

export const useRecentPairsStore = create<RecentPairsStoreType>()(
  persist(
    (set) => ({
      recentPairs: [],

      // Re-using a pair moves it to the front instead of duplicating it —
      // same MRU behavior as favorites-store.ts's pinPair, just without
      // the "already pinned" guard since re-ordering is the whole point.
      addRecentPair: (fromCurrency, toCurrency) => {
        const id = buildPairId(fromCurrency, toCurrency);

        set((state) => {
          const withoutExisting = state.recentPairs.filter(
            (pair) => pair.id !== id,
          );

          return {
            recentPairs: [
              { id, fromCurrency, toCurrency, lastUsedAt: Date.now() },
              ...withoutExisting,
            ].slice(0, MAX_RECENT_PAIRS),
          };
        });
      },
    }),
    {
      name: STORAGE_KEY_RECENT_PAIRS,
      storage: createJSONStorage(() => safeLocalStorage),
    },
  ),
);
