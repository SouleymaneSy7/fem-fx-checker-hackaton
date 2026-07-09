import { z } from "zod";

const currencyCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{3}$/, "3-letter currency code required");

export const createLogEntrySchema = z.object({
  fromCurrency: currencyCodeSchema,
  toCurrency: currencyCodeSchema,
  sendAmount: z.number().positive(),
  receiveAmount: z.number().positive(),
  rate: z.number().positive(),
});
