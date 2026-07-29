import { Container } from "@/components/common";
import { TextTooltip } from "@/components/shared";
import { cn } from "@/lib/utils";
import type { HistoryStatPropsType } from "@/types";

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
    <Container className="flex flex-col gap-step-200 rounded-xl border border-neutral-500 bg-card px-step-250 py-step-150 dark:border-neutral-600">
      <p className="preset-4 text-neutral-200 uppercase">{label}</p>

      {resolvedContent !== undefined ? (
        <TextTooltip
          className={cn(valueClassName, "truncate")}
          content={resolvedContent}
        >
          {value}
        </TextTooltip>
      ) : (
        <p className={cn(valueClassName, "truncate")}>{value}</p>
      )}
    </Container>
  );
};

export default HistoryStat;
