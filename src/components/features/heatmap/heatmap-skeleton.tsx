import { LoadingStatus } from "@/components/common";
import { Skeleton } from "@/components/ui";

const HeatmapSkeleton = () => {
  return (
    <LoadingStatus
      label="Loading currency strength heatmap"
      className="flex flex-col gap-step-200 md:gap-step-250"
    >
      <Skeleton className="h-100 w-full rounded-10" />
    </LoadingStatus>
  );
};

export default HeatmapSkeleton;
