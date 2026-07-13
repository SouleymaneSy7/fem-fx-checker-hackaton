import * as z from "zod";

const currencyCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{3}$/, "3-letter currency code required");

const alertConditionSchema = z.enum(["above", "below"]);

export const createAlertSchema = z.object({
  fromCurrency: currencyCodeSchema,
  toCurrency: currencyCodeSchema,
  condition: alertConditionSchema,
  threshold: z.number().positive(),
});

export const updateAlertSchema = z.object({
  enabled: z.boolean(),
  triggeredAt: z.number().nullable(),
});
