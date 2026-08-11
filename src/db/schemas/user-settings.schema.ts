import {
  boolean,
  doublePrecision,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./user.schema";

// One row per user — created lazily on the first PATCH (see
// app/api/settings/route.ts) rather than at sign-up, so a brand-new
// account with zero saved preferences has no row at all rather than a
// row full of nulls. `userId` doubles as the primary key: a user only
// ever has exactly one settings row, unlike favorite/log_entry/
// rate_alert/recent_pair, which are one-to-many and need their own uuid.
//
// Every column is nullable (aside from the three with a hard default)
// and follows the same "null = defer to the app's own default" contract
// already used by PreferencesStoreType client-side — a column only ever
// holds a value once the person has actually changed that setting away
// from its default.
export const userSettings = pgTable("user_settings", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),

  // ── Converter defaults ────────────────────────────────────────────
  defaultFromCurrency: text("default_from_currency"),
  defaultToCurrency: text("default_to_currency"),
  defaultAmount: doublePrecision("default_amount"),
  defaultTab: text("default_tab"),

  // ── Display & data ─────────────────────────────────────────────────
  tickerQuoteCurrencies: text("ticker_quote_currencies").array(),
  decimalPrecision: integer("decimal_precision"),
  compareCurrencies: text("compare_currencies").array(),
  compareChartCurrencies: text("compare_chart_currencies").array(),

  // ── Alerts ─────────────────────────────────────────────────────────
  alertSoundEnabled: boolean("alert_sound_enabled").notNull().default(true),
  alertRefreshIntervalMs: integer("alert_refresh_interval_ms"),

  // ── Interface ──────────────────────────────────────────────────────
  theme: text("theme"),
  // null = follow the browser's prefers-reduced-motion; true/false is an
  // explicit override in either direction, independent of the OS setting.
  reducedMotion: boolean("reduced_motion"),
  tickerVisible: boolean("ticker_visible").notNull().default(true),
  tickerSpeedSeconds: integer("ticker_speed_seconds"),

  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date()),
});
