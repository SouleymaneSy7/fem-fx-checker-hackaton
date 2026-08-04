"use client";

import * as React from "react";
import useSWR from "swr";

import { SWR_STALE_1H } from "@/constants";
import { fetchLatestRates } from "@/services";
import { useAlertsStore, usePreferencesStore } from "@/store";
import type { RateAlertType } from "@/types";
import { useAlertMutations } from "./use-alert-mutations";

function isThresholdCrossed(alert: RateAlertType, rate: number): boolean {
  return alert.condition === "above"
    ? rate >= alert.threshold
    : rate <= alert.threshold;
}

export function useAlertsWatcher() {
  const alerts = useAlertsStore((state) => state.alerts);
  const { triggerAlert } = useAlertMutations();

  const alertRefreshIntervalMs = usePreferencesStore(
    (state) => state.alertRefreshIntervalMs,
  );
  const effectiveInterval = alertRefreshIntervalMs ?? SWR_STALE_1H;

  const watchedAlerts = React.useMemo(
    () => alerts.filter((alert) => alert.enabled && !alert.triggeredAt),
    [alerts],
  );

  const groups = React.useMemo(() => {
    const map = new Map<string, string[]>();

    for (const alert of watchedAlerts) {
      const quotes = map.get(alert.fromCurrency) ?? [];
      if (!quotes.includes(alert.toCurrency)) quotes.push(alert.toCurrency);
      map.set(alert.fromCurrency, quotes);
    }

    return Array.from(map.entries());
  }, [watchedAlerts]);

  const swrKey =
    groups.length > 0
      ? [
          "alerts-rates",
          groups
            .map(([base, quotes]) => `${base}:${quotes.join(",")}`)
            .join("|"),
        ]
      : null;

  // Refresh cadence is a Settings > Preferences > Alerts preference
  // (falls back to the hourly default) — Frankfurter only publishes a
  // new EOD rate once per business day, so anything shorter just polls
  // for the same unchanged rate more often.
  const { data } = useSWR(
    swrKey,
    () =>
      Promise.all(
        groups.map(async ([base, quotes]) => ({
          base,
          rows: await fetchLatestRates(base, quotes),
        })),
      ),
    {
      refreshInterval: effectiveInterval,
      dedupingInterval: effectiveInterval,
    },
  );

  React.useEffect(() => {
    if (!data) return;

    for (const alert of watchedAlerts) {
      const group = data.find((entry) => entry.base === alert.fromCurrency);
      const rate = group?.rows.find(
        (row) => row.quote === alert.toCurrency,
      )?.rate;

      if (rate === undefined || !isThresholdCrossed(alert, rate)) continue;

      // Builds and shows its own "triggered" toast (and plays the alert
      // sound, if enabled) internally now — see useAlertMutations.
      triggerAlert(alert, rate);

      window.dispatchEvent(
        new CustomEvent("fx:alert-triggered", { detail: { id: alert.id } }),
      );
    }
  }, [data, watchedAlerts, triggerAlert]);
}
