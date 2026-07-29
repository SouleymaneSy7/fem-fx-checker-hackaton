export type ConverterStoreType = {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  setAmount: (amount: number) => void;
  setFromCurrency: (code: string) => void;
  setToCurrency: (code: string) => void;
  swapCurrencies: () => void;
};

export type ConverterSectionValueType =
  | "history"
  | "compare"
  | "historicalRates"
  | "favorites"
  | "alerts"
  | "log";
