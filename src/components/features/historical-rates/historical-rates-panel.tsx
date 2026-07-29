"use client";

import { format } from "date-fns";
import * as React from "react";

import { Container, Title, VisuallyHidden } from "@/components/common";
import { ArrowRightIcon } from "@/components/icons";
import { DatePicker, TextTooltip, TrendIndicator } from "@/components/shared";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui";
import { HISTORICAL_RATES_MIN_DATE } from "@/constants";
import { useHistoricalRates } from "@/hooks";
import { cn } from "@/lib/utils";
import { formatAmount, formatFullDate, formatPreciseAmount } from "@/utils";
import HistoricalRatesSkeleton from "./historical-rates-skeleton";

const HistoricalRatesPanel = () => {
  const [date, setDate] = React.useState<string | undefined>(undefined);

  const { amount, fromCurrency, toCurrency, result, isLoading, error } =
    useHistoricalRates(date);

  // Kept in state rather than recomputed every render, so the DatePicker's
  // `maxDate` prop stays referentially stable — a keystroke elsewhere in
  // the app shouldn't needlessly re-render the calendar grid. Refreshed on
  // tab focus and at the next local midnight so a panel left open
  // overnight doesn't keep "today" pinned to yesterday.
  const [maxDate, setMaxDate] = React.useState(() =>
    format(new Date(), "yyyy-MM-dd"),
  );

  React.useEffect(() => {
    const refresh = () => {
      const today = format(new Date(), "yyyy-MM-dd");
      setMaxDate((current) => (current === today ? current : today));
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Also catches a tab that stays visible and active straight through
    // midnight — one precise timer for the next rollover. Once it fires,
    // `maxDate` changes, this effect re-runs, and the next one gets
    // scheduled relative to the new "now".
    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      5,
    );
    const timeoutId = window.setTimeout(
      refresh,
      nextMidnight.getTime() - now.getTime(),
    );

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.clearTimeout(timeoutId);
    };
  });

  const showDateMismatch =
    result !== undefined && result.historicalDate !== result.requestedDate;

  // Screen-reader summary of the current comparison — same VisuallyHidden
  // + role="status" pattern as CompareChart, so assistive tech hears the
  // result the moment it lands without a separate live region per field.
  const summaryText = result
    ? `On ${formatFullDate(result.historicalDate)}, ${formatAmount(amount)} ${fromCurrency} was worth ${formatAmount(result.historicalAmount)} ${toCurrency}. Today it's worth ${formatAmount(result.currentAmount)} ${toCurrency}, a ${result.percentChange >= 0 ? "gain" : "loss"} of ${Math.abs(result.percentChange).toFixed(2)}%.`
    : "";

  return (
    <Container className="bg-card border border-neutral-600 rounded-xl space-y-step-200 p-step-200 md:space-y-step-250 md:p-step-250">
      <div className="flex flex-wrap items-baseline justify-between gap-step-125">
        <div className="flex flex-wrap items-center gap-step-150">
          <Title level="h3" className="preset-4 uppercase text-neutral-200">
            Historical Rates
          </Title>

          <div className="flex items-center gap-step-100">
            <span className="preset-3-med uppercase text-neutral-50">
              {formatAmount(amount)} {fromCurrency}
            </span>
            <ArrowRightIcon className="text-neutral-200" size={12} />
            <span className="preset-3-med uppercase text-neutral-50">
              {toCurrency}
            </span>
          </div>
        </div>
      </div>

      <DatePicker
        value={date}
        onValueChange={setDate}
        minDate={HISTORICAL_RATES_MIN_DATE}
        maxDate={maxDate}
        label="Pick a past date"
        placeholder="Pick a date"
      />

      {/* biome-ignore lint/a11y/useSemanticElements: live region for loading/result announcements — <output> is semantically wrong */}
      <VisuallyHidden role="status">
        {isLoading
          ? `Loading rate for ${formatFullDate(date ?? maxDate)}`
          : summaryText}
      </VisuallyHidden>

      {!date ? (
        <Empty className="py-step-300 md:py-step-400">
          <EmptyTitle>Pick a date to travel back</EmptyTitle>

          <EmptyDescription>
            See what {formatAmount(amount)} {fromCurrency} was worth in{" "}
            {toCurrency} on any day since January 4, 1999, compared to today.
          </EmptyDescription>
        </Empty>
      ) : isLoading ? (
        <HistoricalRatesSkeleton date={date} />
      ) : error || !result ? (
        <p className="preset-5 text-destructive/80 text-center py-step-300">
          Couldn't load the rate for {formatFullDate(date)}. This usually clears
          up in a minute.
        </p>
      ) : (
        <div className="flex flex-col gap-step-150">
          <div className="grid grid-cols-1 gap-step-150 sm:grid-cols-2">
            <div className="flex flex-col gap-step-100 rounded-10 border border-neutral-500 bg-neutral-600 p-step-150 md:p-step-200">
              <TextTooltip
                className="preset-5 uppercase text-neutral-200"
                content={`European Central Bank end-of-day rate for ${formatFullDate(result.historicalDate)}`}
              >
                Then · {formatFullDate(result.historicalDate)}
              </TextTooltip>

              <TextTooltip
                className="preset-3 uppercase text-foreground"
                content={`${formatPreciseAmount(result.historicalAmount)} ${toCurrency}`}
              >
                {formatAmount(result.historicalAmount)} {toCurrency}
              </TextTooltip>

              <TextTooltip
                className="preset-6 uppercase text-neutral-200"
                content={`1 ${fromCurrency} = ${formatPreciseAmount(result.historicalRate)} ${toCurrency}`}
              >
                1 {fromCurrency} = {formatAmount(result.historicalRate)}{" "}
                {toCurrency}
              </TextTooltip>
            </div>

            <div className="flex flex-col gap-step-100 rounded-10 border border-neutral-500 bg-neutral-600 p-step-150 md:p-step-200">
              <TextTooltip
                className="preset-5 uppercase text-neutral-200"
                content={`Latest European Central Bank end-of-day rate (${formatFullDate(result.currentDate)})`}
              >
                Now · {formatFullDate(result.currentDate)}
              </TextTooltip>

              <TextTooltip
                className="preset-3 uppercase text-primary"
                content={`${formatPreciseAmount(result.currentAmount)} ${toCurrency}`}
              >
                {formatAmount(result.currentAmount)} {toCurrency}
              </TextTooltip>

              <TextTooltip
                className="preset-6 uppercase text-neutral-200"
                content={`1 ${fromCurrency} = ${formatPreciseAmount(result.currentRate)} ${toCurrency}`}
              >
                1 {fromCurrency} = {formatAmount(result.currentRate)}{" "}
                {toCurrency}
              </TextTooltip>
            </div>
          </div>

          <div className="flex items-center justify-between gap-step-150 rounded-10 border border-neutral-500 bg-neutral-600 px-step-150 py-step-150 md:px-step-200">
            <TextTooltip
              className="preset-4 uppercase text-neutral-200"
              content="Difference between the historical rate and today's rate."
            >
              Change
            </TextTooltip>

            <TrendIndicator
              isPositive={result.percentChange >= 0}
              value={`${formatAmount(Math.abs(result.absoluteChange))} ${toCurrency} (${Math.abs(result.percentChange).toFixed(2)}%)`}
              className={cn(
                "preset-4",
                result.percentChange >= 0 ? "text-green" : "text-red",
              )}
            />
          </div>

          {showDateMismatch && (
            <p className="preset-6 text-neutral-200">
              Markets were closed on {formatFullDate(result.requestedDate)} —
              showing the nearest available date.
            </p>
          )}
        </div>
      )}
    </Container>
  );
};

export default HistoricalRatesPanel;
