import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { STORAGE_KEY_PREFERENCES } from "@/constants";
import type { PreferencesStoreType } from "@/types";
import { safeLocalStorage } from "@/utils";

export const usePreferencesStore = create<PreferencesStoreType>()(
  persist(
    (set) => ({
      defaultFromCurrency: null,
      defaultToCurrency: null,
      defaultAmount: null,
      defaultTab: null,
      tickerQuoteCurrencies: null,
      decimalPrecision: null,
      alertSoundEnabled: true,
      alertRefreshIntervalMs: null,
      reducedMotion: null,
      tickerVisible: true,
      tickerSpeedSeconds: null,

      setDefaultFromCurrency: (code) => set({ defaultFromCurrency: code }),
      setDefaultToCurrency: (code) => set({ defaultToCurrency: code }),
      setDefaultAmount: (amount) => set({ defaultAmount: amount }),
      setDefaultTab: (tab) => set({ defaultTab: tab }),
      setTickerQuoteCurrencies: (currencies) =>
        set({ tickerQuoteCurrencies: currencies }),
      setDecimalPrecision: (precision) => set({ decimalPrecision: precision }),
      setAlertSoundEnabled: (enabled) => set({ alertSoundEnabled: enabled }),
      setAlertRefreshIntervalMs: (ms) => set({ alertRefreshIntervalMs: ms }),
      setReducedMotion: (value) => set({ reducedMotion: value }),
      setTickerVisible: (visible) => set({ tickerVisible: visible }),
      setTickerSpeedSeconds: (seconds) => set({ tickerSpeedSeconds: seconds }),

      resetPreferences: () =>
        set({
          defaultFromCurrency: null,
          defaultToCurrency: null,
          defaultAmount: null,
          defaultTab: null,
          tickerQuoteCurrencies: null,
          decimalPrecision: null,
          alertSoundEnabled: true,
          alertRefreshIntervalMs: null,
          reducedMotion: null,
          tickerVisible: true,
          tickerSpeedSeconds: null,
        }),
    }),
    {
      name: STORAGE_KEY_PREFERENCES,
      storage: createJSONStorage(() => safeLocalStorage),
    },
  ),
);
