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
  removeEntry: (id: string) => void;
  removeEntriesForPair: (fromCurrency: string, toCurrency: string) => void;
  clearLog: () => void;
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
};

/* ── Ticker ─────────────────────────────────────────────────── */
