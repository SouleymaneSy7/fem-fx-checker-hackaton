import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  DEFAULT_CHART_CURRENCIES,
  MAX_CHART_CURRENCIES,
  STORAGE_KEY_COMPARE_CHART_CURRENCIES,
} from "@/constants";
import type { CompareChartCurrenciesStoreType } from "@/types";
import { safeLocalStorage } from "@/utils";

export const useCompareChartCurrenciesStore =
  create<CompareChartCurrenciesStoreType>()(
    persist(
      (set, get) => ({
        currencies: DEFAULT_CHART_CURRENCIES,

        addCurrency: (code) => {
          const current = get().currencies;
          if (current.includes(code)) return;
          if (current.length >= MAX_CHART_CURRENCIES) return;

          set({ currencies: [...current, code] });
        },

        removeCurrency: (code) =>
          set((state) => ({
            currencies: state.currencies.filter(
              (currency) => currency !== code,
            ),
          })),

        // Wholesale replace — used by Settings > Preferences (Display &
        // data). Defensively re-capped even though the UI (
        // MultiCurrencyPicker's `maxSelected`) already prevents exceeding
        // it.
        setCurrencies: (codes) =>
          set({ currencies: codes.slice(0, MAX_CHART_CURRENCIES) }),
      }),
      {
        name: STORAGE_KEY_COMPARE_CHART_CURRENCIES,
        storage: createJSONStorage(() => safeLocalStorage),
      },
    ),
  );
