import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";

const HistoryPanel = () => {
  return (
    <Empty>
      <EmptyTitle>No chart data available</EmptyTitle>

      <EmptyDescription>
        We couldn't load rate history for USD/EUR right now. This usually clears
        up in a minute.
      </EmptyDescription>
    </Empty>
  );
};

export default HistoryPanel;
