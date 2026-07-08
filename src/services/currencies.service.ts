import { currenciesSchema } from "@/schemas";
import type {
  CurrencyType,
  FetchCurrenciesOptionsType,
} from "@/types/api.types";
import { httpClient } from "./http-client";

export async function fetchCurrencies(
  options: FetchCurrenciesOptionsType = {},
): Promise<CurrencyType[]> {
  const { data } = await httpClient.get("/currencies", {
    params: options.scope ? { scope: options.scope } : undefined,
  });

  return currenciesSchema.parse(data);
}
