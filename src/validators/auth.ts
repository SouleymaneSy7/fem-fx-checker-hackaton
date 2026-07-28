import * as z from "zod";

const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters long")
  .max(50, "Name cannot exceed 50 characters")
  .regex(
    /^[\p{L}\s'-]+$/u,
    "Name can only contain letters, spaces, hyphens, and apostrophes",
  );

const emailSchema = z
  .string()
  .min(1, "Email is required")
  .trim()
  .toLowerCase()
  .email("Please enter a valid email address")
  .max(254, "Email is too long");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(128, "Password is too long");

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const signUpSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
