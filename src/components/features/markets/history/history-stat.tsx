import Container from "@/components/common/container";
import TruncateTooltip from "@/components/shared/truncate-tooltip";
import { cn } from "@/lib/utils";
import type { HistoryStatPropsType } from "@/types/ui.types";

const HistoryStat = ({
  label,
  value,
  tooltipContent,
  tone = "neutral",
}: HistoryStatPropsType) => {
  const valueClassName = cn(
    "preset-2 uppercase",
    tone === "positive" && "text-green",
    tone === "negative" && "text-red",
  );

  const resolvedContent =
    tooltipContent ?? (typeof value === "string" ? value : undefined);

  return (
    <Container className="flex flex-col gap-step-200 rounded-xl border border-neutral-500 dark:border-neutral-600 bg-card px-step-250 py-step-150">
      <p className="preset-4 uppercase text-neutral-200">{label}</p>

      {resolvedContent !== undefined ? (
        <TruncateTooltip className={valueClassName} content={resolvedContent}>
          {value}
        </TruncateTooltip>
      ) : (
        <p className={cn(valueClassName, "truncate")}>{value}</p>
      )}
    </Container>
  );
};

export default HistoryStat;
