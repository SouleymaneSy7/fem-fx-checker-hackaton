import * as z from "zod";

import { EMAIL_OTP_LENGTH } from "@/constants";
import { emailSchema, nameSchema } from "./auth";

export const updateNameSchema = z.object({
  name: nameSchema,
});

export const requestEmailChangeSchema = z.object({
  newEmail: emailSchema,
});

export const confirmEmailChangeSchema = z.object({
  otp: z
    .string()
    .trim()
    .length(EMAIL_OTP_LENGTH, "Enter the verification code."),
});
