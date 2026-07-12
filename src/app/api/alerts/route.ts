import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { rateAlert } from "@/db/schema";
import { auth } from "@/lib/auth";
import { createAlertSchema } from "@/validators";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select()
    .from(rateAlert)
    .where(eq(rateAlert.userId, session.user.id));

  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const result = createAlertSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  // No onConflictDoNothing here — unlike favorites, multiple alerts on
  // the same pair with different thresholds/conditions are legitimate,
  // so there's no natural unique constraint to dedupe against.
  const [row] = await db
    .insert(rateAlert)
    .values({
      userId: session.user.id,
      fromCurrency: result.data.fromCurrency,
      toCurrency: result.data.toCurrency,
      condition: result.data.condition,
      threshold: result.data.threshold,
    })
    .returning();

  return NextResponse.json(row, { status: 201 });
}
