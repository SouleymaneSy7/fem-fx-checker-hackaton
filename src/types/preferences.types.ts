import type { ConverterSectionValueType } from "./converter.types";

export type DecimalPrecisionType = 2 | 4 | 6;

// Every field defaults to `null` (or, for `alertSoundEnabled` and
// `tickerVisible`, a plain boolean) rather than a concrete app value —
// `null` means "use whatever the app's own default already is"
// everywhere this store gets read (converter-url-sync.tsx, header.tsx,
// format-amount.ts, use-alerts-watcher.ts, hooks/use-reduced-motion.ts).
// A preference only overrides the app default once the person explicitly
// sets one from Settings.
export type PreferencesStoreType = {
  defaultFromCurrency: string | null;
  defaultToCurrency: string | null;
  defaultAmount: number | null;
  defaultTab: ConverterSectionValueType | null;
  tickerQuoteCurrencies: string[] | null;
  decimalPrecision: DecimalPrecisionType | null;
  alertSoundEnabled: boolean;
  alertRefreshIntervalMs: number | null;
  // null = follow the OS's prefers-reduced-motion; true/false is an
  // explicit override in either direction.
  reducedMotion: boolean | null;
  tickerVisible: boolean;
  tickerSpeedSeconds: number | null;

  setDefaultFromCurrency: (code: string | null) => void;
  setDefaultToCurrency: (code: string | null) => void;
  setDefaultAmount: (amount: number | null) => void;
  setDefaultTab: (tab: ConverterSectionValueType | null) => void;
  setTickerQuoteCurrencies: (currencies: string[] | null) => void;
  setDecimalPrecision: (precision: DecimalPrecisionType | null) => void;
  setAlertSoundEnabled: (enabled: boolean) => void;
  setAlertRefreshIntervalMs: (ms: number | null) => void;
  setReducedMotion: (value: boolean | null) => void;
  setTickerVisible: (visible: boolean) => void;
  setTickerSpeedSeconds: (seconds: number | null) => void;
  resetPreferences: () => void;
};
