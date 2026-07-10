"use client";

import * as React from "react";
import { toast } from "sonner";
import TextInput from "@/components/shared/text-input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { signUp } from "@/lib/auth-client";
import type { SignUpFormPropsType } from "@/types/ui.types";
import { signUpSchema } from "@/validators";

const SignUpForm = ({ onSuccess }: SignUpFormPropsType) => {
  const [name, setName] = React.useState("");
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

    const result = signUpSchema.safeParse({ name, email, password });
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

    // `autoSignIn` defaults to true (requireEmailVerification is off), so
    // a successful call already leaves the user with an active session.
    const { error } = await signUp.email(result.data);

    setIsSubmitting(false);

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
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-step-200">
      <TextInput
        label="Name"
        type="text"
        autoComplete="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        error={fieldErrors.name}
      />

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
        autoComplete="new-password"
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
        {isSubmitting ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
};

export default SignUpForm;
