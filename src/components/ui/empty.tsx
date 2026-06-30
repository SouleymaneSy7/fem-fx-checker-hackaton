import { cn } from "@/lib/utils";

function Empty({ className, ...delegatedProps }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-step-200 py-step-500 text-center",
        className,
      )}
      {...delegatedProps}
    />
  );
}

function EmptyTitle({
  className,
  ...delegatedProps
}: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn("preset-2 text-neutral-100", className)}
      {...delegatedProps}
    />
  );
}

function EmptyDescription({
  className,
  ...delegatedProps
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("mx-auto max-w-185 preset-4 text-neutral-200", className)}
      {...delegatedProps}
    />
  );
}

Empty.displayName = "Empty";
EmptyTitle.displayName = "EmptyTitle";
EmptyDescription.displayName = "EmptyDescription";

export { Empty, EmptyTitle, EmptyDescription };
