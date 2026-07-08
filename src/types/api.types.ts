import type z from "zod";
import type { currencySchema } from "@/services/currencies.service";

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

export type FrankfurterCurrencyType = z.infer<typeof currencySchema>;
