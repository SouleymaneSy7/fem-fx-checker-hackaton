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

export function useAlertsWatcher() {
  const alerts = useAlertsStore((state) => state.alerts);
  const triggerAlert = useAlertsStore((state) => state.triggerAlert);

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
}
