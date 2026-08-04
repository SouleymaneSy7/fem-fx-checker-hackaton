import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";

import { TEST_ACCOUNT_EMAIL } from "@/constants";
import { db } from "@/db";
import * as userSchema from "@/db/schemas/user.schema";
import { sendEmail } from "@/lib/email";
import { redis } from "@/lib/redis";
import { env } from "@/env";

function buildDeleteAccountEmailHtml(
  userName: string,
  confirmUrl: string,
): string {
  return `
    <div style="font-family: monospace, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background-color: #0A0A0A; color: #FFFFFF;">
      <p style="font-size: 20px; font-weight: 700; color: #CEF739; margin: 0 0 24px;">FX Checker</p>
      <p style="font-size: 14px; line-height: 1.5; margin: 0 0 16px;">Hi ${userName}, we received a request to permanently delete your FX Checker account.</p>
      <p style="margin: 0 0 24px;">
        <a href="${confirmUrl}" style="display: inline-block; padding: 12px 24px; background-color: #CEF739; color: #0A0A0A; text-decoration: none; border-radius: 10px; font-weight: 700;">Confirm account deletion</a>
      </p>
      <p style="font-size: 12px; color: #9D9D9D; margin: 0;">If you didn't request this, ignore this email and your account will stay exactly as it is.</p>
    </div>
  `;
}

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
    // Email changes never go through Better Auth's native
    // changeEmail/requestEmailChange path — that flow has an open bug
    // (better-auth/better-auth#8043) where the verification OTP silently
    // fails to send for an already-verified user, exactly the case for
    // anyone reaching Settings. Instead, Settings > Profile verifies a
    // custom, Redis-backed OTP (see lib/email-change-otp.ts) and updates
    // `user.email` directly via Drizzle, bypassing this entirely.
    deleteUser: {
      enabled: true,
      // Runs for both deletion paths below — the single server-side
      // enforcement point for the demo-account guard (danger-zone-panel.tsx
      // also hides the UI client-side, but that alone wouldn't stop a
      // direct API call).
      beforeDelete: async (user) => {
        if (user.email === TEST_ACCOUNT_EMAIL) {
          throw new APIError("BAD_REQUEST", {
            message: "Deletion is disabled for the shared demo account.",
          });
        }
      },
      // Only reached for OAuth-only accounts (see danger-zone-panel.tsx)
      // — a password-holding account instead confirms via
      // `authClient.deleteUser({ password })`, which satisfies Better
      // Auth's "fresh session" requirement without an email round-trip.
      // The link deliberately points at our own /settings page with the
      // token as a query param rather than at Better Auth's raw callback
      // `url` — visiting that raw URL directly renders an unstyled JSON
      // response (a documented UX complaint, better-auth/better-auth#926).
      // settings-shell.tsx reads `confirmDelete` from the query string on
      // mount and calls `authClient.deleteUser({ token })` itself.
      sendDeleteAccountVerification: async ({ user, token }) => {
        const confirmUrl = `${env.BETTER_AUTH_URL}/settings?confirmDelete=${token}`;

        await sendEmail({
          to: user.email,
          subject: "Confirm account deletion — FX Checker",
          html: buildDeleteAccountEmailHtml(user.name, confirmUrl),
        });
      },
    },
  },

  // Lets `auth.api.*` calls (if ever used from a Server Action) set
  // cookies correctly under Next.js's Server Action cookie rules. Must
  // stay last in the plugins array per Better Auth's own docs.
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
