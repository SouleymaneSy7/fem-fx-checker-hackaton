"use client";

import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import type * as React from "react";

import { cn } from "@/lib/utils";

function ToggleGroup({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      className={cn(
        "inline-flex items-center gap-step-0 rounded-md bg-card p-step-025",
        className,
      )}
      {...props}
    />
  );
}

function ToggleGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        "preset-5 relative inline-flex cursor-pointer items-center justify-center rounded-md px-step-200 py-step-150 text-neutral-200 uppercase transition-colors",
        "hover:text-foreground",
        "focus-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[state=on]:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem };
