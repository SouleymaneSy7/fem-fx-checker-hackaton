// TODO: Have to delete this file

/**
 * TEMPORARY placeholder dataset — just enough to demo every panel end to
 * end. Delete this file once the real currencies/rates services and the
 * converter Zustand store are wired in.
 */

export const PLACEHOLDER_CURRENCIES = [
  { code: "USD", name: "US Dollar", flag: "us" },
  { code: "EUR", name: "Euro", flag: "eu" },
  { code: "GBP", name: "British Pound", flag: "gb" },
  { code: "JPY", name: "Japanese Yen", flag: "jp" },
  { code: "CHF", name: "Swiss Franc", flag: "ch" },
  { code: "AUD", name: "Australian Dollar", flag: "au" },
  { code: "CAD", name: "Canadian Dollar", flag: "ca" },
  { code: "AED", name: "UAE Dirham", flag: "ae" },
  { code: "ARS", name: "Argentine Peso", flag: "ar" },
  { code: "BDT", name: "Bangladeshi Taka", flag: "bd" },
  { code: "BHD", name: "Bahraini Dinar", flag: "bh" },
  { code: "BRL", name: "Brazilian Real", flag: "br" },
  { code: "CLP", name: "Chilean Peso", flag: "cl" },
  { code: "CNY", name: "Chinese Yuan", flag: "cn" },
  { code: "COP", name: "Colombian Peso", flag: "co" },
  { code: "CZK", name: "Czech Koruna", flag: "cz" },
  { code: "DKK", name: "Danish Krone", flag: "dk" },
  { code: "EGP", name: "Egyptian Pound", flag: "eg" },
  { code: "HKD", name: "Hong Kong Dollar", flag: "hk" },
  { code: "HNL", name: "Honduran Lempira", flag: "hn" },
  { code: "HTG", name: "Haitian Gourde", flag: "ht" },
  { code: "HUF", name: "Hungarian Forint", flag: "hu" },
  { code: "IDR", name: "Indonesian Rupiah", flag: "id" },
  { code: "INR", name: "Indian Rupee", flag: "in" },
  { code: "ISK", name: "Icelandic Króna", flag: "is" },
  { code: "JOD", name: "Jordanian Dinar", flag: "jo" },
  { code: "KES", name: "Kenyan Shilling", flag: "ke" },
  { code: "KRW", name: "South Korean Won", flag: "kr" },
  { code: "KWD", name: "Kuwaiti Dinar", flag: "kw" },
  { code: "LBP", name: "Lebanese Pound", flag: "lb" },
  { code: "XCD", name: "East Caribbean Dollar", flag: "lc" },
  { code: "LKR", name: "Sri Lankan Rupee", flag: "lk" },
  { code: "MAD", name: "Moroccan Dirham", flag: "ma" },
  { code: "MXN", name: "Mexican Peso", flag: "mx" },
  { code: "MYR", name: "Malaysian Ringgit", flag: "my" },
  { code: "NGN", name: "Nigerian Naira", flag: "ng" },
  { code: "NOK", name: "Norwegian Krone", flag: "no" },
  { code: "NPR", name: "Nepalese Rupee", flag: "np" },
  { code: "NZD", name: "New Zealand Dollar", flag: "nz" },
  { code: "OMR", name: "Omani Rial", flag: "om" },
  { code: "PEN", name: "Peruvian Sol", flag: "pe" },
  { code: "PHP", name: "Philippine Peso", flag: "ph" },
  { code: "PKR", name: "Pakistani Rupee", flag: "pk" },
  { code: "PLN", name: "Polish Złoty", flag: "pl" },
  { code: "QAR", name: "Qatari Riyal", flag: "qa" },
  { code: "RON", name: "Romanian Leu", flag: "ro" },
  { code: "RUB", name: "Russian Ruble", flag: "ru" },
  { code: "SAR", name: "Saudi Riyal", flag: "sa" },
  { code: "SEK", name: "Swedish Krona", flag: "se" },
  { code: "SGD", name: "Singapore Dollar", flag: "sg" },
  { code: "THB", name: "Thai Baht", flag: "th" },
  { code: "TRY", name: "Turkish Lira", flag: "tr" },
  { code: "TWD", name: "New Taiwan Dollar", flag: "tw" },
  { code: "UAH", name: "Ukrainian Hryvnia", flag: "ua" },
  { code: "VND", name: "Vietnamese Dong", flag: "vn" },
  { code: "ZAR", name: "South African Rand", flag: "za" },
];

const PLACEHOLDER_RATE_TO_USD: Record<string, number> = {
  USD: 1,
  EUR: 0.853,
  GBP: 0.7345,
  JPY: 157.91,
  CHF: 0.9098,
  AUD: 1.387,
  CAD: 1.3815,
};

export const PLACEHOLDER_CHANGE_PERCENT: Record<string, number> = {
  EUR: 0.16,
  GBP: -0.22,
  JPY: 0.04,
  CHF: 0.13,
  AUD: 0.08,
  CAD: 0.04,
};

export const getPlaceholderRate = (from: string, to: string) =>
  (PLACEHOLDER_RATE_TO_USD[to] ?? 1) / (PLACEHOLDER_RATE_TO_USD[from] ?? 1);
