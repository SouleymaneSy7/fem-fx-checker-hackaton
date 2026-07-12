"use client";

import * as React from "react";

import { useSession } from "@/lib/auth-client";
import { fetchAlerts } from "@/services/alerts.service";
import { createFavorite, fetchFavorites } from "@/services/favorites.service";
import { fetchLogEntries } from "@/services/logs.service";
import { useAlertsStore } from "@/store/alerts-store";
import { useFavoritesStore } from "@/store/favorites-store";
import { useLogStore } from "@/store/log-store";

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
 */
const AccountSync = () => {
  const { data: session } = useSession();
  const replaceFavorites = useFavoritesStore((state) => state.replaceFavorites);
  const replaceEntries = useLogStore((state) => state.replaceEntries);
  const replaceAlerts = useAlertsStore((state) => state.replaceAlerts);

  React.useEffect(() => {
    if (!session) return;

    let cancelled = false;

    (async () => {
      const localFavorites = useFavoritesStore.getState().favorites;

      await Promise.all(
        localFavorites.map((pair) =>
          createFavorite(pair.fromCurrency, pair.toCurrency).catch(() => null),
        ),
      );

      const [serverFavorites, serverEntries, serverAlerts] = await Promise.all([
        fetchFavorites(),
        fetchLogEntries(),
        fetchAlerts(),
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
    })();

    return () => {
      cancelled = true;
    };
  }, [session, replaceFavorites, replaceEntries, replaceAlerts]);

  return null;
};

AccountSync.displayName = "AccountSync";

export default AccountSync;
