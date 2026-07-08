import { z } from "zod";
import type { FrankfurterCurrencyType } from "@/types/api.types";
import { currencySchema } from "./currencies.service";
import { httpClient } from "./http-client";

export const frankfurterCurrenciesSchema = z.array(currencySchema);

const MAP: Record<string, string> = {
  EUR: "eu",
  USD: "us",
  GBP: "gb",
  JPY: "jp",
  CNY: "cn",
};

export async function fetchCurrenciesForFlags(): Promise<
  FrankfurterCurrencyType[]
> {
  const { data } = await httpClient.get("/currencies");
  return frankfurterCurrenciesSchema.parse(data);
}

export function getCurrencyFlagCode(currencyCode: string): string | null {
  if (!currencyCode) return null;
  const code = currencyCode.toUpperCase().trim();

  return MAP[code] || code.slice(0, 2).toLowerCase(); // fallback basique
}

export function getCurrencyFlagUrl(currencyCode: string): string | null {
  const countryCode = getCurrencyFlagCode(currencyCode);
  if (!countryCode) return null;

  return `https://flagcdn.com/${countryCode.toLowerCase()}.svg`;
}
