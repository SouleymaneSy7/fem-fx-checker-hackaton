import * as z from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z
    .string()
    .trim()
    .min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
  BETTER_AUTH_URL: z
    .string()
    .url()
    .refine(
      (v) => /^https?:\/\//i.test(v),
      "BETTER_AUTH_URL must start with http(s)://",
    ),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().trim().min(1),
  GITHUB_CLIENT_ID: z.string().trim().min(1),
  GITHUB_CLIENT_SECRET: z.string().trim().min(1),
  GOOGLE_CLIENT_ID: z.string().trim().min(1),
  GOOGLE_CLIENT_SECRET: z.string().trim().min(1),
});

// ! Every NEXT_PUBLIC_* variable must be written literally:
// the bundler replaces the text `process.env.NEXT_PUBLIC_X` with its value
// at build time. Dynamic access (`process.env[name]`) will NOT be
// replaced and will evaluate to `undefined` in the browser.
const clientEnvSchema = z.object({
  NEXT_PUBLIC_EXCHANGE_API_BASE: z.string().url(),
});

const clientEnv = clientEnvSchema.safeParse({
  NEXT_PUBLIC_EXCHANGE_API_BASE: process.env.NEXT_PUBLIC_EXCHANGE_API_BASE,
});

if (!clientEnv.success) {
  throw new Error(
    `Invalid public environment variables:\n${z.prettifyError(clientEnv.error)}`,
  );
}

// On the client, `process.env` only contains NEXT_PUBLIC_* variables, so we
// only validate the server block on the server side.
const serverEnv =
  typeof window === "undefined"
    ? (() => {
        const parsed = serverEnvSchema.safeParse(process.env);
        if (!parsed.success) {
          throw new Error(
            `Invalid server environment variables:\n${z.prettifyError(parsed.error)}`,
          );
        }
        return parsed.data;
      })()
    : ({} as z.infer<typeof serverEnvSchema>);

export const env = { ...serverEnv, ...clientEnv.data };
