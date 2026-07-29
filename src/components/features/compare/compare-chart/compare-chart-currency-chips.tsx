import { List, VisuallyHidden } from "@/components/common";
import { CurrencyFlag } from "@/components/shared";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui";
import type { CompareChartCurrencyChipsPropsType } from "@/types";

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
                className="group preset-5 focus-ring flex cursor-pointer items-center gap-step-075 rounded-full border border-neutral-500 bg-neutral-600 py-step-075 pr-step-075 pl-step-100 text-foreground uppercase transition-colors hover:border-destructive/40 hover:bg-destructive/10"
              >
                <CurrencyFlag
                  currencyCode={code}
                  isLoading={isLoading}
                  size={16}
                />

                <span>{code}</span>

                <span
                  aria-hidden="true"
                  className="preset-4 text-neutral-200 leading-none transition-colors group-hover:text-destructive"
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
