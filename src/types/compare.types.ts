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
