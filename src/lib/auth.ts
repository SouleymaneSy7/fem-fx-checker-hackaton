import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/db";
import * as userSchema from "@/db/schemas/user.schema";
import { redis } from "@/lib/redis";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: userSchema,
  }),

  emailAndPassword: {
    enabled: true,
  },

  // Redirect-flow OAuth — Better Auth handles the provider round-trip and
  // lands the user back on `callbackURL` (see oauth-buttons.tsx). Callback
  // URLs to register with each provider:
  //   {BETTER_AUTH_URL}/api/auth/callback/google
  //   {BETTER_AUTH_URL}/api/auth/callback/github
  socialProviders: {
    google: {
      // biome-ignore lint/style/noNonNullAssertion: GOOGLE_CLIENT_ID is guaranteed by .env.local and validated at startup
      clientId: process.env.GOOGLE_CLIENT_ID!,
      // biome-ignore lint/style/noNonNullAssertion: GOOGLE_CLIENT_SECRET is guaranteed by .env.local and validated at startup
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      // biome-ignore lint/style/noNonNullAssertion: GITHUB_CLIENT_ID is guaranteed by .env.local and validated at startup
      clientId: process.env.GITHUB_CLIENT_ID!,
      // biome-ignore lint/style/noNonNullAssertion: GITHUB_CLIENT_SECRET is guaranteed by .env.local and validated at startup
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

  baseURL: process.env.BETTER_AUTH_URL,

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },

  // Offloads session lookups + rate-limit counters onto Redis instead of
  // Postgres — matters most for getSession(), called on every
  // favorites/logs/alerts API request below.
  secondaryStorage: {
    get: (key) => redis.get(key),
    set: (key, value, ttl) =>
      ttl ? redis.set(key, value, { ex: ttl }) : redis.set(key, value),
    delete: async (key) => {
      await redis.del(key);
    },
  },

  // Disabled by default outside production — flip it on explicitly so
  // sign-in brute-force protection is active locally too.
  rateLimit: {
    enabled: true,
    storage: "secondary-storage",
  },

  // Lets `auth.api.*` calls (if ever used from a Server Action) set
  // cookies correctly under Next.js's Server Action cookie rules. Must
  // stay last in the plugins array per Better Auth's own docs.
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
