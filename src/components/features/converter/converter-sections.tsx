import TabNav from "@/components/layout/tab-nav";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import ComparePanel from "../compare/compare-panel";
import FavoritesPanel from "../favorites/favorites-panel";
import LogPanel from "../log/log-panel";
import HistoryPanel from "../markets/history/history-panel";

const ConverterSections = () => {
  return (
    <Tabs defaultValue="history">
      <TabNav />

      <TabsContent value="history">
        <HistoryPanel />
      </TabsContent>

      <TabsContent value="compare">
        <ComparePanel />
      </TabsContent>

      <TabsContent value="favorites">
        <FavoritesPanel />
      </TabsContent>

      <TabsContent value="log">
        <LogPanel />
      </TabsContent>
    </Tabs>
  );
};

export default ConverterSections;
