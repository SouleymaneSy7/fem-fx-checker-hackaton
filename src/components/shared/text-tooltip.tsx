"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import type { TextTooltipPropsType } from "@/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui";

const TextTooltip = React.forwardRef<HTMLSpanElement, TextTooltipPropsType>(
  ({ content, children, className, side, ...delegatedProps }, ref) => {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            ref={ref}
            className={cn("focus-ring cursor-default! rounded-sm", className)}
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
