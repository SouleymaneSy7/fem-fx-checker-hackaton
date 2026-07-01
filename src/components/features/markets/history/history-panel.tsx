"use client";

import * as React from "react";
import Container from "@/components/common/container";
import Title from "@/components/common/title";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { formatChartDate, formatDateForRange } from "@/utils/format-date";
import {
  generatePlaceholderHistory,
  getPlaceholderRate,
} from "@/utils/placeholder";
import RangeSelector from "../range-selector";
import RateChart from "../rate-chart";
import HistoryStat from "./history-stat";

export type RatePointType = {
  date: string;
  rate: number;
};

export type RateRangeType = "1d" | "1w" | "1m" | "3m" | "1y" | "5y";

const sendCurrency = "USD";
const receiveCurrency = "EUR";
const isError = false;
const pair = "USD/EUR";

const HistoryPanel = () => {
  const [range, setRange] = React.useState<RateRangeType>("1m");
  const rate = getPlaceholderRate(sendCurrency, receiveCurrency);

  const historyData = React.useMemo(
    () => generatePlaceholderHistory(range, rate),
    [range, rate],
  );

  const hasData = historyData.length > 0 && !isError;

  const openRate = historyData[0]?.rate;
  const lastRate = historyData[historyData.length - 1]?.rate;
  const change =
    hasData && openRate !== undefined && lastRate !== undefined
      ? lastRate - openRate
      : undefined;
  const percentChange =
    hasData && openRate ? ((change ?? 0) / openRate) * 100 : undefined;
  const isPositive = (change ?? 0) >= 0;
  const lastTimestamp = historyData[historyData.length - 1]?.date;

  return (
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
              hasData ? `${isPositive ? "+" : ""}${change?.toFixed(4)}` : "—"
            }
            tone={hasData ? (isPositive ? "positive" : "negative") : "neutral"}
          />
          <HistoryStat
            label="% change"
            value={
              hasData
                ? `${isPositive ? "▲ +" : "▼ -"}${Math.abs(percentChange ?? 0).toFixed(2)}%`
                : "—"
            }
            tone={hasData ? (isPositive ? "positive" : "negative") : "neutral"}
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

        {hasData ? (
          <RateChart
            data={historyData}
            pair={pair}
            dateFormatter={(isoDate) => formatChartDate(isoDate, range)}
          />
        ) : (
          <Empty>
            <EmptyTitle>No chart data available</EmptyTitle>

            <EmptyDescription>
              We couldn't load rate history for USD/EUR right now. This usually
              clears up in a minute.
            </EmptyDescription>
          </Empty>
        )}
      </div>
    </Container>
  );
};

export default HistoryPanel;
