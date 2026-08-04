import { CHART_SERIES_COLORS } from "./currencies";

export const MAX_LOG_ENTRIES = 100;
export const MAX_RECENT_PAIRS = 8;
export const HISTORICAL_RATES_MIN_DATE = "1999-01-04";
export const WRITE_RATE_LIMIT_REQUESTS = 20;
export const WRITE_RATE_LIMIT_WINDOW = "1 m";
// Derived from the palette length rather than hardcoded — adding a 11th
// color to CHART_SERIES_COLORS raises this cap automatically.
export const MAX_CHART_CURRENCIES = CHART_SERIES_COLORS.length;

// Email-change OTP (see lib/email-change-otp.ts) — restated explicitly
// here so that file and any Settings copy referencing "6-digit code" /
// "10 minutes" share one source of truth instead of repeating magic
// numbers.
export const EMAIL_OTP_LENGTH = 6;
export const EMAIL_OTP_EXPIRY_SECONDS = 60 * 10;

// Client-side avatar downscale (see utils/resize-image.ts) — keeps the
// data URI small enough to store directly in Better Auth's `user.image`
// text column without a dedicated blob storage service.
export const AVATAR_MAX_DIMENSION = 256;
export const AVATAR_JPEG_QUALITY = 0.85;
export const AVATAR_MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB
