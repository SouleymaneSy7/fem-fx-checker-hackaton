import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...delegatedProps
}: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-sm bg-neutral-400 dark:bg-neutral-300",
        className,
      )}
      {...delegatedProps}
    />
  );
}

export { Skeleton };
