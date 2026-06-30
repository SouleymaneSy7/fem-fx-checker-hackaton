import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";

const FavoritesPanel = () => {
  return (
    <Empty>
      <EmptyTitle>No pinned pairs yet</EmptyTitle>
      <EmptyDescription>
        Pin a pair to track its rate here. Tap the star icon on any conversion
        or comparison row.
      </EmptyDescription>
    </Empty>
  );
};

export default FavoritesPanel;
