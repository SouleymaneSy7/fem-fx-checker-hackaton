import { z } from "zod";

export const DEFAULT_FROM_CURRENCY = "USD";
export const DEFAULT_TO_CURRENCY = "EUR";
export const DEFAULT_AMOUNT = 1000;

export const currencyCodeSchema = (fallback: string) =>
  z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{3}$/)
    .catch(fallback);

// `URLSearchParams.get()` returns `string | null` — every field below must
// tolerate a missing key (null) exactly as gracefully as it tolerates a
// garbled one, falling back instead of throwing either way.
export const converterSearchParamsSchema = z.object({
  from: currencyCodeSchema(DEFAULT_FROM_CURRENCY),
  to: currencyCodeSchema(DEFAULT_TO_CURRENCY),
  amount: z.coerce.number().finite().positive().catch(DEFAULT_AMOUNT),
});
