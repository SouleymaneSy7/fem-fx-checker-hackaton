"use client";

import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { Container, Title } from "@/components/common";
import { Spinner, Tabs, TabsContent } from "@/components/ui";
import { useSession } from "@/lib/auth-client";
import type { SettingsSectionValueType } from "@/types";
import DangerZonePanel from "./danger-zone-panel";
import InterfacePanel from "./interface-panel";
import PreferencesPanel from "./preferences-panel";
import ProfilePanel from "./profile-panel";
import SettingsTabNav from "./settings-tab-nav";

const DEFAULT_TAB: SettingsSectionValueType = "profile";

function isSettingsSectionValue(
  value: string | null,
): value is SettingsSectionValueType {
  return (
    value === "profile" ||
    value === "preferences" ||
    value === "interface" ||
    value === "danger"
  );
}

function SettingsShellInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: session, isPending } = useSession();

  const [activeTab, setActiveTab] = React.useState<SettingsSectionValueType>(
    () => {
      const fromUrl = searchParams.get("tab");
      return isSettingsSectionValue(fromUrl) ? fromUrl : DEFAULT_TAB;
    },
  );

  React.useEffect(() => {
    if (!isPending && !session) router.replace("/sign-in");
  }, [isPending, session, router]);

  const handleTabChange = (next: SettingsSectionValueType) => {
    setActiveTab(next);
    router.replace(`/settings?tab=${next}`, { scroll: false });
  };

  if (isPending || !session) {
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

        <TabsContent value="interface">
          <InterfacePanel />
        </TabsContent>

        <TabsContent value="danger">
          <DangerZonePanel />
        </TabsContent>
      </Tabs>
    </Container>
  );
}

const SettingsShell = () => {
  return (
    <React.Suspense fallback={null}>
      <SettingsShellInner />
    </React.Suspense>
  );
};

export default SettingsShell;
