import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { TickerPairType } from "@/types";
import { formatPreciseAmount } from "@/utils";

const TickerItem = ({ pair }: { pair: TickerPairType }) => {
  const isNeutral = pair.changePercent === 0;
  const isPositive = pair.changePercent > 0;

  return (
    <div className="flex items-center gap-step-125 py-step-150 px-step-250 whitespace-nowrap preset-5 uppercase bg-card border-r border-border">
      <span className="text-neutral-200">
        {pair.base}/{pair.quote}
      </span>

      <Tooltip>
        <TooltipTrigger asChild>
          <span className="text-neutral-50 preset-5-med">
            {pair.rate.toFixed(2)}
          </span>
        </TooltipTrigger>

        <TooltipContent>
          1 {pair.base} = {formatPreciseAmount(pair.rate)} {pair.quote}
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <p
            className={cn(
              "flex items-center gap-step-075",
              isNeutral && "text-neutral-200",
              !isNeutral && isPositive && "text-green",
              !isNeutral && !isPositive && "text-red",
            )}
          >
            <span>{!isNeutral && (isPositive ? "▲" : "▼")}</span>
            <span>{Math.abs(pair.changePercent).toFixed(2)}%</span>
          </p>
        </TooltipTrigger>
        <TooltipContent>
          {isNeutral
            ? "No change in the last 24h"
            : `${isPositive ? "+" : "-"}${Math.abs(pair.changePercent).toFixed(4)}% in the last 24h`}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default TickerItem;
