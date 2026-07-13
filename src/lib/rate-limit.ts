import { Ratelimit } from "@upstash/ratelimit";

import {
  WRITE_RATE_LIMIT_REQUESTS,
  WRITE_RATE_LIMIT_WINDOW,
} from "@/constants";
import { redis } from "@/lib/redis";

// Guards every user-scoped write endpoint (favorites, log, and rate
// alerts mutations) — separate from Better Auth's own built-in limiter,
// which only covers its own auth routes (sign-in, sign-up, ...). 20
// writes/minute per user is generous for normal use (pinning pairs,
// logging conversions, creating alerts) while blocking a runaway client
// or script.
export const writeRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(
    WRITE_RATE_LIMIT_REQUESTS,
    WRITE_RATE_LIMIT_WINDOW,
  ),
  analytics: true,
  prefix: "fx-ratelimit-write",
});
