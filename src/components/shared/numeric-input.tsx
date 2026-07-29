import { cn } from "@/lib/utils";

const NumericInput = ({
  className,
  type,
  ...delegatedProps
}: React.ComponentProps<"input">) => {
  return (
    <input
      type="text"
      inputMode="decimal"
      autoComplete="off"
      data-slot="numeric-input"
      placeholder="0"
      className={cn(
        "preset-1 relative w-full max-w-50 rounded-md bg-transparent px-step-050 text-foreground outline-none",
        "placeholder:text-neutral-200",
        "transition",
        "focus-ring focus-visible:border-transparent",
        "disabled:cursor-not-allowed disabled:text-neutral-200 disabled:opacity-50",
        className,
      )}
      {...delegatedProps}
    />
  );
};

export default NumericInput;
