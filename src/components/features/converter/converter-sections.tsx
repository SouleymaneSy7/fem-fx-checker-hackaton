"use client";

import * as React from "react";

import { TabNav } from "@/components/layout";
import { Tabs, TabsContent } from "@/components/ui";
import { useIsomorphicLayoutEffect } from "@/hooks";
import { usePreferencesStore } from "@/store";
import type { ConverterSectionValueType } from "@/types";
import AlertsPanel from "../alerts/alerts-panel";
import ComparePanel from "../compare/compare-panel";
import FavoritesPanel from "../favorites/favorites-panel";
import HistoricalRatesPanel from "../historical-rates/historical-rates-panel";
import LogPanel from "../log/log-panel";
import HistoryPanel from "../markets/history/history-panel";

const ConverterSections = () => {
  const [activeTab, setActiveTab] =
    React.useState<ConverterSectionValueType>("history");

  // Applied post-mount, never as the initial state — Zustand's persisted
  // `defaultTab` isn't available yet during the server render (or the
  // very first client render, before localStorage rehydration lands), so
  // baking it into useState's initializer would risk a hydration
  // mismatch. Runs before paint (useIsomorphicLayoutEffect), so there's
  // no visible flash of "History" first if a different default is set.
  useIsomorphicLayoutEffect(() => {
    const defaultTab = usePreferencesStore.getState().defaultTab;
    if (defaultTab) setActiveTab(defaultTab);
  }, []);

  return (
    <Tabs
      value={activeTab}
      onValueChange={(next) => setActiveTab(next as ConverterSectionValueType)}
    >
      <TabNav value={activeTab} onValueChange={setActiveTab} />

      <TabsContent value="history">
        <HistoryPanel />
      </TabsContent>

      <TabsContent value="compare">
        <ComparePanel />
      </TabsContent>

      <TabsContent value="historicalRates">
        <HistoricalRatesPanel />
      </TabsContent>

      <TabsContent value="favorites">
        <FavoritesPanel />
      </TabsContent>

      <TabsContent value="alerts">
        <AlertsPanel />
      </TabsContent>

      <TabsContent value="log">
        <LogPanel />
      </TabsContent>
    </Tabs>
  );
};

export default ConverterSections;
