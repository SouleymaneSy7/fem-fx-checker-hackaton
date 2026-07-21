export const DEFAULT_FROM_CURRENCY = "USD";
export const DEFAULT_TO_CURRENCY = "EUR";
export const DEFAULT_AMOUNT = 1000;
export const TICKER_BASE_CURRENCY = "EUR";

export const TICKER_QUOTE_CURRENCIES: string[] = [
  "USD",
  "GBP",
  "JPY",
  "CHF",
  "AUD",
  "CAD",
  "CNY",
  "INR",
  "BDT",
  "GNF",
  "XOF",
];

export const DEFAULT_COMPARE_CURRENCIES: string[] = [
  "GBP",
  "JPY",
  "CHF",
  "CAD",
  "AUD",
  "INR",
  "CNY",
  "BDT",
];

// Seeds the chart's own currency selection on first load. Independent
// from the table afterward (compare-chart-currencies-store), but starts
// from the same 8 codes so a fresh session looks identical to before
// this split.
export const DEFAULT_CHART_CURRENCIES: string[] = DEFAULT_COMPARE_CURRENCIES;

export const POPULAR_CURRENCIES: string[] = ["USD", "EUR", "GBP", "JPY", "CHF"];

// Reusable line-series palette for the compare chart — assigned by
// position (index within the currently-selected chart currencies), not
// by currency identity. Length also drives MAX_CHART_CURRENCIES in
// constants/limits.ts, so adding a color here raises the cap too.
export const CHART_SERIES_COLORS: string[] = [
  "var(--chart-series-1)",
  "var(--chart-series-2)",
  "var(--chart-series-3)",
  "var(--chart-series-4)",
  "var(--chart-series-5)",
  "var(--chart-series-6)",
  "var(--chart-series-7)",
  "var(--chart-series-8)",
  "var(--chart-series-9)",
  "var(--chart-series-10)",
];
