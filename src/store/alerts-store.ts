import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { STORAGE_KEY_ALERTS } from "@/constants";
import type { AlertsStoreType, RateAlertType } from "@/types/data.types";
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

      removeAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.filter((alert) => alert.id !== id),
        })),

      triggerAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === id
              ? { ...alert, enabled: false, triggeredAt: Date.now() }
              : alert,
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
    }),
    {
      name: STORAGE_KEY_ALERTS,
      storage: createJSONStorage(() => safeLocalStorage),
    },
  ),
);
