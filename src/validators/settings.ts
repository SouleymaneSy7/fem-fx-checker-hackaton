import * as z from "zod";

import { MAX_CHART_CURRENCIES } from "@/constants";
import { currencyCodeSchema } from "./currency";

const settingsTabSchema = z.enum([
  "history",
  "compare",
  "historicalRates",
  "favorites",
  "alerts",
  "log",
]);

const decimalPrecisionSchema = z.union([
  z.literal(2),
  z.literal(4),
  z.literal(6),
]);

const themeSchema = z.enum(["dark", "light"]);

// Every field optional (via `.partial()`) and independently nullable — a
// PATCH only ever sends whichever fields actually changed (see
// services/settings.service.ts), and `null` is how a client resets a
// field back to "use the app default", mirroring PreferencesStoreType's
// own null-means-default convention at the DB layer.
export const updateSettingsSchema = z
  .object({
    defaultFromCurrency: currencyCodeSchema.nullable(),
    defaultToCurrency: currencyCodeSchema.nullable(),
    defaultAmount: z.number().positive().nullable(),
    defaultTab: settingsTabSchema.nullable(),

    tickerQuoteCurrencies: z.array(currencyCodeSchema).nullable(),
    decimalPrecision: decimalPrecisionSchema.nullable(),
    compareCurrencies: z.array(currencyCodeSchema).nullable(),
    compareChartCurrencies: z
      .array(currencyCodeSchema)
      .max(MAX_CHART_CURRENCIES)
      .nullable(),

    alertSoundEnabled: z.boolean(),
    alertRefreshIntervalMs: z.number().positive().nullable(),

    theme: themeSchema.nullable(),
    reducedMotion: z.boolean().nullable(),
    tickerVisible: z.boolean(),
    tickerSpeedSeconds: z.number().min(5).max(120).nullable(),
  })
  .partial();
