import * as z from "zod";
import { currencyCodeSchema } from "./currency";

export const createLogEntrySchema = z.object({
  fromCurrency: currencyCodeSchema,
  toCurrency: currencyCodeSchema,
  sendAmount: z.number().positive(),
  receiveAmount: z.number().positive(),
  rate: z.number().positive(),
});
