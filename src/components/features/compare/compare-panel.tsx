"use client";

import { motion, useReducedMotion } from "motion/react";
import * as React from "react";

import Container from "@/components/common/container";
import List from "@/components/common/list";
import Title from "@/components/common/title";
import VisuallyHidden from "@/components/common/visually-hidden";
import ConfirmDialog from "@/components/shared/confirm-dialog";
import { CurrencyFlag } from "@/components/shared/currency-flag";
import DeleteButton from "@/components/shared/delete-button";
import FavoriteToggleIcon from "@/components/shared/favorite-toggle-icon";
import TextTooltip from "@/components/shared/text-tooltip";
import TrendIndicator from "@/components/shared/trend-indicator";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { MAX_CHART_CURRENCIES, SPRING_PANEL } from "@/constants";
import { useCompare } from "@/hooks/use-compare";
import { useCompareChart } from "@/hooks/use-compare-chart";
import { useCompareChartCurrencies } from "@/hooks/use-compare-chart-currencies";
import { useCompareCurrencies } from "@/hooks/use-compare-currencies";
import { useCurrencies } from "@/hooks/use-currencies";
import { getCurrencyFlagCode } from "@/services/currency-flags.service";
import type { CompareChartMoverType } from "@/types/data.types";
import type { CurrencyOptionType } from "@/types/ui.types";
import { formatAmount, formatPreciseAmount } from "@/utils/format-amount";
import { formatChartDate, formatFullDate } from "@/utils/format-date";
import RangeSelector from "../markets/range-selector";
import CompareChart from "./compare-chart/compare-chart";
import CompareChartCurrencyChips from "./compare-chart/compare-chart-currency-chips";
import CompareChartHint from "./compare-chart/compare-chart-hint";
import CompareChartSkeleton from "./compare-chart/compare-chart-skeleton";
import CompareCurrencyPicker from "./compare-currency-picker";

type CompareViewModeType = "table" | "chart";

const COMPARE_VIEW_INDICATOR_LAYOUT_ID = "compare-view-indicator";

const ComparePanel = () => {
  const {
    currencies: compareCurrencies,
    addCurrency,
    removeCurrency,
  } = useCompareCurrencies();

  const {
    currencies: chartSelection,
    addCurrency: addChartCurrency,
    removeCurrency: removeChartCurrency,
    isFull: isChartFull,
  } = useCompareChartCurrencies();

  const { amount, baseCurrency, rows, isLoading, toggleFavorite } =
    useCompare(compareCurrencies);
  const { currencies } = useCurrencies();

  const [viewMode, setViewMode] = React.useState<CompareViewModeType>("table");
  const shouldReduceMotion = useReducedMotion();

  const {
    quotes: chartCurrencies,
    range,
    setRange,
    points,
    isLoading: isChartLoading,
    error: chartError,
  } = useCompareChart(chartSelection, {
    enabled: viewMode === "chart",
  });

  const namesByCode = React.useMemo(() => {
    const map = new Map<string, string>();

    for (const currency of currencies ?? []) {
      map.set(currency.iso_code, currency.name);
    }
    return map;
  }, [currencies]);

  const currencyOptions = React.useMemo<CurrencyOptionType[]>(
    () =>
      currencies?.map((currency) => ({
        code: currency.iso_code,
        name: currency.name,
        flag: getCurrencyFlagCode(currency.iso_code) ?? "",
      })) ?? [],
    [currencies],
  );

  // Table and chart keep fully independent lists, so each gets its own
  // "addable" set — never the base currency (a no-op row/line, same
  // exclusion as converter-top.tsx's send/receive pickers) and never one
  // already present in that particular list.
  const addableTableCurrencyOptions = React.useMemo(
    () =>
      currencyOptions.filter(
        (option) =>
          option.code !== baseCurrency &&
          !compareCurrencies.includes(option.code),
      ),
    [currencyOptions, baseCurrency, compareCurrencies],
  );

  const addableChartCurrencyOptions = React.useMemo(
    () =>
      currencyOptions.filter(
        (option) =>
          option.code !== baseCurrency && !chartSelection.includes(option.code),
      ),
    [currencyOptions, baseCurrency, chartSelection],
  );

  const movers = React.useMemo(() => {
    const empty: {
      topGainer: CompareChartMoverType | null;
      topLoser: CompareChartMoverType | null;
    } = { topGainer: null, topLoser: null };

    if (points.length === 0 || chartCurrencies.length === 0) return empty;

    const lastPoint = points[points.length - 1];
    let topGainer: CompareChartMoverType | null = null;
    let topLoser: CompareChartMoverType | null = null;

    for (const code of chartCurrencies) {
      const value = lastPoint[code];
      if (typeof value !== "number") continue;

      if (!topGainer || value > topGainer.changePercent) {
        topGainer = { currency: code, changePercent: value };
      }
      if (!topLoser || value < topLoser.changePercent) {
        topLoser = { currency: code, changePercent: value };
      }
    }

    return { topGainer, topLoser };
  }, [points, chartCurrencies]);

  // Confirmation before a currency drops out of the table comparison —
  // mirrors alerts-panel/log-panel's pendingAction pattern. Chart removal
  // stays a single click: it's a lighter, easily-reversible toggle on a
  // selection capped at MAX_CHART_CURRENCIES, not a tracked comparison
  // row, so the extra confirmation step isn't warranted there.
  const [pendingRemoval, setPendingRemoval] = React.useState<string | null>(
    null,
  );
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

  const openConfirmRemoval = (currency: string) => {
    setPendingRemoval(currency);
    setIsConfirmOpen(true);
  };

  const handleConfirmRemoval = () => {
    if (pendingRemoval) removeCurrency(pendingRemoval);
    setIsConfirmOpen(false);
  };

  const confirmDescription = `This will remove ${pendingRemoval} from your comparison. You can add it back anytime from the currency picker.`;

  const hasCurrencies = rows.length > 0;
  const hasRows = hasCurrencies && amount > 0;
  const hasChartSelection = chartSelection.length > 0;
  const hasChartData = points.length > 0 && !chartError;
  const showTopLoser =
    movers.topLoser && movers.topLoser.currency !== movers.topGainer?.currency;

  return (
    <Container className="bg-card border border-neutral-600 rounded-xl space-y-step-200 p-step-200 md:space-y-step-250 md:p-step-250">
      <div className="flex flex-wrap items-baseline justify-between gap-step-125">
        <div className="flex flex-wrap items-center gap-step-150">
          <Title level="h3" className="preset-4 uppercase text-neutral-200">
            Multi-currency
          </Title>

          <span className="preset-3-med uppercase text-neutral-50">
            {formatAmount(amount)} from {baseCurrency}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-step-200">
          {viewMode === "table" ? (
            <React.Fragment>
              <p className="preset-5 text-neutral-100">{rows.length} pairs</p>

              <CompareCurrencyPicker
                currencies={addableTableCurrencyOptions}
                onSelect={addCurrency}
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <p className="preset-5 text-neutral-100">
                {chartSelection.length}/{MAX_CHART_CURRENCIES} currency in chart
              </p>

              <div className="flex items-center gap-step-100">
                <CompareCurrencyPicker
                  currencies={addableChartCurrencyOptions}
                  onSelect={addChartCurrency}
                  disabled={isChartFull}
                  disabledLabel={`Chart is full (${MAX_CHART_CURRENCIES}/${MAX_CHART_CURRENCIES}) — remove one to add another`}
                />

                <CompareChartHint baseCurrency={baseCurrency} />
              </div>
            </React.Fragment>
          )}

          <Separator orientation="vertical" />

          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(next) => {
              if (next) setViewMode(next as CompareViewModeType);
            }}
            aria-label="Compare view"
            className="bg-neutral-600"
          >
            <ToggleGroupItem
              value="table"
              className="flex-1"
              aria-label="Table view"
            >
              {viewMode === "table" && (
                <motion.span
                  aria-hidden="true"
                  layout
                  layoutId={COMPARE_VIEW_INDICATOR_LAYOUT_ID}
                  className="absolute inset-0 rounded-md bg-neutral-500"
                  style={{ originY: "0px" }}
                  transition={
                    shouldReduceMotion ? { duration: 0 } : SPRING_PANEL
                  }
                />
              )}
              <span className="relative z-10">Table</span>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="chart"
              className="flex-1"
              aria-label="Chart view"
            >
              {viewMode === "chart" && (
                <motion.span
                  aria-hidden="true"
                  layout
                  layoutId={COMPARE_VIEW_INDICATOR_LAYOUT_ID}
                  className="absolute inset-0 rounded-md bg-neutral-500"
                  style={{ originY: "0px" }}
                  transition={
                    shouldReduceMotion ? { duration: 0 } : SPRING_PANEL
                  }
                />
              )}
              <span className="relative z-10">Chart</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {viewMode === "table" ? (
        !hasCurrencies ? (
          <Empty className="py-step-300 md:py-step-400">
            <EmptyTitle>No currencies added yet</EmptyTitle>

            <EmptyDescription>
              Add a currency above to compare it against {baseCurrency}.
            </EmptyDescription>
          </Empty>
        ) : !hasRows ? (
          <Empty className="py-step-300 md:py-step-400">
            <EmptyTitle>No comparison available</EmptyTitle>

            <EmptyDescription>
              Enter an amount in Send above to see what your money is worth in
              other currencies.
            </EmptyDescription>
          </Empty>
        ) : (
          <React.Fragment>
            {/* biome-ignore lint/a11y/useSemanticElements: live region for loading state — <output> is semantically wrong for loading announcements */}
            <VisuallyHidden role="status">
              {isLoading ? "Loading comparison rates" : ""}
            </VisuallyHidden>

            <List
              items={rows}
              keyExtractor={(row) => row.currency}
              className="flex flex-col gap-step-150"
              renderItem={(row) => {
                const isRowLoading = isLoading && row.rate === undefined;
                const canFavorite =
                  row.isPinned || (row.rate !== undefined && !isLoading);

                return (
                  <li className="flex items-center gap-step-125 rounded-10 border border-neutral-500 bg-neutral-600 px-step-150 py-step-150 md:gap-step-250 md:px-step-200">
                    <CurrencyFlag
                      currencyCode={row.currency}
                      isLoading={isLoading}
                    />

                    <div className="min-w-0 flex flex-col gap-step-075 flex-1">
                      <p className="preset-4 uppercase text-foreground">
                        {row.currency}
                      </p>

                      <span className="preset-5 text-neutral-200 truncate">
                        {namesByCode.get(row.currency) ?? row.currency}
                      </span>
                    </div>

                    <div className="text-right flex flex-col gap-step-075">
                      {isRowLoading ? (
                        <React.Fragment>
                          <Skeleton className="h-4 w-20 ml-auto" />
                          <Skeleton className="h-3 w-14 ml-auto" />
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <p className="preset-3 uppercase text-foreground">
                            {row.convertedAmount !== undefined
                              ? formatAmount(row.convertedAmount)
                              : "—"}
                          </p>

                          {row.rate !== undefined ? (
                            <TextTooltip
                              className="preset-6 uppercase text-neutral-200 truncate"
                              content={`@ ${formatPreciseAmount(row.rate)}`}
                            >
                              @ {row.rate.toFixed(2)}
                            </TextTooltip>
                          ) : (
                            <p className="preset-6 uppercase text-neutral-200" />
                          )}
                        </React.Fragment>
                      )}
                    </div>

                    <div className="flex item-center gap-step-100">
                      <FavoriteToggleIcon
                        isFavorite={row.isPinned}
                        isSyncing={row.isFavoriteSyncing}
                        disabled={!canFavorite}
                        onToggle={() => toggleFavorite(row.currency)}
                        label={
                          row.isPinned
                            ? `Unpin: ${baseCurrency} to ${row.currency}`
                            : `Pin: ${baseCurrency} to ${row.currency}`
                        }
                      />

                      <DeleteButton
                        onClick={() => openConfirmRemoval(row.currency)}
                        label={`Remove ${row.currency} from comparison`}
                      />
                    </div>
                  </li>
                );
              }}
            />
          </React.Fragment>
        )
      ) : !hasChartSelection ? (
        <Empty className="py-step-300 md:py-step-400">
          <EmptyTitle>No currencies added to the chart yet</EmptyTitle>

          <EmptyDescription>
            Add up to {MAX_CHART_CURRENCIES} currencies above to compare their
            trend against {baseCurrency} — this selection is separate from the
            table.
          </EmptyDescription>
        </Empty>
      ) : (
        <React.Fragment>
          {/* biome-ignore lint/a11y/useSemanticElements: live region for chart loading state — <output> is semantically wrong for loading announcements */}
          <VisuallyHidden role="status">
            {isChartLoading ? "Loading comparison chart" : ""}
          </VisuallyHidden>

          <CompareChartCurrencyChips
            currencies={chartSelection}
            onRemove={removeChartCurrency}
            isLoading={isChartLoading}
          />

          {isChartLoading ? (
            <CompareChartSkeleton />
          ) : hasChartData ? (
            <React.Fragment>
              <p className="preset-5 text-neutral-200">
                Percentage change vs{" "}
                <span className="preset-5-med text-foreground">
                  {baseCurrency}
                </span>
                , since{" "}
                <span className="preset-5-med text-foreground">
                  {formatFullDate(points[0].date)}
                </span>
              </p>

              <div className="flex flex-wrap items-center justify-between gap-step-200">
                <div className="flex flex-wrap items-center gap-step-150">
                  {movers.topGainer && (
                    <p className="flex items-center gap-step-075 preset-5 uppercase text-neutral-200">
                      Top gainer
                      <span className="preset-5-med text-foreground">
                        {movers.topGainer.currency}
                      </span>
                      <TrendIndicator
                        isPositive={movers.topGainer.changePercent >= 0}
                        value={`${Math.abs(movers.topGainer.changePercent).toFixed(1)}%`}
                        className={
                          movers.topGainer.changePercent >= 0
                            ? "text-green"
                            : "text-red"
                        }
                      />
                    </p>
                  )}

                  <span> · </span>

                  {showTopLoser && movers.topLoser && (
                    <p className="flex items-center gap-step-075 preset-5 uppercase text-neutral-200">
                      Top loser
                      <span className="preset-5-med text-foreground">
                        {movers.topLoser.currency}
                      </span>
                      <TrendIndicator
                        isPositive={movers.topLoser.changePercent >= 0}
                        value={`${Math.abs(movers.topLoser.changePercent).toFixed(1)}%`}
                        className={
                          movers.topLoser.changePercent >= 0
                            ? "text-green"
                            : "text-red"
                        }
                      />
                    </p>
                  )}
                </div>

                <RangeSelector value={range} onValueChange={setRange} />
              </div>

              <CompareChart
                data={points}
                currencies={chartCurrencies}
                dateFormatter={(isoDate) => formatChartDate(isoDate, range)}
              />
            </React.Fragment>
          ) : (
            <p className="preset-5 text-neutral-200 text-center py-step-800">
              No chart data available for this range.
            </p>
          )}
        </React.Fragment>
      )}

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Remove this currency?"
        description={confirmDescription}
        confirmLabel="Remove"
        onConfirm={handleConfirmRemoval}
      />
    </Container>
  );
};

export default ComparePanel;
