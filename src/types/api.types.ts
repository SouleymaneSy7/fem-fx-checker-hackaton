import type z from "zod";

import type {
  converterSearchParamsSchema,
  currencySchema,
  rateSchema,
} from "@/schemas";

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

export type CurrencyType = z.infer<typeof currencySchema>;

export type RateType = z.infer<typeof rateSchema>;

export type ConverterSearchParamsType = z.infer<
  typeof converterSearchParamsSchema
>;
