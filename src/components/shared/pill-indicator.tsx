import { cn } from "@/lib/utils";

type PillIndicatorPropsType = {
  className?: string;
};

export const PillIndicator = ({ className }: PillIndicatorPropsType) => {
  return (
    <span className={cn("relative flex size-step-100", className)}>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-card opacity-75" />
      <span className="relative inline-flex size-step-100 rounded-full bg-background" />
    </span>
  );
};
