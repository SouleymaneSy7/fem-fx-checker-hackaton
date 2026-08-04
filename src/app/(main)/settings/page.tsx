import type { Metadata } from "next";

import SettingsShell from "@/components/features/settings/settings-shell";
import { Main } from "@/components/layout";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <Main>
      <SettingsShell />
    </Main>
  );
}
