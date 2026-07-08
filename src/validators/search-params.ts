import { z } from "zod";
import {
  DEFAULT_AMOUNT,
  DEFAULT_FROM_CURRENCY,
  DEFAULT_TO_CURRENCY,
} from "@/constants";

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
