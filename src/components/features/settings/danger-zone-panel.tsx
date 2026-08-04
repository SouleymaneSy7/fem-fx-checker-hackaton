"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { Container, Title } from "@/components/common";
import { TextInput } from "@/components/shared";
import {
  Button,
  Empty,
  EmptyDescription,
  EmptyTitle,
  Spinner,
} from "@/components/ui";
import { TEST_ACCOUNT_EMAIL } from "@/constants";
import { useClearSyncedStores, useLinkedAccounts } from "@/hooks";
import { authClient, useSession } from "@/lib/auth-client";

const DELETE_CONFIRMATION_WORD = "DELETE";

const DangerZonePanel = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { hasPassword, isLoading: isLoadingAccounts } = useLinkedAccounts();
  const clearSyncedStores = useClearSyncedStores();

  const [isExpanded, setIsExpanded] = React.useState(false);
  const [confirmText, setConfirmText] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [emailSent, setEmailSent] = React.useState(false);

  if (!session) return null;

  const isDemoAccount = session.user.email === TEST_ACCOUNT_EMAIL;
  const canSubmit =
    confirmText === DELETE_CONFIRMATION_WORD &&
    (!hasPassword || password.length > 0);

  const handleDelete = async () => {
    setFormError(null);
    setIsDeleting(true);

    try {
      const { error } = hasPassword
        ? await authClient.deleteUser({ password })
        : await authClient.deleteUser();

      if (error) {
        setFormError(error.message ?? "Couldn't delete your account.");
        return;
      }

      // OAuth-only accounts have no password to re-confirm freshness with
      // — Better Auth instead emailed a confirmation link (see
      // sendDeleteAccountVerification in lib/auth.ts), so nothing is
      // deleted yet.
      if (!hasPassword) {
        setEmailSent(true);
        setIsExpanded(false);
        return;
      }

      clearSyncedStores();
      toast.success("Your account has been permanently deleted.");
      router.replace("/sign-in");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setIsExpanded(false);
    setConfirmText("");
    setPassword("");
    setFormError(null);
  };

  return (
    <Container className="space-y-step-200 rounded-xl border border-destructive/40 bg-card p-step-200 md:space-y-step-250 md:p-step-250">
      <Title level="h3" className="preset-3-med text-destructive uppercase">
        Danger zone
      </Title>

      {isDemoAccount ? (
        <p className="preset-5 text-neutral-200">
          Account deletion is disabled for the shared demo account, so other
          visitors can keep using the published test credentials.
        </p>
      ) : emailSent ? (
        <Empty className="py-step-300">
          <EmptyTitle>Check your inbox</EmptyTitle>
          <EmptyDescription>
            We sent a confirmation link to {session.user.email}. Your account
            stays exactly as it is until you click it.
          </EmptyDescription>
        </Empty>
      ) : (
        <React.Fragment>
          <p className="preset-5 text-neutral-200">
            Permanently deletes your account and every pinned pair, logged
            conversion, and rate alert tied to it. This cannot be undone.
          </p>

          {!isExpanded ? (
            <Button
              type="button"
              variant="destructive"
              disabled={isLoadingAccounts}
              onClick={() => setIsExpanded(true)}
            >
              {isLoadingAccounts && <Spinner aria-hidden="true" />}
              Delete account
            </Button>
          ) : (
            <div className="flex flex-col gap-step-200">
              <TextInput
                label={`Type ${DELETE_CONFIRMATION_WORD} to confirm`}
                autoComplete="off"
                value={confirmText}
                onChange={(event) => setConfirmText(event.target.value)}
              />

              {hasPassword && (
                <TextInput
                  label="Current password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              )}

              {!hasPassword && (
                <p className="preset-6 text-neutral-200">
                  Your account has no password — we'll email a confirmation link
                  to {session.user.email} instead.
                </p>
              )}

              {formError && (
                <p className="preset-5 text-destructive">{formError}</p>
              )}

              <div className="flex gap-step-100">
                <Button
                  type="button"
                  variant="destructive"
                  disabled={!canSubmit || isDeleting}
                  aria-busy={isDeleting}
                  onClick={handleDelete}
                >
                  {isDeleting && <Spinner aria-hidden="true" />}
                  {isDeleting
                    ? "Deleting..."
                    : hasPassword
                      ? "Permanently delete account"
                      : "Send confirmation email"}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  disabled={isDeleting}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </React.Fragment>
      )}
    </Container>
  );
};

export default DangerZonePanel;
