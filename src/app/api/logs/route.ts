import { and, desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { MAX_LOG_ENTRIES } from "@/constants";
import { db } from "@/db";
import { logEntry } from "@/db/schema";
import { auth } from "@/lib/auth";
import { createLogEntrySchema } from "@/validators";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select()
    .from(logEntry)
    .where(eq(logEntry.userId, session.user.id))
    .orderBy(desc(logEntry.createdAt))
    .limit(MAX_LOG_ENTRIES);

  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const result = createLogEntrySchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const [row] = await db
    .insert(logEntry)
    .values({ userId: session.user.id, ...result.data })
    .returning();

  return NextResponse.json(row, { status: 201 });
}

// Bulk delete: `DELETE /api/logs` clears everything, `DELETE
// /api/logs?from=USD&to=EUR` clears just that pair (mirrors
// removeEntriesForPair, used by the converter's "un-log" action).
export async function DELETE(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const fromCurrency = searchParams.get("from");
  const toCurrency = searchParams.get("to");

  await db
    .delete(logEntry)
    .where(
      fromCurrency && toCurrency
        ? and(
            eq(logEntry.userId, session.user.id),
            eq(logEntry.fromCurrency, fromCurrency.toUpperCase()),
            eq(logEntry.toCurrency, toCurrency.toUpperCase()),
          )
        : eq(logEntry.userId, session.user.id),
    );

  return NextResponse.json({ success: true });
}
