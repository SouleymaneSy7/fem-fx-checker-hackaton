"use client";

import { Tooltip as TooltipPrimitive } from "radix-ui";
import type * as React from "react";

import { cn } from "@/lib/utils";

function TooltipProvider({
  delayDuration = 300,
  ...delegatedProps
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...delegatedProps}
    />
  );
}

function Tooltip({
  ...delegatedProps
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...delegatedProps} />;
}

function TooltipTrigger({
  ...delegatedProps
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return (
    <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...delegatedProps} />
  );
}

function TooltipContent({
  className,
  sideOffset = 6,
  ...delegatedProps
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 max-w-70 origin-(--radix-tooltip-content-transform-origin) rounded-6 border border-neutral-400 bg-popover px-step-100 py-step-075 preset-5 text-popover-foreground outline-none dark:popover-shadow",
          "animate-in fade-in-0 zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
          className,
        )}
        {...delegatedProps}
      />
    </TooltipPrimitive.Portal>
  );
}

Tooltip.displayName = "Tooltip";
TooltipProvider.displayName = "TooltipProvider";
TooltipTrigger.displayName = "TooltipTrigger";
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent };
