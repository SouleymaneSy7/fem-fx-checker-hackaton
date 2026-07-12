import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { logEntry } from "@/db/schema";
import { auth } from "@/lib/auth";
import type { RouteContextType } from "@/types/data.types";

export async function DELETE(_request: Request, context: RouteContextType) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  await db
    .delete(logEntry)
    .where(and(eq(logEntry.id, id), eq(logEntry.userId, session.user.id)));

  return NextResponse.json({ success: true });
}
