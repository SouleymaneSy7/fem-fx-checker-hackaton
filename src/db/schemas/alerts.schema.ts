import {
  boolean,
  doublePrecision,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./user.schema";

export const rateAlert = pgTable("rate_alert", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  fromCurrency: text("from_currency").notNull(),
  toCurrency: text("to_currency").notNull(),
  // Stored as plain text rather than a pg enum, consistent with how
  // currency codes are validated at the Zod layer rather than the DB
  // layer elsewhere in this schema.
  condition: text("condition").notNull(),
  threshold: doublePrecision("threshold").notNull(),
  enabled: boolean("enabled").notNull().default(true),
  triggeredAt: timestamp("triggered_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
