"use client";

import * as React from "react";

import { List, Title } from "@/components/common";
import { InfoIcon } from "@/components/icons";
import {
  buttonVariants,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import type { HeatmapHintPropsType } from "@/types";

const HeatmapHint = ({ className }: HeatmapHintPropsType) => {
  const [open, setOpen] = React.useState(false);

  const hints = [
    {
      id: "reading",
      text: "Read a cell as row currency vs column currency: green means the row currency strengthened against the column currency over the selected period, red means it weakened.",
    },
    {
      id: "relative",
      text: "Colors scale to the strongest move in the current grid, not a fixed percentage — so a short range and a long range both use the full color scale.",
    },
    {
      id: "source",
      text: "Every pair is triangulated through EUR, the ECB's reference currency, so the whole grid updates from just two rate snapshots.",
    },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger
            type="button"
            aria-label="About this heatmap"
            className={cn(
              buttonVariants({ variant: "secondary", size: "icon" }),
              className,
            )}
          >
            <InfoIcon className="text-foreground" />
          </PopoverTrigger>
        </TooltipTrigger>

        <TooltipContent>About this heatmap</TooltipContent>
      </Tooltip>

      <PopoverContent className="w-full max-w-80 space-y-step-200 p-step-250">
        <Title level="h3" className="preset-4 text-neutral-200 uppercase">
          About this heatmap
        </Title>

        <List
          items={hints}
          keyExtractor={(hint) => hint.id}
          className="flex flex-col gap-step-150"
          renderItem={(hint) => (
            <li className="preset-5 text-neutral-100">{hint.text}</li>
          )}
        />
      </PopoverContent>
    </Popover>
  );
};

export default HeatmapHint;
