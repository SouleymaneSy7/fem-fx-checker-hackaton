import { LoadingStatus } from "@/components/common";
import { Skeleton } from "@/components/ui";
import type { HistorySkeletonPropsType } from "@/types";

const HISTORY_STAT_SKELETON_LABELS = ["Open", "Last", "Change", "% change"];

const HistorySkeleton = ({ pair }: HistorySkeletonPropsType) => {
  return (
    <LoadingStatus
      label={`Loading rate history for ${pair}`}
      className="flex flex-col gap-step-200 md:gap-step-250"
    >
      <div className="flex flex-col gap-step-250 lg:flex-row lg:items-center lg:justify-between">
        <div className="history-stat-grid">
          {HISTORY_STAT_SKELETON_LABELS.map((label) => (
            <div
              key={label}
              className="flex flex-col gap-step-200 rounded-xl border border-neutral-600 bg-card px-step-250 py-step-150"
            >
              <Skeleton className="h-3.5 w-16" />
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>

        <Skeleton className="h-step-500 w-64 rounded-md" />
      </div>

      <div className="flex flex-col gap-step-250 rounded-xl border border-neutral-600 bg-card px-step-150 py-step-200 md:p-step-250">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4.5 w-18" /> <Skeleton className="h-4 w-27" />
        </div>
        <Skeleton className="h-75 w-full rounded-xl" />
      </div>
    </LoadingStatus>
  );
};

HistorySkeleton.displayName = "HistorySkeleton";

export default HistorySkeleton;
