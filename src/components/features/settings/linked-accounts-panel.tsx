"use client";

import * as React from "react";
import { toast } from "sonner";

import { Container, List, Title } from "@/components/common";
import { GithubIcon, GoogleIcon } from "@/components/icons";
import { Button, Spinner } from "@/components/ui";
import { useLinkedAccounts } from "@/hooks";
import { authClient } from "@/lib/auth-client";

type ProviderType = "google" | "github";

const PROVIDERS: { id: ProviderType; label: string }[] = [
  { id: "google", label: "Google" },
  { id: "github", label: "GitHub" },
];

const LinkedAccountsPanel = () => {
  const { accounts, isLoading, mutate } = useLinkedAccounts();
  const [pendingProvider, setPendingProvider] =
    React.useState<ProviderType | null>(null);

  const linkedProviderIds = new Set(
    accounts.map((account) => account.providerId),
  );
  // Unlinking the last remaining sign-in method would lock the account
  // out entirely — Better Auth refuses this server-side too, but
  // disabling the button ahead of time avoids a confusing round-trip.
  const canUnlinkAnything = accounts.length > 1;

  const handleLink = async (provider: ProviderType) => {
    setPendingProvider(provider);

    const { error } = await authClient.linkSocial({
      provider,
      callbackURL: "/settings?tab=preferences",
    });

    if (error) {
      toast.error(error.message ?? `Couldn't link ${provider}.`);
      setPendingProvider(null);
    }
    // On success, Better Auth redirects away — nothing left to reset.
  };

  const handleUnlink = async (providerId: ProviderType) => {
    setPendingProvider(providerId);

    try {
      const { error } = await authClient.unlinkAccount({ providerId });

      if (error) {
        toast.error(error.message ?? `Couldn't unlink ${providerId}.`);
        return;
      }

      toast.success(
        `${providerId === "google" ? "Google" : "GitHub"} has been unlinked.`,
      );
      mutate();
    } finally {
      setPendingProvider(null);
    }
  };

  return (
    <Container className="space-y-step-200 rounded-xl border border-neutral-600 bg-card p-step-200 md:space-y-step-250 md:p-step-250">
      <Title level="h3" className="preset-3-med text-foreground uppercase">
        Linked accounts
      </Title>

      <List
        items={PROVIDERS}
        keyExtractor={(provider) => provider.id}
        className="flex flex-col gap-step-150"
        renderItem={(provider) => {
          const isLinked = linkedProviderIds.has(provider.id);
          const isPending = pendingProvider === provider.id;

          return (
            <li className="flex items-center gap-step-150 rounded-10 border border-neutral-500 bg-neutral-600 px-step-150 py-step-150 md:px-step-200">
              {provider.id === "google" ? (
                <GoogleIcon className="text-foreground" />
              ) : (
                <GithubIcon className="text-foreground" />
              )}

              <div className="flex flex-1 flex-col gap-step-050">
                <p className="preset-4 text-foreground">{provider.label}</p>
                <p className="preset-6 text-neutral-200">
                  {isLinked ? "Connected" : "Not connected"}
                </p>
              </div>

              <Button
                type="button"
                variant="secondary"
                disabled={
                  isLoading || isPending || (isLinked && !canUnlinkAnything)
                }
                aria-busy={isPending}
                onClick={() =>
                  isLinked ? handleUnlink(provider.id) : handleLink(provider.id)
                }
              >
                {isPending && <Spinner aria-hidden="true" />}
                {isLinked ? "Unlink" : "Connect"}
              </Button>
            </li>
          );
        }}
      />
    </Container>
  );
};

export default LinkedAccountsPanel;
