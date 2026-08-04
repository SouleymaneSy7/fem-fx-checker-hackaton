import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { TEST_ACCOUNT_EMAIL } from "@/constants";
import { db } from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import {
  consumeEmailChangeOtp,
  createEmailChangeOtp,
} from "@/lib/email-change-otp";
import { writeRatelimit } from "@/lib/rate-limit";
import {
  confirmEmailChangeSchema,
  requestEmailChangeSchema,
} from "@/validators";

function buildEmailChangeOtpHtml(otp: string): string {
  return `
    <div style="font-family: monospace, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background-color: #0A0A0A; color: #FFFFFF;">
      <p style="font-size: 20px; font-weight: 700; color: #CEF739; margin: 0 0 24px;">FX Checker</p>
      <p style="font-size: 14px; line-height: 1.5; margin: 0 0 16px;">Here's the code to confirm this is your new email address:</p>
      <p style="font-size: 32px; font-weight: 700; letter-spacing: 8px; text-align: center; padding: 16px; background-color: #202022; border-radius: 10px; margin: 0 0 16px;">${otp}</p>
      <p style="font-size: 12px; color: #9D9D9D; margin: 0;">This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;
}

// POST: step 1 — sends a code to the desired new address.
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Server-side half of the demo-account guard — the Profile panel also
  // hides this action client-side, but a direct API call would bypass
  // that, so the shared demo credentials stay usable for other visitors.
  if (session.user.email === TEST_ACCOUNT_EMAIL) {
    return NextResponse.json(
      { error: "Email changes are disabled for the shared demo account." },
      { status: 403 },
    );
  }

  const { success } = await writeRatelimit.limit(session.user.id);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const result = requestEmailChangeSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const { newEmail } = result.data;

  if (newEmail === session.user.email) {
    return NextResponse.json(
      { error: "That's already your current email address." },
      { status: 400 },
    );
  }

  const [existing] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, newEmail));

  if (existing) {
    return NextResponse.json(
      { error: "That email address is already in use." },
      { status: 409 },
    );
  }

  const otp = await createEmailChangeOtp(session.user.id, newEmail);

  await sendEmail({
    to: newEmail,
    subject: "Confirm your new email — FX Checker",
    html: buildEmailChangeOtpHtml(otp),
  });

  return NextResponse.json({ success: true });
}

// PATCH: step 2 — verifies the code and applies the change.
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
  const result = confirmEmailChangeSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const newEmail = await consumeEmailChangeOtp(
    session.user.id,
    result.data.otp,
  );

  if (!newEmail) {
    return NextResponse.json(
      { error: "That code is invalid or has expired." },
      { status: 400 },
    );
  }

  try {
    const [updated] = await db
      .update(user)
      .set({ email: newEmail, emailVerified: true })
      .where(eq(user.id, session.user.id))
      .returning({ email: user.email });

    return NextResponse.json({ email: updated.email });
  } catch {
    // Unique constraint race — someone else claimed that email between
    // the availability check in POST and this confirmation.
    return NextResponse.json(
      { error: "That email address is already in use." },
      { status: 409 },
    );
  }
}
