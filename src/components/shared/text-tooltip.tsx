"use client";

import * as React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { TextTooltipPropsType } from "@/types";

const TextTooltip = React.forwardRef<HTMLSpanElement, TextTooltipPropsType>(
  ({ content, children, className, side, ...delegatedProps }, ref) => {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            ref={ref}
            className={cn("cursor-default! rounded-sm focus-ring", className)}
            {...delegatedProps}
          >
            {children}
          </span>
        </TooltipTrigger>

        <TooltipContent side={side}>{content}</TooltipContent>
      </Tooltip>
    );
  },
);

export default TextTooltip;
