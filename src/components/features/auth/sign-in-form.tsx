"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Logo from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { SHORTCUT_EVENTS } from "@/constants";
import { signIn } from "@/lib/auth-client";
import type { SignInSchemaType } from "@/types/api.types";
import { signInSchema } from "@/validators";
import AuthTextInput from "./auth-text-input";
import OAuthButtons from "./oauth-buttons";

type FillTestCredentialsDetail = { email: string; password: string };

const SignInForm = () => {
  const router = useRouter();

  const [formError, setFormError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  // Fired by test-credentials-hint.tsx's "Fill in test credentials"
  // button — fills the fields but doesn't submit, so the person still
  // sees what's about to happen before clicking Sign In themselves.
  React.useEffect(() => {
    const handleFillTestCredentials = (event: Event) => {
      const detail = (event as CustomEvent<FillTestCredentialsDetail>).detail;
      if (!detail) return;

      setValue("email", detail.email, { shouldValidate: true });
      setValue("password", detail.password, { shouldValidate: true });
      setFormError(null);
    };

    window.addEventListener(
      SHORTCUT_EVENTS.fillTestCredentials,
      handleFillTestCredentials,
    );
    return () =>
      window.removeEventListener(
        SHORTCUT_EVENTS.fillTestCredentials,
        handleFillTestCredentials,
      );
  }, [setValue]);

  const onSubmit = async (data: SignInSchemaType) => {
    setFormError(null);

    const { error } = await signIn.email(data);

    if (error) {
      toast.error(
        error.message ??
          "Sign in failed — double-check your email and password.",
      );
      setFormError(
        error.message ??
          "Couldn't sign in. Check your credentials and try again.",
      );
      return;
    }

    toast.success("Welcome back! You're signed in.");
    router.replace("/");
  };

  return (
    <div className="flex flex-col gap-step-400">
      <Link href={"/"}>
        <Logo />
      </Link>

      <div className="flex flex-col gap-step-200">
        <h1 className="preset-1 text-foreground">Welcome Back</h1>

        <p className="preset-4 text-neutral-200">
          Please enter your details to login.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-step-400"
      >
        <div className="flex flex-col gap-step-200">
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
            autoComplete="current-password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password")}
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
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <p className="preset-5 text-neutral-200 text-center">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="text-primary underline underline-offset-2"
        >
          Sign Up
        </Link>
      </p>

      <OAuthButtons />
    </div>
  );
};

SignInForm.displayName = "SignInForm";

export default SignInForm;
