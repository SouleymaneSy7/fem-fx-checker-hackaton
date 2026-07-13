import type * as z from "zod";

import type { favorite, logEntry, rateAlert } from "@/db/schema";
import type {
  converterSearchParamsSchema,
  createAlertSchema,
  createFavoriteSchema,
  createLogEntrySchema,
  currencySchema,
  rateSchema,
  signInSchema,
  signUpSchema,
  updateAlertSchema,
} from "@/validators";

export type FetchCurrenciesOptionsType = {
  scope?: "all";
};

export type FetchRatesParamsType = {
  base?: string;
  quotes?: string[];
  date?: string;
  from?: string;
  to?: string;
  providers?: string[];
  group?: "week" | "month";
};

export type CurrencyType = z.infer<typeof currencySchema>;

export type RateType = z.infer<typeof rateSchema>;

export type ConverterSearchParamsType = z.infer<
  typeof converterSearchParamsSchema
>;

export type SignInSchemaType = z.infer<typeof signInSchema>;

export type SignUpSchemaType = z.infer<typeof signUpSchema>;

export type CreateFavoriteInputType = z.infer<typeof createFavoriteSchema>;

export type CreateLogEntryInputType = z.infer<typeof createLogEntrySchema>;

export type CreateAlertInputType = z.infer<typeof createAlertSchema>;

export type UpdateAlertInputType = z.infer<typeof updateAlertSchema>;

export type FavoriteRowType = Omit<
  typeof favorite.$inferSelect,
  "createdAt"
> & {
  createdAt: string;
};

export type LogEntryRowType = Omit<
  typeof logEntry.$inferSelect,
  "createdAt"
> & {
  createdAt: string;
};

export type AlertRowType = Omit<
  typeof rateAlert.$inferSelect,
  "createdAt" | "triggeredAt"
> & {
  createdAt: string;
  triggeredAt: string | null;
};
