"use client";

import * as React from "react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import {
  createAlert,
  deleteAlert,
  updateAlert,
} from "@/services/alerts.service";
import { useAlertsStore } from "@/store/alerts-store";
import type { RateAlertConditionType, RateAlertType } from "@/types";

export function useAlertMutations() {
  const { data: session } = useSession();

  const storeAddAlert = useAlertsStore((state) => state.addAlert);
  const storeAddSyncedAlert = useAlertsStore((state) => state.addSyncedAlert);
  const storeRemoveAlert = useAlertsStore((state) => state.removeAlert);
  const storeTriggerAlert = useAlertsStore((state) => state.triggerAlert);
  const storeResetAlert = useAlertsStore((state) => state.resetAlert);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const addAlert = async (
    fromCurrency: string,
    toCurrency: string,
    condition: RateAlertConditionType,
    threshold: number,
  ) => {
    const successMessage = `You'll be notified when ${fromCurrency}/${toCurrency} goes ${condition === "above" ? "above" : "below"} ${threshold.toFixed(2)}.`;

    if (!session) {
      storeAddAlert({ fromCurrency, toCurrency, condition, threshold });
      toast.success(successMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      const created = await createAlert(
        fromCurrency,
        toCurrency,
        condition,
        threshold,
      );
      storeAddSyncedAlert(created);
      toast.success(successMessage);
    } catch {
      storeAddAlert({ fromCurrency, toCurrency, condition, threshold });
      toast.warning(
        "Couldn't reach the server — your alert was saved locally.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeAlert = (
    id: string,
    fromCurrency: string,
    toCurrency: string,
  ) => {
    storeRemoveAlert(id);
    toast.success(`Alert for ${fromCurrency}/${toCurrency} has been removed.`);

    if (!session) return;

    deleteAlert(id).catch(() => {
      toast.error(
        "Sync failed — your change was saved locally and will retry next time.",
      );
    });
  };

  // Called by the watcher when a threshold crosses. Takes the full alert
  // plus the rate that tripped it so it can build the "triggered" toast
  // itself — kept silent on server-sync failure, since a second failure
  // toast on top of the "triggered" one would just be noise.
  const triggerAlert = (alert: RateAlertType, rate: number) => {
    const triggeredAt = Date.now();
    storeTriggerAlert(alert.id, triggeredAt);

    toast("Rate alert triggered!", {
      description: `${alert.fromCurrency}/${alert.toCurrency} has ${alert.condition === "above" ? "risen above" : "dropped below"} your ${alert.threshold.toFixed(2)} threshold — currently at ${rate.toFixed(2)}.`,
    });

    if (!session) return;

    updateAlert(alert.id, { enabled: false, triggeredAt }).catch(() => {});
  };

  const resetAlert = (
    id: string,
    fromCurrency: string,
    toCurrency: string,
    threshold: number,
  ) => {
    storeResetAlert(id);
    toast.info(
      `Watching ${fromCurrency}/${toCurrency} again — you'll be notified when the rate crosses ${threshold.toFixed(2)}.`,
    );

    if (!session) return;

    updateAlert(id, { enabled: true, triggeredAt: null }).catch(() => {
      toast.error(
        "Sync failed — your change was saved locally and will retry next time.",
      );
    });
  };

  return { addAlert, removeAlert, triggerAlert, resetAlert, isSubmitting };
}
