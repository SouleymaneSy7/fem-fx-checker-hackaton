import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

// biome-ignore lint/style/noNonNullAssertion: DATABASE_URL is guaranteed by .env.local and validated at startup
const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle({ client: sql });
