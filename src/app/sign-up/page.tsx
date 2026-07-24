import type { Metadata } from "next";

import AuthCard from "@/components/features/auth/auth-card";
import SignUpForm from "@/components/features/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Create an account",
};

export default function SignUpPage() {
  return (
    <AuthCard>
      <SignUpForm />
    </AuthCard>
  );
}
