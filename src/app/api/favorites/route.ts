import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { favorite } from "@/db/schema";
import { auth } from "@/lib/auth";
import { writeRatelimit } from "@/lib/rate-limit";
import { createFavoriteSchema } from "@/validators";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select()
    .from(favorite)
    .where(eq(favorite.userId, session.user.id));

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
  const result = createFavoriteSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  // `onConflictDoNothing` makes re-pinning an already-pinned pair a no-op
  // instead of a 500 — the unique index is on (userId, from, to).
  const [row] = await db
    .insert(favorite)
    .values({
      userId: session.user.id,
      fromCurrency: result.data.fromCurrency,
      toCurrency: result.data.toCurrency,
    })
    .onConflictDoNothing()
    .returning();

  return NextResponse.json(row ?? result.data, { status: 201 });
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
    .delete(favorite)
    .where(
      and(
        eq(favorite.userId, session.user.id),
        eq(favorite.fromCurrency, fromCurrency.toUpperCase()),
        eq(favorite.toCurrency, toCurrency.toUpperCase()),
      ),
    );

  return NextResponse.json({ success: true });
}
