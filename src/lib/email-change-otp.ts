import { EMAIL_OTP_EXPIRY_SECONDS, EMAIL_OTP_LENGTH } from "@/constants";
import { redis } from "@/lib/redis";

type EmailChangeOtpPayloadType = {
  newEmail: string;
  otp: string;
};

function buildRedisKey(userId: string): string {
  return `email-change-otp:${userId}`;
}

function generateOtp(): string {
  const min = 10 ** (EMAIL_OTP_LENGTH - 1);
  const max = 10 ** EMAIL_OTP_LENGTH - 1;
  const value = Math.floor(min + Math.random() * (max - min + 1));

  return String(value);
}

// Overwrites any previous pending request for this user — requesting a
// new code (or re-requesting the same one after Cancel) always
// invalidates whatever code came before it.
export async function createEmailChangeOtp(
  userId: string,
  newEmail: string,
): Promise<string> {
  const otp = generateOtp();
  const payload: EmailChangeOtpPayloadType = { newEmail, otp };

  await redis.set(buildRedisKey(userId), JSON.stringify(payload), {
    ex: EMAIL_OTP_EXPIRY_SECONDS,
  });

  return otp;
}

// Returns the pending new email if `otp` matches what's on record for
// this user, consuming the code in the same call so it can't be replayed.
// `null` covers both "no pending request" and "wrong/expired code"
// identically — neither case should reveal which one it was.
export async function consumeEmailChangeOtp(
  userId: string,
  otp: string,
): Promise<string | null> {
  const raw = await redis.get<string>(buildRedisKey(userId));
  if (!raw) return null;

  const payload: EmailChangeOtpPayloadType = JSON.parse(raw);
  if (payload.otp !== otp) return null;

  await redis.del(buildRedisKey(userId));

  return payload.newEmail;
}
