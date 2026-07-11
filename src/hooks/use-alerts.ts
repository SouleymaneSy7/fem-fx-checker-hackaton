"use client";

import { useAlertsStore } from "@/store/alerts-store";

export function useAlerts() {
  const alerts = useAlertsStore((state) => state.alerts);
  const removeAlert = useAlertsStore((state) => state.removeAlert);
  const resetAlert = useAlertsStore((state) => state.resetAlert);

  return { alerts, removeAlert, resetAlert };
}
