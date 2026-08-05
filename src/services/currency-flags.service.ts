import { ENDPOINT_CURRENCIES, FLAG_CDN_URL } from "@/constants";
import type { CurrencyType } from "@/types";
import { currenciesSchema } from "@/validators";
import { httpClient } from "./http-client";

export async function fetchCurrenciesForFlags(): Promise<CurrencyType[]> {
  const { data } = await httpClient.get(ENDPOINT_CURRENCIES);

  return currenciesSchema.parse(data);
}

// ISO 4217 mostly reuses the ISO 3166-1 country code as the currency
// code's first two letters (USD -> US, GBP -> GB, ...), which is what
// the slice below leans on. It breaks for currencies issued by a
// currency union or a supranational body rather than a single country —
// slicing those would build a flag URL for a country code that doesn't
// exist (e.g. "xo" for XOF), which flagcdn 404s on. Those codes are
// listed here so getCurrencyFlagCode can fall back to null instead.
const CURRENCY_CODES_WITHOUT_COUNTRY_FLAG = new Set([
  "ANG", // Netherlands Antillean guilder (Curaçao & Sint Maarten)
  "XAF", // Central African CFA franc
  "XCD", // East Caribbean dollar
  "XDR", // IMF Special Drawing Rights
  "XOF", // West African CFA franc
  "XPF", // CFP franc
  "XPT", // Platinum (precious metal, no country)
  "XPD", // Palladium (precious metal, no country)
  "XCG", // Caribbean guilder (Curaçao & Sint Maarten)
  "XAG", // Silver (precious metal, no country)
  "XAU", // Gold (precious metal, no country)
]);

export function getCurrencyFlagCode(currencyCode: string): string | null {
  if (!currencyCode) return null;
  const code = currencyCode.toUpperCase().trim();

  if (CURRENCY_CODES_WITHOUT_COUNTRY_FLAG.has(code)) return null;

  return code.slice(0, 2).toLowerCase();
}

export function getCurrencyFlagUrl(currencyCode: string): string | null {
  const countryCode = getCurrencyFlagCode(currencyCode);
  if (!countryCode) return null;

  return `${FLAG_CDN_URL}/${countryCode.toLowerCase()}.svg`;
}
