import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { userSettings } from "@/db/schema";
import { auth } from "@/lib/auth";
import { writeRatelimit } from "@/lib/rate-limit";
import { updateSettingsSchema } from "@/validators";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [row] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, session.user.id));

  // `null` (not a stub row with every field set to null) signals "this
  // user has never saved a custom setting" — the client's sync layer
  // treats that as "upload my current local values as the starting
  // point", not "the server says reset everything".
  return NextResponse.json(row ?? null);
}

export async function PATCH(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { success } = await writeRatelimit.limit(session.user.id);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const result = updateSettingsSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  // Upsert: the row is created on the first change rather than at
  // sign-up. `onConflictDoUpdate` merges in only whichever fields this
  // particular PATCH actually sent, leaving every other already-saved
  // field untouched.
  const [row] = await db
    .insert(userSettings)
    .values({ userId: session.user.id, ...result.data })
    .onConflictDoUpdate({
      target: userSettings.userId,
      set: result.data,
    })
    .returning();

  return NextResponse.json(row);
}
