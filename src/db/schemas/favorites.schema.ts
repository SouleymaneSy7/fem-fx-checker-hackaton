import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./user.schema";

export const favorite = pgTable(
  "favorite",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    fromCurrency: text("from_currency").notNull(),
    toCurrency: text("to_currency").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("favorite_user_pair_unique").on(
      table.userId,
      table.fromCurrency,
      table.toCurrency,
    ),
  ],
);
