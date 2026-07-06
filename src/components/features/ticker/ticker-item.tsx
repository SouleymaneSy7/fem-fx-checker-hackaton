import { cn } from "@/lib/utils";
import type { TickerPairType } from "@/types/ui.types";

const TickerItem = ({ pair }: { pair: TickerPairType }) => {
  const isNeutral = pair.changePercent === 0;
  const isPositive = pair.changePercent > 0;

  return (
    <div className="flex items-center gap-step-125 py-step-150 px-step-250 whitespace-nowrap preset-5 uppercase bg-card border-r border-border">
      <span className="text-neutral-200">
        {pair.base}/{pair.quote}
      </span>

      <span className="text-neutral-50 preset-5-med">
        {pair.rate.toFixed(2)}
      </span>

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
    </div>
  );
};

export default TickerItem;
