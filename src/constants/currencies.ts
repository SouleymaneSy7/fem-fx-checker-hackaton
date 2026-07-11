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

export const POPULAR_CURRENCIES: string[] = ["USD", "EUR", "GBP", "JPY", "CHF"];

// One color per currency in DEFAULT_COMPARE_CURRENCIES, each loosely
// anchored to that currency's flag but hue-spaced so all 8 stay
// distinguishable side by side on the compare chart — several of these
// flags are red/white/blue, so a literal 1:1 color match would produce a
// near-monochrome, unreadable chart.
export const CURRENCY_CHART_COLORS: Record<string, string> = {
  GBP: "var(--currency-gbp)",
  JPY: "var(--currency-jpy)",
  CHF: "var(--currency-chf)",
  CAD: "var(--currency-cad)",
  AUD: "var(--currency-aud)",
  INR: "var(--currency-inr)",
  CNY: "var(--currency-cny)",
  BDT: "var(--currency-bdt)",
};
