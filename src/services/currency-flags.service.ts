import { ENDPOINT_CURRENCIES, FLAG_CDN_URL } from "@/constants";
import { currenciesSchema } from "@/schemas";
import type { CurrencyType } from "@/types/api.types";
import { httpClient } from "./http-client";

export async function fetchCurrenciesForFlags(): Promise<CurrencyType[]> {
  const { data } = await httpClient.get(ENDPOINT_CURRENCIES);

  return currenciesSchema.parse(data);
}

export function getCurrencyFlagCode(currencyCode: string): string | null {
  if (!currencyCode) return null;
  const code = currencyCode.toUpperCase().trim();

  return code.slice(0, 2).toLowerCase();
}

export function getCurrencyFlagUrl(currencyCode: string): string | null {
  const countryCode = getCurrencyFlagCode(currencyCode);
  if (!countryCode) return null;

  return `${FLAG_CDN_URL}/${countryCode.toLowerCase()}.svg`;
}
