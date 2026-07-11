"use client";

import { useAlertsWatcher } from "@/hooks/use-alerts-watcher";

// Mounted once at the root layout so rate alerts keep watching regardless
// of which tab is active — this component has no visual output.
const AlertsWatcher = () => {
  useAlertsWatcher();

  return null;
};

export default AlertsWatcher;
