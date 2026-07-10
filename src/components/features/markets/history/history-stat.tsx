import Container from "@/components/common/container";
import { cn } from "@/lib/utils";
import type { HistoryStatPropsType } from "@/types/ui.types";

const HistoryStat = ({
  label,
  value,
  tone = "neutral",
}: HistoryStatPropsType) => {
  return (
    <Container className="flex flex-col gap-step-200 rounded-xl border border-neutral-500 dark:border-neutral-600 bg-card px-step-250 py-step-150">
      <p className="preset-4 uppercase text-neutral-200">{label}</p>

      <p
        className={cn(
          "preset-2 uppercase truncate",
          tone === "positive" && "text-green",
          tone === "negative" && "text-red",
        )}
      >
        {value}
      </p>
    </Container>
  );
};

export default HistoryStat;
