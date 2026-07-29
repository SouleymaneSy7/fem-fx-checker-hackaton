import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { STORAGE_KEY_ALERTS } from "@/constants";
import type { AlertsStoreType, RateAlertType } from "@/types";
import { safeLocalStorage } from "@/utils/safe-storage";

export const useAlertsStore = create<AlertsStoreType>()(
  persist(
    (set) => ({
      alerts: [],

      addAlert: (alert) =>
        set((state) => {
          const newAlert: RateAlertType = {
            ...alert,
            id: crypto.randomUUID(),
            enabled: true,
            createdAt: Date.now(),
            triggeredAt: null,
          };

          return { alerts: [newAlert, ...state.alerts] };
        }),

      addSyncedAlert: (alert) =>
        set((state) => ({ alerts: [alert, ...state.alerts] })),

      removeAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.filter((alert) => alert.id !== id),
        })),

      triggerAlert: (id, triggeredAt) =>
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === id ? { ...alert, enabled: false, triggeredAt } : alert,
          ),
        })),

      resetAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === id
              ? { ...alert, enabled: true, triggeredAt: null }
              : alert,
          ),
        })),

      // Wholesale swap-in of the server's canonical list — used once on
      // sign-in by AccountSync, mirrors favorites/log's own replace action.
      replaceAlerts: (alerts) => set({ alerts }),
    }),
    {
      name: STORAGE_KEY_ALERTS,
      storage: createJSONStorage(() => safeLocalStorage),
    },
  ),
);
