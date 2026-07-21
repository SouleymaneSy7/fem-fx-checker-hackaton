import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  DEFAULT_COMPARE_CURRENCIES,
  STORAGE_KEY_COMPARE_CURRENCIES,
} from "@/constants";
import type { CompareCurrenciesStoreType } from "@/types/data.types";
import { safeLocalStorage } from "@/utils/safe-storage";

export const useCompareCurrenciesStore = create<CompareCurrenciesStoreType>()(
  persist(
    (set, get) => ({
      currencies: DEFAULT_COMPARE_CURRENCIES,

      addCurrency: (code) => {
        if (get().currencies.includes(code)) return;

        set((state) => ({ currencies: [...state.currencies, code] }));
      },

      removeCurrency: (code) =>
        set((state) => ({
          currencies: state.currencies.filter((currency) => currency !== code),
        })),
    }),
    {
      name: STORAGE_KEY_COMPARE_CURRENCIES,
      storage: createJSONStorage(() => safeLocalStorage),
    },
  ),
);
