import { and, desc, eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { MAX_RECENT_PAIRS } from "@/constants";
import { db } from "@/db";
import { recentPair } from "@/db/schema";
import { auth } from "@/lib/auth";
import { writeRatelimit } from "@/lib/rate-limit";
import { createRecentPairSchema } from "@/validators";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select()
    .from(recentPair)
    .where(eq(recentPair.userId, session.user.id))
    .orderBy(desc(recentPair.lastUsedAt))
    .limit(MAX_RECENT_PAIRS);

  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { success } = await writeRatelimit.limit(session.user.id);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const result = createRecentPairSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  // Upsert: a pair already on record keeps its row and just gets its
  // `lastUsedAt` bumped via GREATEST() — never regressed — instead of
  // creating a duplicate. GREATEST() matters most on the AccountSync
  // upload path, where a locally-cached timestamp can be older than
  // what's already on the server from another device.
  const [row] = await db
    .insert(recentPair)
    .values({
      userId: session.user.id,
      fromCurrency: result.data.fromCurrency,
      toCurrency: result.data.toCurrency,
      lastUsedAt: new Date(result.data.lastUsedAt),
    })
    .onConflictDoUpdate({
      target: [
        recentPair.userId,
        recentPair.fromCurrency,
        recentPair.toCurrency,
      ],
      set: {
        lastUsedAt: sql`greatest(${recentPair.lastUsedAt}, excluded.last_used_at)`,
      },
    })
    .returning();

  return NextResponse.json(row, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { success } = await writeRatelimit.limit(session.user.id);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const fromCurrency = searchParams.get("from");
  const toCurrency = searchParams.get("to");

  if (!fromCurrency || !toCurrency) {
    return NextResponse.json(
      { error: "Missing 'from'/'to' query params" },
      { status: 400 },
    );
  }

  await db
    .delete(recentPair)
    .where(
      and(
        eq(recentPair.userId, session.user.id),
        eq(recentPair.fromCurrency, fromCurrency.toUpperCase()),
        eq(recentPair.toCurrency, toCurrency.toUpperCase()),
      ),
    );

  return NextResponse.json({ success: true });
}
