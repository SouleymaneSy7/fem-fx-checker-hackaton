"use client";

import * as React from "react";

import List from "@/components/common/list";
import Title from "@/components/common/title";
import { InfoIcon } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MAX_CHART_CURRENCIES } from "@/constants";
import { cn } from "@/lib/utils";
import type { CompareChartHintPropsType } from "@/types";

const CompareChartHint = ({
  baseCurrency,
  className,
}: CompareChartHintPropsType) => {
  const [open, setOpen] = React.useState(false);

  const hints = [
    {
      id: "percentage",
      text: `Shows percentage change vs ${baseCurrency}, not the raw exchange rate — check the History tab for actual rates.`,
    },
    {
      id: "independent",
      text: "This chart has its own currency selection, separate from the table above. Adding a currency to one doesn't add it to the other.",
    },
    {
      id: "limit",
      text: `Up to ${MAX_CHART_CURRENCIES} currencies at a time — remove one to add another once you're full.`,
    },
    {
      id: "remove-vs-hide",
      text: "Tap a chip's × to remove a currency from the chart entirely. The toggle buttons below the chart just hide a line temporarily, without removing it.",
    },
    {
      id: "colors",
      text: "Colors are reused by position, not tied to a specific currency — they may shift as you add or remove currencies.",
    },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger
            type="button"
            aria-label="About this chart"
            className={cn(
              buttonVariants({ variant: "secondary", size: "icon" }),
              className,
            )}
          >
            <InfoIcon className="text-foreground" />
          </PopoverTrigger>
        </TooltipTrigger>

        <TooltipContent>About this chart</TooltipContent>
      </Tooltip>

      <PopoverContent className="w-full max-w-80 space-y-step-200 p-step-250">
        <Title level="h3" className="preset-4 uppercase text-neutral-200">
          About this chart
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

CompareChartHint.displayName = "CompareChartHint";

export default CompareChartHint;
