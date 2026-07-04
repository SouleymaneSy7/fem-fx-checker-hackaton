export type FetchCurrenciesOptionsType = {
  scope?: "all";
};

export type FetchRatesParamsType = {
  base?: string;
  quotes?: string[];
  date?: string;
  from?: string;
  to?: string;
  providers?: string[];
  group?: "week" | "month";
};
