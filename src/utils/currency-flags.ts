// src/utils/currency-flags.ts

export const CURRENCY_FLAG_MAP: Record<string, string> = {
  AED: "ae",
  ARS: "ar",
  AUD: "au",
  BDT: "bd",
  BHD: "bh",
  BRL: "br",
  CAD: "ca",
  CHF: "ch",
  CLP: "cl",
  CNY: "cn",
  COP: "co",
  CZK: "cz",
  DKK: "dk",
  EGP: "eg",
  EUR: "eu",
  GBP: "gb",
  HKD: "hk",
  HNL: "hn",
  HTG: "ht",
  HUF: "hu",
  IDR: "id",
  INR: "in",
  ISK: "is",
  JOD: "jo",
  JPY: "jp",
  KES: "ke",
  KRW: "kr",
  KWD: "kw",
  LBP: "lb",
  XCD: "lc", // East Caribbean Dollar — Saint Lucia flag used as the representative
  LKR: "lk",
  MAD: "ma",
  MXN: "mx",
  MYR: "my",
  NGN: "ng",
  NOK: "no",
  NPR: "np",
  NZD: "nz",
  OMR: "om",
  PEN: "pe",
  PHP: "ph",
  PKR: "pk",
  PLN: "pl",
  QAR: "qa",
  RON: "ro",
  RUB: "ru",
  SAR: "sa",
  SEK: "se",
  SGD: "sg",
  THB: "th",
  TRY: "tr",
  TWD: "tw",
  UAH: "ua",
  USD: "us",
  VND: "vn",
  ZAR: "za",
};

export function getCurrencyFlagCode(currencyCode: string): string | null {
  if (!currencyCode) return null;

  const code = currencyCode.toUpperCase().trim();
  return CURRENCY_FLAG_MAP[code] || null;
}

export function getCurrencyFlagPath(currencyCode: string): string | null {
  const countryCode = getCurrencyFlagCode(currencyCode);
  return countryCode ? `/assets/flags/${countryCode}.webp` : null;
}
