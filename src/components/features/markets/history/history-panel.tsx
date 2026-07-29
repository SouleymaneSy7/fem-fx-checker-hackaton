"use client";

import * as React from "react";

import Container from "@/components/common/container";
import Title from "@/components/common/title";
import TrendIndicator from "@/components/shared/trend-indicator";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { SHORTCUT_EVENTS } from "@/constants";
import { useRateChart } from "@/hooks/use-rate-chart";
import { useConverterStore } from "@/store/converter-store";
import type { SetRateRangeDetail } from "@/types";
import { formatAmount, formatPreciseAmount } from "@/utils/format-amount";
import { formatChartDate, formatDateForRange } from "@/utils/format-date";
import RangeSelector from "../range-selector";
import RateChart from "../rate-chart";
import HistorySkeleton from "./history-skeleton";
import HistoryStat from "./history-stat";

const HistoryPanel = () => {
  const fromCurrency = useConverterStore((state) => state.fromCurrency);
  const toCurrency = useConverterStore((state) => state.toCurrency);
  const pair = `${fromCurrency}/${toCurrency}`;

  const { range, setRange, points, isLoading, error } = useRateChart(
    fromCurrency,
    toCurrency,
  );

  React.useEffect(() => {
    const handleSetRange = (event: Event) => {
      const detail = (event as CustomEvent<SetRateRangeDetail>).detail;
      if (detail?.range) setRange(detail.range);
    };

    window.addEventListener(SHORTCUT_EVENTS.setRateRange, handleSetRange);

    return () =>
      window.removeEventListener(SHORTCUT_EVENTS.setRateRange, handleSetRange);
  }, [setRange]);

  // Hooks are all above this line — safe to branch early from here on.
  if (isLoading) {
    return <HistorySkeleton pair={pair} />;
  }

  const hasData = points.length > 0 && !error;

  const openRate = points[0]?.rate;
  const lastRate = points[points.length - 1]?.rate;
  const change =
    openRate !== undefined && lastRate !== undefined
      ? lastRate - openRate
      : undefined;
  const percentChange = openRate ? ((change ?? 0) / openRate) * 100 : undefined;
  const isPositive = (change ?? 0) >= 0;
  const lastTimestamp = points[points.length - 1]?.date;

  return (
    <React.Fragment>
      {hasData ? (
        <Container className="flex flex-col gap-step-200 md:gap-step-250">
          <div className="flex flex-col gap-step-250 lg:flex-row lg:items-center lg:justify-between">
            <div className="history-stat-grid">
              <HistoryStat
                label="Open"
                value={formatAmount(openRate)}
                tooltipContent={
                  openRate !== undefined
                    ? formatPreciseAmount(openRate)
                    : undefined
                }
              />
              <HistoryStat
                label="Last"
                value={formatAmount(lastRate)}
                tooltipContent={
                  lastRate !== undefined
                    ? formatPreciseAmount(lastRate)
                    : undefined
                }
              />
              <HistoryStat
                label="Change"
                value={`${isPositive ? "+" : ""}${change?.toFixed(2)}`}
                tooltipContent={
                  change !== undefined
                    ? `${isPositive ? "+" : ""}${formatPreciseAmount(change)}`
                    : undefined
                }
                tone={isPositive ? "positive" : "negative"}
              />
              <HistoryStat
                label="% change"
                value={
                  <TrendIndicator
                    isPositive={isPositive}
                    value={`${isPositive ? "+" : "-"}${Math.abs(percentChange ?? 0).toFixed(2)}%`}
                  />
                }
                tooltipContent={
                  percentChange !== undefined
                    ? `${isPositive ? "+" : "-"}${Math.abs(percentChange).toFixed(4)}%`
                    : undefined
                }
                tone={isPositive ? "positive" : "negative"}
              />
            </div>

            <RangeSelector value={range} onValueChange={setRange} />
          </div>

          <div className="flex flex-col gap-step-250 rounded-xl border border-neutral-500 dark:border-neutral-600 bg-card px-step-150 py-step-200 md:p-step-250">
            <div className="flex flex-wrap gap-step-200 items-center justify-between">
              <Title level="h3" className="preset-3 uppercase text-foreground">
                {pair}
              </Title>

              {lastTimestamp && (
                <p className="preset-5 uppercase text-neutral-200">
                  {formatAmount(lastRate)} ·{" "}
                  {formatDateForRange(lastTimestamp, range)}
                </p>
              )}
            </div>

            <RateChart
              data={points}
              pair={pair}
              dateFormatter={(isoDate) => formatChartDate(isoDate, range)}
            />
          </div>
        </Container>
      ) : (
        <Empty>
          <EmptyTitle>No chart data available</EmptyTitle>

          <EmptyDescription>
            We couldn't load rate history for {pair} right now. This usually
            clears up in a minute.
          </EmptyDescription>
        </Empty>
      )}
    </React.Fragment>
  );
};

export default HistoryPanel;
