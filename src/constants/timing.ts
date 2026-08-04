export const DEBOUNCE_DEFAULT_MS = 300;
export const URL_SYNC_DEBOUNCE_MS = 500;
export const SWR_STALE_5M = 300_000;
export const SWR_STALE_1H = 3_600_000;
export const SWR_STALE_1D = 86_400_000;
export const SWR_RETRY_COUNT = 3;
export const SWR_RETRY_INTERVAL_MS = 5_000;
export const HTTP_TIMEOUT_MS = 10_000;

// Options surfaced in Settings > Preferences > Alerts (see
// alert-preferences-panel.tsx). Frankfurter only publishes a new EOD rate
// once per business day, so anything shorter than ~15 minutes wouldn't
// make alerts more "real-time" — it would just poll for the same
// unchanged rate more often.
export const ALERT_REFRESH_INTERVAL_OPTIONS: {
  label: string;
  value: number;
}[] = [
  { label: "Every 15 minutes", value: 1000 * 60 * 15 },
  { label: "Every 30 minutes", value: 1000 * 60 * 30 },
  { label: "Every hour", value: 1000 * 60 * 60 },
  { label: "Every 3 hours", value: 1000 * 60 * 60 * 3 },
  { label: "Every 6 hours", value: 1000 * 60 * 60 * 6 },
];
