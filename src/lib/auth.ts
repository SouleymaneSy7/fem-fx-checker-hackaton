import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { db } from "@/db";
import * as userSchema from "@/db/schemas/user.schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: userSchema,
  }),

  emailAndPassword: {
    enabled: true,
  },

  baseURL: process.env.BETTER_AUTH_URL,

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },

  // Lets `auth.api.*` calls (if ever used from a Server Action) set
  // cookies correctly under Next.js's Server Action cookie rules. Must
  // stay last in the plugins array per Better Auth's own docs.
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
