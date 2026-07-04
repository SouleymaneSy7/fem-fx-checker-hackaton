import * as React from "react";

import Container from "@/components/common/container";
import Title from "@/components/common/title";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { useRateChart } from "@/hooks/use-rate-chart";
import { useConverterStore } from "@/store/converter-store";
import { formatChartDate, formatDateForRange } from "@/utils/format-date";
import RangeSelector from "../range-selector";
import RateChart from "../rate-chart";
import HistoryStat from "./history-stat";

const HistoryPanel = () => {
  const fromCurrency = useConverterStore((state) => state.fromCurrency);
  const toCurrency = useConverterStore((state) => state.toCurrency);
  const pair = `${fromCurrency}/${toCurrency}`;

  const { range, setRange, points, isLoading, error } = useRateChart(
    fromCurrency,
    toCurrency,
  );

  const hasData = points.length > 0 && !error && !isLoading;

  const openRate = points[0]?.rate;
  const lastRate = points[points.length - 1]?.rate;
  const change =
    hasData && openRate !== undefined && lastRate !== undefined
      ? lastRate - openRate
      : undefined;
  const percentChange =
    hasData && openRate ? ((change ?? 0) / openRate) * 100 : undefined;
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
                value={hasData ? openRate?.toFixed(4) : "—"}
              />
              <HistoryStat
                label="Last"
                value={hasData ? lastRate?.toFixed(4) : "—"}
              />
              <HistoryStat
                label="Change"
                value={
                  hasData
                    ? `${isPositive ? "+" : ""}${change?.toFixed(4)}`
                    : "—"
                }
                tone={
                  hasData ? (isPositive ? "positive" : "negative") : "neutral"
                }
              />
              <HistoryStat
                label="% change"
                value={
                  hasData
                    ? `${isPositive ? "▲ +" : "▼ -"}${Math.abs(percentChange ?? 0).toFixed(2)}%`
                    : "—"
                }
                tone={
                  hasData ? (isPositive ? "positive" : "negative") : "neutral"
                }
              />
            </div>

            <RangeSelector value={range} onValueChange={setRange} />
          </div>

          <div className="flex flex-col gap-step-250 rounded-xl border border-neutral-600 bg-card px-step-150 py-step-200 md:p-step-250">
            <div className="flex flex-wrap gap-step-200 items-center justify-between">
              <Title level="h3" className="preset-3 uppercase text-foreground">
                {pair}
              </Title>

              {hasData && lastTimestamp && (
                <p className="preset-5 uppercase text-neutral-200">
                  {lastRate?.toFixed(4)} ·{" "}
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
            We couldn't load rate history for USD/EUR right now. This usually
            clears up in a minute.
          </EmptyDescription>
        </Empty>
      )}
    </React.Fragment>
  );
};

export default HistoryPanel;
