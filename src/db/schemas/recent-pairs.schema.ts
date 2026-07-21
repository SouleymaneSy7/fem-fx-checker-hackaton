import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./user.schema";

export const recentPair = pgTable(
  "recent_pair",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    fromCurrency: text("from_currency").notNull(),
    toCurrency: text("to_currency").notNull(),
    // Drives ordering (most-recent-first) and gets bumped via GREATEST()
    // on every upsert in the POST handler, so a stale local timestamp
    // uploaded from another device on sign-in can never regress it.
    lastUsedAt: timestamp("last_used_at").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("recent_pair_user_pair_unique").on(
      table.userId,
      table.fromCurrency,
      table.toCurrency,
    ),
  ],
);
