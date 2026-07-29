"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Logo } from "@/components/shared";
import { Button, Spinner } from "@/components/ui";
import { signUp } from "@/lib/auth-client";
import type { SignUpSchemaType } from "@/types";
import { signUpSchema } from "@/validators";
import AuthTextInput from "./auth-text-input";
import OAuthButtons from "./oauth-buttons";

const SignUpForm = () => {
  const router = useRouter();

  const [formError, setFormError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: SignUpSchemaType) => {
    setFormError(null);

    // `confirmPassword` only exists for client-side validation — it's
    // never sent to the API. `autoSignIn` defaults to true
    // (requireEmailVerification is off), so a successful call already
    // leaves the user with an active session.
    const { error } = await signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error(
        error.message ??
          "Couldn't create your account — that email may already be in use.",
      );
      setFormError(
        error.message ??
          "Couldn't create your account. That email may already be in use.",
      );
      return;
    }

    toast.success("Your account is ready — welcome aboard!");
    router.replace("/");
  };

  return (
    <div className="flex flex-col gap-step-400">
      <Link href={"/"}>
        <Logo />
      </Link>

      <div className="flex flex-col gap-step-200">
        <h1 className="preset-1 text-foreground">Create An account</h1>

        <p className="preset-4 leading-snug! text-neutral-200">
          Enter your personal information to create your account.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-step-400"
      >
        <div className="flex flex-col gap-step-200">
          <AuthTextInput
            label="Fullname"
            type="text"
            autoComplete="name"
            placeholder="Enter your fullname"
            error={errors.name?.message}
            {...register("name")}
          />

          <AuthTextInput
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            {...register("email")}
          />

          <AuthTextInput
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password", { deps: ["confirmPassword"] })}
          />

          <AuthTextInput
            label="Confirm Password"
            type="password"
            autoComplete="new-password"
            placeholder="Confirm your password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          {formError && (
            <p className="preset-5 text-destructive">{formError}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="w-full normal-case"
        >
          {isSubmitting && (
            <Spinner aria-hidden="true" className="text-primary-foreground" />
          )}
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </Button>
      </form>

      <p className="preset-5 text-neutral-200 text-center">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="text-primary underline underline-offset-2"
        >
          Sign In
        </Link>
      </p>

      <OAuthButtons />
    </div>
  );
};

export default SignUpForm;
