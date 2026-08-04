import type { ConverterSectionValueType } from "./converter.types";

export type DecimalPrecisionType = 2 | 4 | 6;

// Every field defaults to `null` (or, for `alertSoundEnabled`, a plain
// boolean) rather than a concrete app value — `null` means "use whatever
// the app's own default already is" everywhere this store gets read
// (converter-url-sync.tsx, header.tsx, format-amount.ts,
// use-alerts-watcher.ts). A preference only overrides the app default
// once the person explicitly sets one from Settings.
export type PreferencesStoreType = {
  defaultFromCurrency: string | null;
  defaultToCurrency: string | null;
  defaultAmount: number | null;
  defaultTab: ConverterSectionValueType | null;
  tickerQuoteCurrencies: string[] | null;
  decimalPrecision: DecimalPrecisionType | null;
  alertSoundEnabled: boolean;
  alertRefreshIntervalMs: number | null;

  setDefaultFromCurrency: (code: string | null) => void;
  setDefaultToCurrency: (code: string | null) => void;
  setDefaultAmount: (amount: number | null) => void;
  setDefaultTab: (tab: ConverterSectionValueType | null) => void;
  setTickerQuoteCurrencies: (currencies: string[] | null) => void;
  setDecimalPrecision: (precision: DecimalPrecisionType | null) => void;
  setAlertSoundEnabled: (enabled: boolean) => void;
  setAlertRefreshIntervalMs: (ms: number | null) => void;
  resetPreferences: () => void;
};
