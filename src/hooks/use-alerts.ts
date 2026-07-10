"use client";

import * as React from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { FIVE_MINUTES } from "@/constants";
import { fetchLatestRates } from "@/services/rates.service";
import { useAlertsStore } from "@/store/alerts-store";
import type { RateAlertType } from "@/types/data.types";

function isThresholdCrossed(alert: RateAlertType, rate: number): boolean {
  return alert.condition === "above"
    ? rate >= alert.threshold
    : rate <= alert.threshold;
}

export function useAlerts() {
  const alerts = useAlertsStore((state) => state.alerts);
  const removeAlert = useAlertsStore((state) => state.removeAlert);
  const triggerAlert = useAlertsStore((state) => state.triggerAlert);
  const resetAlert = useAlertsStore((state) => state.resetAlert);

  const watchedAlerts = React.useMemo(
    () => alerts.filter((alert) => alert.enabled && !alert.triggeredAt),
    [alerts],
  );

  // Group watched alerts by base currency so pairs sharing a base ride a
  // single batched request instead of one call per alert.
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

  // Frankfurter only publishes once per business day, so polling faster
  // than this wouldn't catch anything sooner — this just needs to notice
  // the daily update shortly after it lands while the tab stays open.
  const { data } = useSWR(
    swrKey,
    () =>
      Promise.all(
        groups.map(async ([base, quotes]) => ({
          base,
          rows: await fetchLatestRates(base, quotes),
        })),
      ),
    { refreshInterval: FIVE_MINUTES, dedupingInterval: FIVE_MINUTES },
  );

  // Side effects (Notification, store write) belong in an effect, not the
  // memo above — this runs after each fetch and flips any alert whose
  // threshold the latest rate has crossed.
  React.useEffect(() => {
    if (!data) return;

    for (const alert of watchedAlerts) {
      const group = data.find((entry) => entry.base === alert.fromCurrency);
      const rate = group?.rows.find(
        (row) => row.quote === alert.toCurrency,
      )?.rate;

      if (rate === undefined || !isThresholdCrossed(alert, rate)) continue;

      triggerAlert(alert.id);

      toast("Rate alert triggered!", {
        description: `${alert.fromCurrency}/${alert.toCurrency} has ${alert.condition === "above" ? "risen above" : "dropped below"} your ${alert.threshold.toFixed(2)} threshold — currently at ${rate.toFixed(2)}.`,
      });

      window.dispatchEvent(
        new CustomEvent("fx:alert-triggered", { detail: { id: alert.id } }),
      );
    }
  }, [data, watchedAlerts, triggerAlert]);

  return { alerts, removeAlert, resetAlert };
}
