"use client";

import * as React from "react";
import { toast } from "sonner";
import TextInput from "@/components/shared/text-input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { signIn } from "@/lib/auth-client";
import type { SignInFormPropsType } from "@/types/ui.types";
import { signInSchema } from "@/validators";

const SignInForm = ({ onSuccess }: SignInFormPropsType) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>(
    {},
  );
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const result = signInSchema.safeParse({ email, password });
    if (!result.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !nextErrors[key])
          nextErrors[key] = issue.message;
      }
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    const { error } = await signIn.email(result.data);

    setIsSubmitting(false);

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
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-step-200">
      <TextInput
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={fieldErrors.email}
      />

      <TextInput
        label="Password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={fieldErrors.password}
      />

      {formError && <p className="preset-5 text-destructive">{formError}</p>}

      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="w-full"
      >
        {isSubmitting && (
          <Spinner aria-hidden="true" className="text-primary-foreground" />
        )}
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
};

export default SignInForm;
