"use client";

import * as React from "react";
import { toast } from "sonner";

import { useSession } from "@/lib/auth-client";
import { createAlert, deleteAlert, updateAlert } from "@/services";
import { useAlertsStore, usePreferencesStore } from "@/store";
import type { RateAlertConditionType, RateAlertType } from "@/types";
import { playAlertSound, runOptimisticMutation } from "@/utils";

export function useAlertMutations() {
  const { data: session } = useSession();
  const alertSoundEnabled = usePreferencesStore(
    (state) => state.alertSoundEnabled,
  );

  const storeAddAlert = useAlertsStore((state) => state.addAlert);
  const storeAddSyncedAlert = useAlertsStore((state) => state.addSyncedAlert);
  const storeRemoveAlert = useAlertsStore((state) => state.removeAlert);
  const storeTriggerAlert = useAlertsStore((state) => state.triggerAlert);
  const storeResetAlert = useAlertsStore((state) => state.resetAlert);
  const storeReplaceAlerts = useAlertsStore((state) => state.replaceAlerts);

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

    const tempId = crypto.randomUUID();
    const tempAlert: RateAlertType = {
      id: tempId,
      fromCurrency,
      toCurrency,
      condition,
      threshold,
      enabled: true,
      createdAt: Date.now(),
      triggeredAt: null,
    };

    setIsSubmitting(true);

    await runOptimisticMutation({
      apply: () => {
        storeAddSyncedAlert(tempAlert);
        toast.success(successMessage);
      },
      rollback: () => {
        storeRemoveAlert(tempId);
        toast.error(
          `Couldn't create the alert for ${fromCurrency}/${toCurrency} — try again.`,
        );
      },
      request: () =>
        createAlert(fromCurrency, toCurrency, condition, threshold),
      onSuccess: (created) => {
        storeRemoveAlert(tempId);
        storeAddSyncedAlert(created);
      },
    });

    setIsSubmitting(false);
  };

  const removeAlert = async (
    id: string,
    fromCurrency: string,
    toCurrency: string,
  ) => {
    if (!session) {
      storeRemoveAlert(id);
      toast.success(
        `Alert for ${fromCurrency}/${toCurrency} has been removed.`,
      );
      return;
    }

    const snapshot = useAlertsStore.getState().alerts;

    await runOptimisticMutation({
      apply: () => {
        storeRemoveAlert(id);
        toast.success(
          `Alert for ${fromCurrency}/${toCurrency} has been removed.`,
        );
      },
      rollback: () => {
        storeReplaceAlerts(snapshot);
        toast.error(
          `Couldn't remove the alert for ${fromCurrency}/${toCurrency} — try again.`,
        );
      },
      request: () => deleteAlert(id),
    });
  };

  // Called by the watcher when a threshold crosses — stays optimistic
  // with a silent server-sync failure (no rollback, no error toast) by
  // design: this fires automatically, not from a direct user action, and
  // a failed sync here just means the next sign-in's AccountSync
  // reconciliation (which replaces local alerts with the server's
  // canonical list) resolves the drift instead of an immediate rollback.
  const triggerAlert = (alert: RateAlertType, rate: number) => {
    const triggeredAt = Date.now();

    storeTriggerAlert(alert.id, triggeredAt);
    if (alertSoundEnabled) playAlertSound();

    toast("Rate alert triggered!", {
      description: `${alert.fromCurrency}/${alert.toCurrency} has ${alert.condition === "above" ? "risen above" : "dropped below"} your ${alert.threshold.toFixed(2)} threshold — currently at ${rate.toFixed(2)}.`,
    });

    if (!session) return;

    updateAlert(alert.id, { enabled: false, triggeredAt }).catch(() => {});
  };

  const resetAlert = async (
    id: string,
    fromCurrency: string,
    toCurrency: string,
    threshold: number,
  ) => {
    if (!session) {
      storeResetAlert(id);
      toast.info(
        `Watching ${fromCurrency}/${toCurrency} again — you'll be notified when the rate crosses ${threshold.toFixed(2)}.`,
      );
      return;
    }

    const snapshot = useAlertsStore.getState().alerts;

    await runOptimisticMutation({
      apply: () => {
        storeResetAlert(id);
        toast.info(
          `Watching ${fromCurrency}/${toCurrency} again — you'll be notified when the rate crosses ${threshold.toFixed(2)}.`,
        );
      },
      rollback: () => {
        storeReplaceAlerts(snapshot);
        toast.error(
          `Couldn't reset the alert for ${fromCurrency}/${toCurrency} — try again.`,
        );
      },
      request: () => updateAlert(id, { enabled: true, triggeredAt: null }),
    });
  };

  return {
    addAlert,
    removeAlert,
    triggerAlert,
    resetAlert,
    isSubmitting,
  };
}
