/* ── Converter ─────────────────────────────────────────────────── */

export type ConverterStoreType = {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  setAmount: (amount: number) => void;
  setFromCurrency: (code: string) => void;
  setToCurrency: (code: string) => void;
  swapCurrencies: () => void;
};

/* ── Favorites ─────────────────────────────────────────────────── */

export type FavoritePairType = {
  id: string;
  fromCurrency: string;
  toCurrency: string;
};

export type FavoritesStoreType = {
  favorites: FavoritePairType[];
  pinPair: (fromCurrency: string, toCurrency: string) => void;
  unpinPair: (id: string) => void;
  isPinned: (fromCurrency: string, toCurrency: string) => boolean;
  replaceFavorites: (favorites: FavoritePairType[]) => void;
};

export type FavoriteRowType = FavoritePairType & {
  rate: number | undefined;
  changePercent: number | undefined;
};

/* ── Log ─────────────────────────────────────────────────── */

export type LogEntryType = {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  sendAmount: number;
  receiveAmount: number;
  rate: number;
  createdAt: number;
};

export type LogStoreType = {
  entries: LogEntryType[];
  addEntry: (entry: Omit<LogEntryType, "id" | "createdAt">) => void;
  addLoggedEntry: (entry: LogEntryType) => void;
  removeEntry: (id: string) => void;
  removeEntriesForPair: (fromCurrency: string, toCurrency: string) => void;
  clearLog: () => void;
  replaceEntries: (entries: LogEntryType[]) => void;
};

/* ── Rate ─────────────────────────────────────────────────── */

export type RateRangeType = "1d" | "1w" | "1m" | "3m" | "1y" | "5y";

export type RatePointType = {
  date: string;
  rate: number;
};

/* ── Ticker ─────────────────────────────────────────────────── */

export type TickerEntryType = {
  currency: string;
  rate: number;
  change: { absolute: number; percentage: number } | null;
};

/* ── Compare ─────────────────────────────────────────────────── */

export type CompareRowType = {
  currency: string;
  rate: number | undefined;
  convertedAmount: number | undefined;
  isPinned: boolean;
  isFavoriteSyncing: boolean;
};

/* ── Compare Chart ─────────────────────────────────────────────────── */

// Recharts needs one flat object per date, with each currency as its own
// key — `date` is always present and typed precisely; every other key is
// a currency code holding either that currency's percent change (or, when
// suffixed with `_raw`, its actual rate) relative to the range's starting
// rate.
export type CompareChartPointType = {
  date: string;
  [currencyCode: string]: string | number;
};

export type CompareChartMoverType = {
  currency: string;
  changePercent: number;
};

/* ── Theme ─────────────────────────────────────────────────── */

export type ThemeType = "dark" | "light";

export type ThemeStoreType = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
};

/* ── KeyboardShortcuts ─────────────────────────────────────────────────── */

export type FocusCurrencySearchDetail = { target: "send" | "receive" };
export type SetRateRangeDetail = { range: RateRangeType };

/* ── Alerts ─────────────────────────────────────────────────── */

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
  removeAlert: (id: string) => void;
  triggerAlert: (id: string) => void;
  resetAlert: (id: string) => void;
};

/* ── Recent Pairs ─────────────────────────────────────────────────── */

export type RecentPairType = {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  lastUsedAt: number;
};

export type RecentPairsStoreType = {
  recentPairs: RecentPairType[];
  addRecentPair: (fromCurrency: string, toCurrency: string) => void;
};

export type SelectRecentPairDetail = {
  fromCurrency: string;
  toCurrency: string;
};
