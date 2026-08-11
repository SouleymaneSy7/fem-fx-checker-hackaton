import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";

import { TEST_ACCOUNT_EMAIL } from "@/constants";
import { db } from "@/db";
import * as userSchema from "@/db/schemas/user.schema";
import { env } from "@/env";
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
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },

  baseURL: env.BETTER_AUTH_URL,

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

  user: {
    deleteUser: {
      enabled: true,
      // No `sendDeleteAccountVerification` here on purpose: that hook
      // emails a confirmation link, and without a verified Resend
      // sending domain, Resend's sandbox mode only delivers to the
      // Resend account owner's own address — so the email silently
      // failed to reach every real OAuth-only user, and `sendEmail`
      // throwing on that rejection aborted the whole deleteUser() call.
      //
      // Leaving this hook unset doesn't remove the safety check —
      // Better Auth falls back to its own built-in session freshness
      // check instead (`session.freshAge`, defaults to 24h): deleting
      // without a password is only allowed if the current session was
      // created within that window, otherwise it throws SESSION_EXPIRED
      // and the person has to sign in again first. A password-holding
      // account still re-confirms via
      // `authClient.deleteUser({ password })` (see
      // danger-zone-panel.tsx) — that path is unaffected.
      beforeDelete: async (user) => {
        if (user.email === TEST_ACCOUNT_EMAIL) {
          throw new APIError("BAD_REQUEST", {
            message: "Deletion is disabled for the shared demo account.",
          });
        }
      },
    },
  },

  // Lets `auth.api.*` calls (if ever used from a Server Action) set
  // cookies correctly under Next.js's Server Action cookie rules. Must
  // stay last in the plugins array per Better Auth's own docs.
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
