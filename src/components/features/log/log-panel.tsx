import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";

const LogPanel = () => {
  return (
    <Empty>
      <EmptyTitle>No conversions logged yet</EmptyTitle>
      <EmptyDescription>
        Every conversion is recorded here automatically when you tap LOG
        CONVERSION. Your log is private to this session and this browser.{" "}
      </EmptyDescription>
    </Empty>
  );
};

export default LogPanel;
