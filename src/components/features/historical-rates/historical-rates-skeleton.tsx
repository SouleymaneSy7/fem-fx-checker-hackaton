import { LoadingStatus } from "@/components/common";
import { Skeleton } from "@/components/ui";
import { formatFullDate } from "@/utils";

const HistoricalRatesSkeleton = ({ date }: { date: string | undefined }) => {
  return (
    <LoadingStatus
      label={`Loading rate for ${formatFullDate(date ?? "date")}`}
      className="flex flex-col gap-step-150"
    >
      <div className="grid grid-cols-1 gap-step-150 sm:grid-cols-2">
        <div className="flex flex-col gap-step-100 rounded-10 border border-neutral-500 bg-neutral-600 p-step-150 md:p-step-200">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-3 w-28" />
        </div>

        <div className="flex flex-col gap-step-100 rounded-10 border border-neutral-500 bg-neutral-600 p-step-150 md:p-step-200">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>

      <Skeleton className="h-11 w-full rounded-10" />
    </LoadingStatus>
  );
};

export default HistoricalRatesSkeleton;
