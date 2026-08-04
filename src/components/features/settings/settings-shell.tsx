"use client";

import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { Container, Title } from "@/components/common";
import { Spinner, Tabs, TabsContent } from "@/components/ui";
import { useClearSyncedStores } from "@/hooks";
import { authClient, useSession } from "@/lib/auth-client";
import type { SettingsSectionValueType } from "@/types";
import DangerZonePanel from "./danger-zone-panel";
import PreferencesPanel from "./preferences-panel";
import ProfilePanel from "./profile-panel";
import SettingsTabNav from "./settings-tab-nav";

const DEFAULT_TAB: SettingsSectionValueType = "profile";

function isSettingsSectionValue(
  value: string | null,
): value is SettingsSectionValueType {
  return value === "profile" || value === "preferences" || value === "danger";
}

function SettingsShellInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: session, isPending } = useSession();
  const clearSyncedStores = useClearSyncedStores();

  // Read once on mount — this link is only ever meant to be followed a
  // single time, so there's no need to keep re-reading it as the `tab`
  // query param changes underneath it afterward.
  const [confirmDeleteToken] = React.useState(() =>
    searchParams.get("confirmDelete"),
  );
  const [isConfirmingDelete, setIsConfirmingDelete] = React.useState(
    () => !!confirmDeleteToken,
  );

  const [activeTab, setActiveTab] = React.useState<SettingsSectionValueType>(
    () => {
      const fromUrl = searchParams.get("tab");
      return isSettingsSectionValue(fromUrl) ? fromUrl : DEFAULT_TAB;
    },
  );

  // Handles the account-deletion confirmation link from
  // sendDeleteAccountVerification (see lib/auth.ts) — an OAuth-only
  // account has no password to re-confirm with, so the token itself is
  // the proof, independent of whether this browser still has a valid
  // session. Runs instead of, and before, the sign-in guard below.
  React.useEffect(() => {
    if (!confirmDeleteToken) return;

    let cancelled = false;

    (async () => {
      const { error } = await authClient.deleteUser({
        token: confirmDeleteToken,
      });

      if (cancelled) return;

      if (error) {
        toast.error(
          error.message ?? "This deletion link is invalid or has expired.",
        );
        setIsConfirmingDelete(false);
        router.replace("/settings");
        return;
      }

      clearSyncedStores();
      toast.success("Your account has been permanently deleted.");
      router.replace("/sign-in");
    })();

    return () => {
      cancelled = true;
    };
  }, [confirmDeleteToken, router, clearSyncedStores]);

  React.useEffect(() => {
    if (isConfirmingDelete) return;
    if (!isPending && !session) router.replace("/sign-in");
  }, [isConfirmingDelete, isPending, session, router]);

  // Keeps the URL shareable/bookmarkable without a full navigation on
  // every tab click — same `router.replace` pattern as
  // converter-url-sync.tsx, just without the debounce since there's no
  // rapid-fire input to coalesce here.
  const handleTabChange = (next: SettingsSectionValueType) => {
    setActiveTab(next);
    router.replace(`/settings?tab=${next}`, { scroll: false });
  };

  if (isConfirmingDelete || isPending || !session) {
    return (
      <div className="flex items-center justify-center py-step-1000">
        <Spinner className="text-neutral-200" />
      </div>
    );
  }

  return (
    <Container as="section" className="space-y-step-200">
      <Title level="h1" className="preset-2 uppercase">
        Settings
      </Title>

      <Tabs
        value={activeTab}
        onValueChange={(next) =>
          handleTabChange(next as SettingsSectionValueType)
        }
      >
        <SettingsTabNav value={activeTab} onValueChange={handleTabChange} />

        <TabsContent value="profile">
          <ProfilePanel />
        </TabsContent>

        <TabsContent value="preferences">
          <PreferencesPanel />
        </TabsContent>

        <TabsContent value="danger">
          <DangerZonePanel />
        </TabsContent>
      </Tabs>
    </Container>
  );
}

// `useSearchParams()` always requires a Suspense boundary, or Next.js
// forces the whole route into fully dynamic rendering — same reasoning
// as converter-url-sync.tsx.
const SettingsShell = () => {
  return (
    <React.Suspense fallback={null}>
      <SettingsShellInner />
    </React.Suspense>
  );
};

SettingsShell.displayName = "SettingsShell";

export default SettingsShell;
