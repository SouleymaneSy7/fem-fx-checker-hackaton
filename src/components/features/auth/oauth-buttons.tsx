"use client";

import * as React from "react";
import { toast } from "sonner";

import { GithubIcon, GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { signIn } from "@/lib/auth-client";

type OAuthProviderType = "google" | "github";

const PROVIDER_LABELS: Record<OAuthProviderType, string> = {
  google: "Google",
  github: "GitHub",
};

const OAuthButtons = () => {
  const [loadingProvider, setLoadingProvider] =
    React.useState<OAuthProviderType | null>(null);

  const handleSignIn = async (provider: OAuthProviderType) => {
    setLoadingProvider(provider);

    const { error } = await signIn.social({ provider, callbackURL: "/" });

    if (error) {
      toast.error(
        error.message ?? `Couldn't sign in with ${PROVIDER_LABELS[provider]}.`,
      );
      setLoadingProvider(null);
    }
  };

  return (
    <div className="flex flex-col gap-step-200">
      <div className="flex items-center gap-step-100 md:gap-step-150">
        <Separator className="flex-1" />
        <span className="preset-5 text-neutral-200">Or</span>
        <Separator className="flex-1" />
      </div>

      <div className="w-full flex flex-wrap items-center gap-step-100 md:gap-step-125">
        <Button
          type="button"
          variant="secondary"
          disabled={loadingProvider !== null}
          aria-busy={loadingProvider === "google"}
          onClick={() => handleSignIn("google")}
          className="flex-1 normal-case"
        >
          {loadingProvider === "google" ? (
            <React.Fragment>
              <Spinner
                aria-hidden="true"
                className="text-secondary-foreground"
              />
              Redirecting...
            </React.Fragment>
          ) : (
            <React.Fragment>
              Continue with
              <GoogleIcon className="text-foreground" size={20} />
            </React.Fragment>
          )}
        </Button>

        <Button
          type="button"
          variant="secondary"
          disabled={loadingProvider !== null}
          aria-busy={loadingProvider === "github"}
          onClick={() => handleSignIn("github")}
          className="flex-1 normal-case"
        >
          {loadingProvider === "github" ? (
            <React.Fragment>
              <Spinner
                aria-hidden="true"
                className="text-secondary-foreground"
              />
              Redirecting...
            </React.Fragment>
          ) : (
            <React.Fragment>
              Continue with
              <GithubIcon className="text-foreground" size={20} />
            </React.Fragment>
          )}
        </Button>
      </div>
    </div>
  );
};

export default OAuthButtons;
