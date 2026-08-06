import * as React from "react";

import { cn } from "@/lib/utils";

// Forwards its ref down to the real <input> — needed so converter-top.tsx
// can imperatively focus/select it from the "/" keyboard shortcut (see
// constants/shortcut-registry.ts).
const NumericInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...delegatedProps }, ref) => {
  return (
    <input
      ref={ref}
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
});

NumericInput.displayName = "NumericInput";

export default NumericInput;
