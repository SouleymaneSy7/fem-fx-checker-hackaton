import { CHART_SERIES_COLORS } from "./currencies";

export const MAX_LOG_ENTRIES = 100;
export const MAX_RECENT_PAIRS = 8;
export const HISTORICAL_RATES_MIN_DATE = "1999-01-04";
export const WRITE_RATE_LIMIT_REQUESTS = 20;
export const WRITE_RATE_LIMIT_WINDOW = "1 m";
// Derived from the palette length rather than hardcoded — adding a 11th
// color to CHART_SERIES_COLORS raises this cap automatically.
export const MAX_CHART_CURRENCIES = CHART_SERIES_COLORS.length;
