import z from "zod";

export const currencySchema = z.object({
  iso_code: z.string(),
  iso_numeric: z.string().nullable(),
  name: z.string(),
  symbol: z.string().nullable(),
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
});

export const rateSchema = z.object({
  date: z.string(),
  base: z.string(),
  quote: z.string(),
  rate: z.number(),
});

export const currenciesSchema = z.array(currencySchema);

export const ratesSchema = z.array(rateSchema);
