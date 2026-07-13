"use client";

import * as React from "react";

import TabNav from "@/components/layout/tab-nav";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import type { ConverterSectionValueType } from "@/types/data.types";
import AlertsPanel from "../alerts/alerts-panel";
import ComparePanel from "../compare/compare-panel";
import FavoritesPanel from "../favorites/favorites-panel";
import HistoricalRatesPanel from "../historical-rates/historical-rates-panel";
import LogPanel from "../log/log-panel";
import HistoryPanel from "../markets/history/history-panel";

const ConverterSections = () => {
  const [activeTab, setActiveTab] =
    React.useState<ConverterSectionValueType>("history");

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
