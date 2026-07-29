"use client";

import * as React from "react";
import {
  Line,
  LineChart,
  Tooltip as RechartsTooltip,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import VisuallyHidden from "@/components/common/visually-hidden";
import TrendIndicator from "@/components/shared/trend-indicator";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CHART_SERIES_COLORS } from "@/constants";
import { getRawRateKey } from "@/hooks/use-compare-chart";
import { cn } from "@/lib/utils";
import type {
  CompareChartPropsType,
  CompareChartTooltipPropsType,
} from "@/types";
import { formatAmount } from "@/utils/format-amount";

const formatPercent = (value: number) =>
  `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;

const CustomTooltip = ({
  active,
  payload,
  label,
  dateFormatter,
}: CompareChartTooltipPropsType) => {
  if (!active || !payload?.length || !label) return null;

  return (
    <div className="flex flex-col gap-step-075 rounded-8 border border-border bg-popover px-step-150 py-step-100 shadow-lg">
      <p className="preset-6 uppercase text-neutral-200">
        {dateFormatter(label)}
      </p>

      <div className="flex flex-col gap-step-050">
        {payload.map((entry) => {
          if (typeof entry.value !== "number") return null;

          const rawRate = entry.payload[getRawRateKey(entry.dataKey)];

          return (
            <p
              key={entry.dataKey}
              className="preset-5-med uppercase flex items-center gap-step-075"
            >
              <span
                aria-hidden="true"
                className="size-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-neutral-200">{entry.dataKey}</span>
              <span className="text-foreground">
                {formatPercent(entry.value)}
              </span>
              {typeof rawRate === "number" && (
                <span className="text-neutral-200">
                  (@ {formatAmount(rawRate)})
                </span>
              )}
            </p>
          );
        })}
      </div>
    </div>
  );
};

const CompareChart = ({
  data,
  currencies,
  dateFormatter,
}: CompareChartPropsType) => {
  const [hiddenCurrencies, setHiddenCurrencies] = React.useState<Set<string>>(
    new Set(),
  );

  const toggleCurrency = (code: string) => {
    setHiddenCurrencies((current) => {
      const next = new Set(current);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  // Drives both the legend's inline "current standing" readout and the
  // screen-reader summary below — computed once and shared, so the
  // visible legend and the accessible text never disagree.
  const lastPoint = data[data.length - 1];

  const summaryText = currencies
    .map((code) => {
      const value = lastPoint?.[code];
      if (typeof value !== "number") return null;
      return `${code} ${formatPercent(value)}`;
    })
    .filter((entry): entry is string => entry !== null)
    .join(", ");

  return (
    <div className="flex flex-col gap-step-200">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 12, right: 8, bottom: 0, left: 0 }}
        >
          <ReferenceLine
            y={0}
            stroke="var(--neutral-500)"
            strokeDasharray="4 4"
            strokeOpacity={1}
          />

          <XAxis
            dataKey="date"
            tickFormatter={dateFormatter}
            tick={{ fill: "var(--neutral-200)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={120}
            tickMargin={10}
          />

          <YAxis
            tickFormatter={(value: number) => formatPercent(value)}
            tick={{ fill: "var(--neutral-200)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={52}
            tickMargin={10}
          />

          <RechartsTooltip
            content={<CustomTooltip dateFormatter={dateFormatter} />}
            cursor={{ stroke: "var(--neutral-400)", strokeDasharray: "4 4" }}
          />

          {currencies.map((code, index) => (
            <Line
              key={code}
              type="linear"
              dataKey={code}
              name={code}
              hide={hiddenCurrencies.has(code)}
              stroke={CHART_SERIES_COLORS[index] ?? "var(--primary)"}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--neutral-900)" }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      <div className="flex flex-col gap-step-200 mt-step-200 md:mt-step-250">
        <p className="preset-6 uppercase text-neutral-200">
          Select a currency to show or hide its line
        </p>

        {/* biome-ignore lint/a11y/useSemanticElements: toggle button group — <fieldset> would add unwanted borders and is semantically for form controls */}
        <div
          role="group"
          aria-label="Toggle currencies shown on chart"
          className="flex flex-wrap items-center gap-step-100"
        >
          {currencies.map((code, index) => {
            const isHidden = hiddenCurrencies.has(code);
            const lastValue = lastPoint?.[code];

            return (
              <Tooltip key={code}>
                <TooltipTrigger asChild>
                  <Button
                    variant={"ghost"}
                    type="button"
                    aria-pressed={!isHidden}
                    onClick={() => toggleCurrency(code)}
                    className={cn(
                      "flex items-center gap-step-050 rounded-6 p-step-075 preset-5 uppercase transition-opacity border border-neutral-500 bg-neutral-600 focus-ring",
                      isHidden ? "opacity-50" : "opacity-100",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="size-step-100 rounded-full"
                      style={{
                        backgroundColor:
                          CHART_SERIES_COLORS[index] ?? "var(--primary)",
                      }}
                    />

                    <span className="text-foreground">{code}</span>

                    {typeof lastValue === "number" && (
                      <TrendIndicator
                        isPositive={lastValue >= 0}
                        value={`${Math.abs(lastValue).toFixed(2)}%`}
                        className={cn(
                          "preset-6",
                          lastValue >= 0 ? "text-green" : "text-red",
                        )}
                      />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isHidden
                    ? `Show ${code} on chart`
                    : `Hide ${code} from chart`}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>

      {/* biome-ignore lint/a11y/useSemanticElements: live region for screen reader announcements — <output> is semantically wrong for loading summaries */}
      <VisuallyHidden role="status">
        {summaryText && `Current change by currency: ${summaryText}`}
      </VisuallyHidden>
    </div>
  );
};

export default CompareChart;
