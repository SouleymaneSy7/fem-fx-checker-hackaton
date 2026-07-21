import List from "@/components/common/list";
import VisuallyHidden from "@/components/common/visually-hidden";
import { CurrencyFlag } from "@/components/shared/currency-flag";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { CompareChartCurrencyChipsPropsType } from "@/types/ui.types";

// Compact "currently in this chart" summary, one removable chip per
// selected currency — the chart's equivalent of the table's per-row
// DeleteButton, since a line chart has no rows to attach one to.
const CompareChartCurrencyChips = ({
  currencies,
  onRemove,
  isLoading,
}: CompareChartCurrencyChipsPropsType) => {
  if (currencies.length === 0) return null;

  return (
    <div>
      {/* biome-ignore lint/a11y/useSemanticElements: live region for loading state — <output> is semantically wrong for loading announcements */}
      <VisuallyHidden role="status">
        {currencies.length} currencies in this chart
      </VisuallyHidden>

      <List
        as="div"
        items={currencies}
        keyExtractor={(code) => code}
        className="flex flex-wrap gap-step-075"
        renderItem={(code) => (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => onRemove(code)}
                aria-label={`Remove ${code} from chart`}
                className="group flex items-center gap-step-075 rounded-full border border-neutral-500 bg-neutral-600 pl-step-100 pr-step-075 py-step-075 preset-5 uppercase text-foreground transition-colors cursor-pointer hover:border-destructive/40 hover:bg-destructive/10 focus-ring"
              >
                <CurrencyFlag
                  currencyCode={code}
                  isLoading={isLoading}
                  size={16}
                />

                <span>{code}</span>

                <span
                  aria-hidden="true"
                  className="preset-4 leading-none text-neutral-200 transition-colors group-hover:text-destructive"
                >
                  ×
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent>Remove {code} from chart</TooltipContent>
          </Tooltip>
        )}
      />
    </div>
  );
};

CompareChartCurrencyChips.displayName = "CompareChartCurrencyChips";

export default CompareChartCurrencyChips;
