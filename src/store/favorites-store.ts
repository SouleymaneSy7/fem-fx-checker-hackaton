import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { STORAGE_KEY_FAVORITES } from "@/constants";
import type { FavoritesStoreType } from "@/types";
import { safeLocalStorage } from "@/utils";

const buildPairId = (from: string, to: string) => `${from}-${to}`;

export const useFavoritesStore = create<FavoritesStoreType>()(
  persist(
    (set, get) => ({
      favorites: [],

      pinPair: (fromCurrency, toCurrency) => {
        const id = buildPairId(fromCurrency, toCurrency);
        if (get().favorites.some((pair) => pair.id === id)) return;

        set((state) => ({
          favorites: [...state.favorites, { id, fromCurrency, toCurrency }],
        }));
      },

      unpinPair: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((pair) => pair.id !== id),
        })),

      isPinned: (fromCurrency, toCurrency) =>
        get().favorites.some(
          (pair) => pair.id === buildPairId(fromCurrency, toCurrency),
        ),

      replaceFavorites: (favorites) => set({ favorites }),
    }),
    {
      name: STORAGE_KEY_FAVORITES,
      storage: createJSONStorage(() => safeLocalStorage),
    },
  ),
);
