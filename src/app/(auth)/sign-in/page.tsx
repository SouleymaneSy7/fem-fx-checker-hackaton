import type { Metadata } from "next";
import * as React from "react";

import AuthCard from "@/components/features/auth/auth-card";
import SignInForm from "@/components/features/auth/sign-in-form";
import TestCredentialsHint from "@/components/features/auth/test-credentials-hint";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignInPage() {
  return (
    <React.Fragment>
      <AuthCard>
        <SignInForm />
      </AuthCard>

      <TestCredentialsHint />
    </React.Fragment>
  );
}
