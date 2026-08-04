"use client";

import * as React from "react";

import {
  useAlertsStore,
  useFavoritesStore,
  useLogStore,
  useRecentPairsStore,
} from "@/store";

// Wipes every store AccountSync treats as server-synced. Shared by
// sign-out (auth-popover.tsx) and account deletion (danger-zone-panel.tsx,
// and settings-shell.tsx's confirmDelete branch) — anywhere this
// browser's local data needs to stop representing an account that's no
// longer signed in or no longer exists.
export function useClearSyncedStores() {
  const replaceFavorites = useFavoritesStore((state) => state.replaceFavorites);
  const clearLog = useLogStore((state) => state.clearLog);
  const replaceAlerts = useAlertsStore((state) => state.replaceAlerts);
  const replaceRecentPairs = useRecentPairsStore(
    (state) => state.replaceRecentPairs,
  );

  return React.useCallback(() => {
    replaceFavorites([]);
    clearLog();
    replaceAlerts([]);
    replaceRecentPairs([]);
  }, [replaceFavorites, clearLog, replaceAlerts, replaceRecentPairs]);
}
