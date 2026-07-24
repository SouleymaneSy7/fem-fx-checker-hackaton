import * as React from "react";

import AccountSync from "@/components/common/account-sync";
import KeyboardShortcuts from "@/components/common/keyboard-shortcuts";
import RecentPairsTracker from "@/components/common/recent-pairs-tracker";
import AlertsWatcher from "@/components/features/alerts/alerts-watcher";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import AppLoader from "@/components/loaders/app-loader";
import ShortcutsHelp from "@/components/shared/shortcuts-help";

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
