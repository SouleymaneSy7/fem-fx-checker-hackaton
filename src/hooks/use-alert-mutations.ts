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
import type { RateAlertConditionType } from "@/types/data.types";

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
    if (!session) {
      storeAddAlert({ fromCurrency, toCurrency, condition, threshold });
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
    } catch {
      storeAddAlert({ fromCurrency, toCurrency, condition, threshold });
      toast.warning(
        "Couldn't reach the server — your alert was saved locally.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeAlert = (id: string) => {
    storeRemoveAlert(id);

    if (!session) return;

    deleteAlert(id).catch(() => {
      toast.error(
        "Sync failed — your change was saved locally and will retry next time.",
      );
    });
  };

  // Called by the watcher when a threshold crosses. Kept silent on sync
  // failure — the "Rate alert triggered!" toast already fired there, and
  // a second failure toast for a background sync would just be noise.
  const triggerAlert = (id: string) => {
    const triggeredAt = Date.now();
    storeTriggerAlert(id, triggeredAt);

    if (!session) return;

    updateAlert(id, { enabled: false, triggeredAt }).catch(() => {});
  };

  const resetAlert = (id: string) => {
    storeResetAlert(id);

    if (!session) return;

    updateAlert(id, { enabled: true, triggeredAt: null }).catch(() => {
      toast.error(
        "Sync failed — your change was saved locally and will retry next time.",
      );
    });
  };

  return { addAlert, removeAlert, triggerAlert, resetAlert, isSubmitting };
}
