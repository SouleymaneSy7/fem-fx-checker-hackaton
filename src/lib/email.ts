import { Resend } from "resend";

// biome-ignore lint/style/noNonNullAssertion: RESEND_API_KEY is guaranteed by .env.local and validated at startup
export const resend = new Resend(process.env.RESEND_API_KEY!);

// Sandbox limitation without a verified Resend domain: only
// "onboarding@resend.dev" is accepted as a sender, and only the Resend
// account's own address can receive mail from it. Once a domain is
// verified, swap RESEND_FROM_EMAIL to a real address on that domain — no
// other code here needs to change.
export const RESEND_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

type SendEmailParamsType = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailParamsType) {
  const { error } = await resend.emails.send({
    from: `FX Checker - <${RESEND_FROM_EMAIL}>`,
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(error.message);
  }
}
