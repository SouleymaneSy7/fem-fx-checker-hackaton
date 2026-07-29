import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { rateAlert } from "@/db/schema";
import { auth } from "@/lib/auth";
import { writeRatelimit } from "@/lib/rate-limit";
import type { RouteContextType } from "@/types";
import { updateAlertSchema } from "@/validators";

export async function PATCH(request: Request, context: RouteContextType) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { success } = await writeRatelimit.limit(session.user.id);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { id } = await context.params;

  const body = await request.json().catch(() => null);
  const result = updateAlertSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const [row] = await db
    .update(rateAlert)
    .set({
      enabled: result.data.enabled,
      triggeredAt: result.data.triggeredAt
        ? new Date(result.data.triggeredAt)
        : null,
    })
    .where(and(eq(rateAlert.id, id), eq(rateAlert.userId, session.user.id)))
    .returning();

  if (!row) {
    return NextResponse.json({ error: "Alert not found" }, { status: 404 });
  }

  return NextResponse.json(row);
}

export async function DELETE(_request: Request, context: RouteContextType) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { success } = await writeRatelimit.limit(session.user.id);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { id } = await context.params;

  await db
    .delete(rateAlert)
    .where(and(eq(rateAlert.id, id), eq(rateAlert.userId, session.user.id)));

  return NextResponse.json({ success: true });
}
