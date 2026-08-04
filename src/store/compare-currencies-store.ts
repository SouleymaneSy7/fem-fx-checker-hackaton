import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  DEFAULT_COMPARE_CURRENCIES,
  STORAGE_KEY_COMPARE_CURRENCIES,
} from "@/constants";
import type { CompareCurrenciesStoreType } from "@/types";
import { safeLocalStorage } from "@/utils";

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

      // Wholesale replace — used by Settings > Preferences (Display &
      // data), which edits this list directly rather than going through
      // a separate preferences-store field.
      setCurrencies: (codes) => set({ currencies: codes }),
    }),
    {
      name: STORAGE_KEY_COMPARE_CURRENCIES,
      storage: createJSONStorage(() => safeLocalStorage),
    },
  ),
);
