import * as z from "zod";
import { currencyCodeSchema } from "./currency";

export const createFavoriteSchema = z.object({
  fromCurrency: currencyCodeSchema,
  toCurrency: currencyCodeSchema,
});
