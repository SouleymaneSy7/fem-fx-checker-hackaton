export type RateAlertConditionType = "above" | "below";

export type RateAlertType = {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  condition: RateAlertConditionType;
  threshold: number;
  enabled: boolean;
  createdAt: number;
  triggeredAt: number | null;
};

export type AlertsStoreType = {
  alerts: RateAlertType[];
  addAlert: (
    alert: Omit<RateAlertType, "id" | "createdAt" | "triggeredAt" | "enabled">,
  ) => void;
  addSyncedAlert: (alert: RateAlertType) => void;
  removeAlert: (id: string) => void;
  triggerAlert: (id: string, triggeredAt: number) => void;
  resetAlert: (id: string) => void;
  replaceAlerts: (alerts: RateAlertType[]) => void;
};

export type PendingAlertActionType = {
  id: string;
  fromCurrency: string;
  toCurrency: string;
};
