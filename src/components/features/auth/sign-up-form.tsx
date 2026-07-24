"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import Logo from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { signUp } from "@/lib/auth-client";
import { signUpSchema } from "@/validators";
import AuthTextInput from "./auth-text-input";
import OAuthButtons from "./oauth-buttons";

const SignUpForm = () => {
  const router = useRouter();

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

      <form onSubmit={handleSubmit} className="flex flex-col gap-step-400">
        <div className="flex flex-col gap-step-200">
          <AuthTextInput
            label="Fullname"
            type="text"
            autoComplete="name"
            placeholder="Enter your fullname"
            value={name}
            onChange={(event) => setName(event.target.value)}
            error={fieldErrors.name}
          />

          <AuthTextInput
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={fieldErrors.email}
          />

          <AuthTextInput
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={fieldErrors.password}
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
