"use client";

import * as React from "react";

import { useSession } from "@/lib/auth-client";
import {
  createFavorite,
  createRecentPair,
  fetchAlerts,
  fetchFavorites,
  fetchLogEntries,
  fetchRecentPairs,
  fetchSettings,
  updateSettings,
} from "@/services";
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
import type {
  ConverterSectionValueType,
  DecimalPrecisionType,
  ThemeType,
  UpdateSettingsInputType,
  UserSettingsRowType,
} from "@/types";

// Snapshots every settings-related store into the shape `PATCH
// /api/settings` expects — used once, to seed the server the very first
// time a signed-in user turns out to have no settings row yet.
function buildLocalSettingsSnapshot(): UpdateSettingsInputType {
  const preferences = usePreferencesStore.getState();

  return {
    defaultFromCurrency: preferences.defaultFromCurrency,
    defaultToCurrency: preferences.defaultToCurrency,
    defaultAmount: preferences.defaultAmount,
    defaultTab: preferences.defaultTab,
    tickerQuoteCurrencies: preferences.tickerQuoteCurrencies,
    decimalPrecision: preferences.decimalPrecision,
    alertSoundEnabled: preferences.alertSoundEnabled,
    alertRefreshIntervalMs: preferences.alertRefreshIntervalMs,
    reducedMotion: preferences.reducedMotion,
    tickerVisible: preferences.tickerVisible,
    tickerSpeedSeconds: preferences.tickerSpeedSeconds,
    theme: useThemeStore.getState().theme,
    compareCurrencies: useCompareCurrenciesStore.getState().currencies,
    compareChartCurrencies:
      useCompareChartCurrenciesStore.getState().currencies,
  };
}

// Applies the server's canonical settings row onto every local store —
// used whenever a row already exists, so a second device converges on
// what was last saved instead of keeping its own local state.
//
// The preferences-store fields all share the same "null = use the app
// default" contract on both sides (see PreferencesStoreType), so a null
// column value can be assigned directly — it means the same thing
// locally as it does in the DB. Theme and the two compare-currency lists
// are different: locally they're never null (theme always resolves to
// "dark" or "light", the currency lists always hold a concrete array),
// so a null column there means "never customized on any device" and is
// left alone rather than forced onto whatever's already showing.
function applyServerSettings(row: UserSettingsRowType) {
  const preferences = usePreferencesStore.getState();

  preferences.setDefaultFromCurrency(row.defaultFromCurrency);
  preferences.setDefaultToCurrency(row.defaultToCurrency);
  preferences.setDefaultAmount(row.defaultAmount);
  preferences.setDefaultTab(row.defaultTab as ConverterSectionValueType | null);
  preferences.setTickerQuoteCurrencies(row.tickerQuoteCurrencies);
  preferences.setDecimalPrecision(
    row.decimalPrecision as DecimalPrecisionType | null,
  );
  preferences.setAlertSoundEnabled(row.alertSoundEnabled);
  preferences.setAlertRefreshIntervalMs(row.alertRefreshIntervalMs);
  preferences.setReducedMotion(row.reducedMotion);
  preferences.setTickerVisible(row.tickerVisible);
  preferences.setTickerSpeedSeconds(row.tickerSpeedSeconds);

  if (row.theme) useThemeStore.getState().setTheme(row.theme as ThemeType);
  if (row.compareCurrencies) {
    useCompareCurrenciesStore.getState().setCurrencies(row.compareCurrencies);
  }
  if (row.compareChartCurrencies) {
    useCompareChartCurrenciesStore
      .getState()
      .setCurrencies(row.compareChartCurrencies);
  }
}

/**
 * Renders nothing — mounted once in layout.tsx (see KeyboardShortcuts for
 * the same pattern). Whenever a session is present, it:
 *
 * 1. Uploads any locally-pinned favorites that aren't on the server yet.
 *    Safe to repeat on every mount/reload — the unique index on
 *    (userId, from, to) plus `onConflictDoNothing` makes re-uploading an
 *    already-synced pair a harmless no-op.
 * 2. Replaces the local favorites list with the server's canonical one,
 *    so a second device sees what the first one just pinned.
 * 3. Replaces the local log with the server's log. Unlike favorites, past
 *    anonymous log entries are NOT uploaded on sign-in — a log entry has
 *    no natural de-dup key, so re-running this on every reload would
 *    otherwise create duplicate rows. New entries sync from this point
 *    forward (see use-log-mutations.ts).
 * 4. Replaces local rate alerts with the server's list, same non-upload
 *    reasoning as the log — two alerts on the same pair with different
 *    thresholds are legitimate, so there's no safe unique key to dedupe
 *    an upload against. New alerts sync from this point forward (see
 *    use-alert-mutations.ts).
 * 5. Uploads locally-recorded recent pairs, each with its own real
 *    `lastUsedAt` — same safe-to-repeat reasoning as favorites, since the
 *    unique index on (userId, from, to) plus the server's GREATEST()
 *    upsert means re-uploading never regresses a pair that's already
 *    more recent on the server. Then replaces the local list with the
 *    server's canonical, already-sorted-and-capped one.
 * 6. Fetches the settings row. If none exists yet, this is the very
 *    first time this account has ever touched Settings anywhere — the
 *    current local values (preferences, theme, compare currencies) are
 *    uploaded as the starting point. If a row already exists, it's
 *    applied onto every local store instead (server wins) — see
 *    applyServerSettings above for exactly how each field maps.
 *
 * The effect keys off `userId` (a plain string, or null when signed
 * out) rather than the `session` object itself: `useSession()` is backed
 * by a nanostores atom that gets a fresh reference on every background
 * revalidation, even when the session's content hasn't actually changed
 * (see RecentPairsTracker's `addRecentPairRef` for the same underlying
 * issue). Depending on `session` directly would re-run this whole
 * upload-then-replace cycle on every revalidation, not just on an actual
 * sign-in/sign-out/account switch.
 */
const AccountSync = () => {
  const { data: session } = useSession();
  const userId = session?.user.id ?? null;

  const replaceFavorites = useFavoritesStore((state) => state.replaceFavorites);
  const replaceEntries = useLogStore((state) => state.replaceEntries);
  const replaceAlerts = useAlertsStore((state) => state.replaceAlerts);
  const replaceRecentPairs = useRecentPairsStore(
    (state) => state.replaceRecentPairs,
  );

  React.useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    (async () => {
      const localFavorites = useFavoritesStore.getState().favorites;
      const localRecentPairs = useRecentPairsStore.getState().recentPairs;

      await Promise.all([
        ...localFavorites.map((pair) =>
          createFavorite(pair.fromCurrency, pair.toCurrency).catch(() => null),
        ),
        ...localRecentPairs.map((pair) =>
          createRecentPair(
            pair.fromCurrency,
            pair.toCurrency,
            pair.lastUsedAt,
          ).catch(() => null),
        ),
      ]);

      const [
        serverFavorites,
        serverEntries,
        serverAlerts,
        serverRecentPairs,
        serverSettings,
      ] = await Promise.all([
        fetchFavorites(),
        fetchLogEntries(),
        fetchAlerts(),
        fetchRecentPairs(),
        fetchSettings(),
      ]);

      if (cancelled) return;

      replaceFavorites(
        serverFavorites.map((row) => ({
          id: `${row.fromCurrency}-${row.toCurrency}`,
          fromCurrency: row.fromCurrency,
          toCurrency: row.toCurrency,
        })),
      );
      replaceEntries(serverEntries);
      replaceAlerts(serverAlerts);
      replaceRecentPairs(serverRecentPairs);

      if (serverSettings) {
        applyServerSettings(serverSettings);
      } else {
        updateSettings(buildLocalSettingsSnapshot()).catch(() => {});
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    userId,
    replaceFavorites,
    replaceEntries,
    replaceAlerts,
    replaceRecentPairs,
  ]);

  return null;
};

export default AccountSync;
