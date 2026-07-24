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

/* ── TabNav ─────────────────────────────────────────────────── */

export type ConverterSectionValueType =
  | "history"
  | "compare"
  | "historicalRates"
  | "favorites"
  | "alerts"
  | "log";

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
  isFavoriteSyncing: boolean;
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

export type CompareCurrenciesStoreType = {
  currencies: string[];
  addCurrency: (code: string) => void;
  removeCurrency: (code: string) => void;
};

/* ── Compare Chart ─────────────────────────────────────────────────── */

export type CompareChartCurrenciesStoreType = {
  currencies: string[];
  addCurrency: (code: string) => void;
  removeCurrency: (code: string) => void;
};

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
  // Used once a server round-trip has assigned the real id — takes a
  // fully-formed alert rather than generating one, mirroring log-store's
  // addLoggedEntry.
  addSyncedAlert: (alert: RateAlertType) => void;
  removeAlert: (id: string) => void;
  // Takes an explicit timestamp so the mutation hook can use the exact
  // same value locally and in the server PATCH, rather than each side
  // computing its own Date.now() a few milliseconds apart.
  triggerAlert: (id: string, triggeredAt: number) => void;
  resetAlert: (id: string) => void;
  replaceAlerts: (alerts: RateAlertType[]) => void;
};

export type PendingAlertActionType = {
  id: string;
  fromCurrency: string;
  toCurrency: string;
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
  // Takes an explicit timestamp (rather than reading Date.now() inside
  // the store) so the mutation hook can send the exact same value to the
  // server — same reasoning as AlertsStoreType.triggerAlert above.
  addRecentPair: (
    fromCurrency: string,
    toCurrency: string,
    lastUsedAt: number,
  ) => void;
  removeRecentPair: (id: string) => void;
  replaceRecentPairs: (recentPairs: RecentPairType[]) => void;
};

export type SelectRecentPairDetail = {
  fromCurrency: string;
  toCurrency: string;
};

/* ── Next Route Context ─────────────────────────────────────────────────── */

export type RouteContextType = {
  params: Promise<{ id: string }>;
};

/* ── Historical Rates ─────────────────────────────────────────────────── */

export type HistoricalRatesResultType = {
  requestedDate: string;
  historicalDate: string;
  historicalRate: number;
  currentRate: number;
  currentDate: string;
  historicalAmount: number;
  currentAmount: number;
  absoluteChange: number;
  percentChange: number;
};

/* ── Bubble Background ─────────────────────────────────────────────────── */

export type BubbleColorsType = {
  first: string;
  second: string;
  third: string;
  fourth: string;
  fifth: string;
  sixth: string;
};
