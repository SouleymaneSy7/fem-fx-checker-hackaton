"use client";

import * as React from "react";

import {
  DEFAULT_CHART_CURRENCIES,
  DEFAULT_COMPARE_CURRENCIES,
} from "@/constants";
import {
  useAlertsStore,
  useCompareChartCurrenciesStore,
  useCompareCurrenciesStore,
  useFavoritesStore,
  useLogStore,
  usePreferencesStore,
  useRecentPairsStore,
  useThemeStore,
} from "@/store";

// Wipes every store AccountSync treats as server-synced. Shared by
// sign-out (auth-popover.tsx) and account deletion (danger-zone-panel.tsx,
// and settings-shell.tsx's confirmDelete branch) — anywhere this
// browser's local data needs to stop representing an account that's no
// longer signed in or no longer exists.
//
// Preferences, theme, and the two compare-currency lists are included
// here too now that they sync to `user_settings` (see AccountSync) —
// leaving them in place after sign-out would show a guest session (or
// the next account that signs in on this browser) settings that belong
// to the account that just left.
export function useClearSyncedStores() {
  const replaceFavorites = useFavoritesStore((state) => state.replaceFavorites);
  const clearLog = useLogStore((state) => state.clearLog);
  const replaceAlerts = useAlertsStore((state) => state.replaceAlerts);
  const replaceRecentPairs = useRecentPairsStore(
    (state) => state.replaceRecentPairs,
  );
  const resetPreferences = usePreferencesStore(
    (state) => state.resetPreferences,
  );
  const setTheme = useThemeStore((state) => state.setTheme);
  const setCompareCurrencies = useCompareCurrenciesStore(
    (state) => state.setCurrencies,
  );
  const setCompareChartCurrencies = useCompareChartCurrenciesStore(
    (state) => state.setCurrencies,
  );

  return React.useCallback(() => {
    replaceFavorites([]);
    clearLog();
    replaceAlerts([]);
    replaceRecentPairs([]);
    resetPreferences();
    setTheme("dark");
    setCompareCurrencies(DEFAULT_COMPARE_CURRENCIES);
    setCompareChartCurrencies(DEFAULT_CHART_CURRENCIES);
  }, [
    replaceFavorites,
    clearLog,
    replaceAlerts,
    replaceRecentPairs,
    resetPreferences,
    setTheme,
    setCompareCurrencies,
    setCompareChartCurrencies,
  ]);
}
