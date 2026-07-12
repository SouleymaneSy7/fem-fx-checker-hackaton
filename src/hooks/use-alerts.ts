"use client";

import { useAlertsStore } from "@/store/alerts-store";

export function useAlerts() {
  const alerts = useAlertsStore((state) => state.alerts);

  return { alerts };
}
