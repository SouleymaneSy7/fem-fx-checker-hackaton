import * as z from "zod";
import { currencyCodeSchema } from "./currency";

export const createRecentPairSchema = z.object({
  fromCurrency: currencyCodeSchema,
  toCurrency: currencyCodeSchema,
  lastUsedAt: z.number().positive(),
});
