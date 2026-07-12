"use client";

import * as React from "react";

import Container from "@/components/common/container";
import List from "@/components/common/list";
import Title from "@/components/common/title";
import VisuallyHidden from "@/components/common/visually-hidden";
import { CurrencyFlag } from "@/components/shared/currency-flag";
import FavoriteToggleIcon from "@/components/shared/favorite-toggle-icon";
import TrendIndicator from "@/components/shared/trend-indicator";
import TruncateTooltip from "@/components/shared/truncate-tooltip";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DEFAULT_COMPARE_CURRENCIES } from "@/constants";
import { useCompare } from "@/hooks/use-compare";
import { useCompareChart } from "@/hooks/use-compare-chart";
import { useCurrencies } from "@/hooks/use-currencies";
import type { CompareChartMoverType } from "@/types/data.types";
import { formatAmount, formatPreciseAmount } from "@/utils/format-amount";
import { formatChartDate, formatShortDate } from "@/utils/format-date";
import RangeSelector from "../markets/range-selector";
import CompareChart from "./compare-chart";

type CompareViewModeType = "table" | "chart";

const ComparePanel = () => {
  const { amount, baseCurrency, rows, isLoading, toggleFavorite } = useCompare(
    DEFAULT_COMPARE_CURRENCIES,
  );
  const { currencies } = useCurrencies();

  const [viewMode, setViewMode] = React.useState<CompareViewModeType>("table");

  const {
    quotes: chartCurrencies,
    range,
    setRange,
    points,
    isLoading: isChartLoading,
    error: chartError,
  } = useCompareChart(DEFAULT_COMPARE_CURRENCIES, {
    enabled: viewMode === "chart",
  });

  const namesByCode = React.useMemo(() => {
    const map = new Map<string, string>();

    for (const currency of currencies ?? []) {
      map.set(currency.iso_code, currency.name);
    }
    return map;
  }, [currencies]);

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

  const hasRows = rows.length > 0 && amount > 0;
  const hasChartData = points.length > 0 && !chartError;
  const showTopLoser =
    movers.topLoser && movers.topLoser.currency !== movers.topGainer?.currency;

  return (
    <React.Fragment>
      {hasRows ? (
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
              <p className="preset-5 text-neutral-100">{rows.length} pairs</p>

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
                  Table
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="chart"
                  className="flex-1"
                  aria-label="Chart view"
                >
                  Chart
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          {viewMode === "table" ? (
            <React.Fragment>
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

                        <TruncateTooltip className="preset-5 text-neutral-200">
                          {namesByCode.get(row.currency) ?? row.currency}
                        </TruncateTooltip>
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
                              <TruncateTooltip
                                className="preset-6 uppercase text-neutral-200"
                                content={`@ ${formatPreciseAmount(row.rate)}`}
                              >
                                @ {row.rate.toFixed(2)}
                              </TruncateTooltip>
                            ) : (
                              <p className="preset-6 uppercase text-neutral-200" />
                            )}
                          </React.Fragment>
                        )}
                      </div>

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
                    </li>
                  );
                }}
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              {hasChartData && (
                <p className="preset-5 text-neutral-200">
                  Exchange rate change vs{" "}
                  <span className="preset-5-med text-foreground">
                    {baseCurrency}
                  </span>
                  , since{" "}
                  <span className="preset-5-med text-foreground">
                    {formatShortDate(points[0].date)}
                  </span>
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-step-200">
                <div className="flex flex-wrap items-center gap-step-200">
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

              <VisuallyHidden role="status">
                {isChartLoading ? "Loading comparison chart" : ""}
              </VisuallyHidden>

              {isChartLoading ? (
                <Skeleton className="h-75 w-full rounded-xl" />
              ) : hasChartData ? (
                <CompareChart
                  data={points}
                  currencies={chartCurrencies}
                  dateFormatter={(isoDate) => formatChartDate(isoDate, range)}
                />
              ) : (
                <p className="preset-5 text-neutral-200 text-center py-step-500">
                  No chart data available for this range.
                </p>
              )}
            </React.Fragment>
          )}
        </Container>
      ) : (
        <Empty>
          <EmptyTitle>No comparison available</EmptyTitle>

          <EmptyDescription>
            Enter an amount in SEND above to see what your money is worth in
            other currencies.
          </EmptyDescription>
        </Empty>
      )}
    </React.Fragment>
  );
};

export default ComparePanel;
