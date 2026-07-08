import {
  doublePrecision,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./user.schema";

export const logEntry = pgTable("log_entry", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  fromCurrency: text("from_currency").notNull(),
  toCurrency: text("to_currency").notNull(),
  sendAmount: doublePrecision("send_amount").notNull(),
  receiveAmount: doublePrecision("receive_amount").notNull(),
  rate: doublePrecision("rate").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
