import * as React from "react";

import { KeyboardShortcuts } from "@/components/common";
import AlertsWatcher from "@/components/features/alerts/alerts-watcher";
import AccountSync from "@/components/features/auth/account-sync";
import RecentPairsTracker from "@/components/features/converter/recent-pairs-tracker";
import { Header } from "@/components/layout";
import Footer from "@/components/layout/footer";
import AppLoader from "@/components/loaders/app-loader";
import { ShortcutsHelp } from "@/components/shared";

// Everything that belongs to the "main app" experience — home page and
// Settings — and makes no sense on the full-bleed /login or /signup
// pages (the splash screen, the ticker, the converter's own keyboard
// shortcuts, etc.). Parenthesized folder name: a route group, so it adds
// no segment to the URL.
export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <React.Fragment>
      <KeyboardShortcuts />
      <AccountSync />
      <RecentPairsTracker />
      <AlertsWatcher />
      <AppLoader>
        <Header />
        {children}
        <Footer />
        <ShortcutsHelp />
      </AppLoader>
    </React.Fragment>
  );
}
