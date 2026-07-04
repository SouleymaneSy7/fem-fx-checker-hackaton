import { z } from "zod";

import type { FetchCurrenciesOptionsType } from "@/types/api.types";
import { httpClient } from "./http-client";

export const currencySchema = z.object({
  iso_code: z.string(),
  iso_numeric: z.string().nullable(),
  name: z.string(),
  symbol: z.string().nullable(),
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
});

export const currenciesSchema = z.array(currencySchema);

export type CurrencyType = z.infer<typeof currencySchema>;

export async function fetchCurrencies(
  options: FetchCurrenciesOptionsType = {},
): Promise<CurrencyType[]> {
  const { data } = await httpClient.get("/currencies", {
    params: options.scope ? { scope: options.scope } : undefined,
  });

  return currenciesSchema.parse(data);
}
