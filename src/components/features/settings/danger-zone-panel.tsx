"use client";

import * as React from "react";
import { toast } from "sonner";

import { Container, Title } from "@/components/common";
import { TextInput } from "@/components/shared";
import { Button, Spinner } from "@/components/ui";
import { TEST_ACCOUNT_EMAIL } from "@/constants";
import { useClearSyncedStores, useLinkedAccounts } from "@/hooks";
import { authClient, signOut, useSession } from "@/lib/auth-client";

const DELETE_CONFIRMATION_WORD = "DELETE";

// Gives the "account deleted" toast a moment on screen before the hard
// reload below wipes the page — see the comment in handleDelete for why
// this is a full navigation rather than router.replace.
const ACCOUNT_DELETED_REDIRECT_DELAY_MS = 1200;

const DangerZonePanel = () => {
  const { data: session } = useSession();
  const { hasPassword, isLoading: isLoadingAccounts } = useLinkedAccounts();
  const clearSyncedStores = useClearSyncedStores();

  const [isExpanded, setIsExpanded] = React.useState(false);
  const [confirmText, setConfirmText] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

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
        setFormError(
          error.code === "SESSION_EXPIRED"
            ? "Your session isn't recent enough for this — sign out and back in, then try again."
            : (error.message ?? "Couldn't delete your account."),
        );
        return;
      }

      // The account (and, via cascade, its session row) is already gone
      // server-side, but the client's own session cache doesn't know
      // that yet — sign out explicitly so useSession() stops reporting
      // an authenticated user. Then force a full page load rather than
      // a client-side navigation: a soft router.replace leaves
      // AccountSync's effect and any cached SWR data alive in memory,
      // which can race with the redirect and make the app look like
      // deletion silently did nothing.
      await signOut().catch(() => {});
      clearSyncedStores();
      toast.success("Your account has been permanently deleted.");

      window.setTimeout(() => {
        window.location.href = "/sign-in";
      }, ACCOUNT_DELETED_REDIRECT_DELAY_MS);
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
                  {isDeleting ? "Deleting..." : "Permanently delete account"}
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
