import LoadingStatus from "@/components/common/loading-status";
import { Skeleton } from "@/components/ui/skeleton";

const CompareChartSkeleton = () => {
  return (
    <LoadingStatus
      label="Loading comparison chart"
      className="flex flex-col gap-step-200 md:gap-step-250"
    >
      <Skeleton className="h-3.5 w-76" />

      <div className="flex flex-wrap items-center justify-between gap-step-200">
        <Skeleton className="h-3.5 w-76" />
        <Skeleton className="h-step-500 w-64 rounded-md" />
      </div>

      <Skeleton className="h-75 w-full rounded-xl" />

      <div className="flex flex-col gap-step-200 md:gap-step-250">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-8 w-full max-w-150" />
      </div>
    </LoadingStatus>
  );
};

export default CompareChartSkeleton;
