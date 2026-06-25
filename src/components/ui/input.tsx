import type * as React from "react";

import { cn } from "@/lib/utils";

function Input({
  className,
  type = "text",
  ...delegatedProps
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-9 w-full min-w-0 rounded-8 border border-input bg-transparent px-step-150 py-step-100 preset-4 text-foreground outline-none transition-colors",
        "placeholder:text-neutral-200",
        "focus-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        className,
      )}
      {...delegatedProps}
    />
  );
}

export { Input };
