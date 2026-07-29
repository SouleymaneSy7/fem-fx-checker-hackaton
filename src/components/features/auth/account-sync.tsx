"use client";

import * as React from "react";

import { useSession } from "@/lib/auth-client";
import { fetchAlerts } from "@/services/alerts.service";
import { createFavorite, fetchFavorites } from "@/services/favorites.service";
import { fetchLogEntries } from "@/services/logs.service";
import {
  createRecentPair,
  fetchRecentPairs,
} from "@/services/recent-pairs.service";
import { useAlertsStore } from "@/store/alerts-store";
import { useFavoritesStore } from "@/store/favorites-store";
import { useLogStore } from "@/store/log-store";
import { useRecentPairsStore } from "@/store/recent-pairs-store";

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

      const [serverFavorites, serverEntries, serverAlerts, serverRecentPairs] =
        await Promise.all([
          fetchFavorites(),
          fetchLogEntries(),
          fetchAlerts(),
          fetchRecentPairs(),
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
