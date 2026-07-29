"use client";

import * as React from "react";
import useSWR from "swr";

import { DEFAULT_CHART_RANGE } from "@/constants";
import { fetchRateHistory } from "@/services/rates.service";
import { useConverterStore } from "@/store/converter-store";
import type { CompareChartPointType, RateRangeType } from "@/types";
import { getDateRangeFromPeriod } from "@/utils/date-range";

type UseCompareChartOptionsType = {
  initialRange?: RateRangeType;
  // Set to false to skip fetching entirely — used to defer the request
  // until the user actually switches to chart view in ComparePanel,
  // instead of fetching history data nobody has asked to see yet.
  enabled?: boolean;
};

// Raw rates ride alongside the percent-change value under a suffixed key
// on the same point object, so the tooltip can read both without a
// second lookup structure to keep in sync by date. Defined once here and
// imported by compare-chart.tsx so the two files can't drift apart on
// the key format.
export const getRawRateKey = (currencyCode: string) => `${currencyCode}_raw`;

export function useCompareChart(
  targetCurrencies: string[],
  options: UseCompareChartOptionsType = {},
) {
  const { initialRange = DEFAULT_CHART_RANGE, enabled = true } = options;

  const baseCurrency = useConverterStore((state) => state.fromCurrency);
  const [range, setRange] = React.useState<RateRangeType>(initialRange);

  const quotes = React.useMemo(
    () => targetCurrencies.filter((code) => code !== baseCurrency),
    [targetCurrencies, baseCurrency],
  );

  const { from, to } = getDateRangeFromPeriod(range);
  const quotesKey = quotes.join(",");

  const swrKey =
    enabled && baseCurrency && quotesKey
      ? ["compare-chart", baseCurrency, quotesKey, range]
      : null;

  const { data, isLoading, error } = useSWR(swrKey, () =>
    fetchRateHistory(baseCurrency, quotes, from, to),
  );

  // Pivots the flat { date, quote, rate } rows into one point per date,
  // with each currency as its own key — the shape Recharts needs to draw
  // one <Line> per currency off a single dataset.
  const points = React.useMemo<CompareChartPointType[]>(() => {
    if (!data) return [];

    const byDate = new Map<string, CompareChartPointType>();

    for (const row of data) {
      const existing = byDate.get(row.date) ?? { date: row.date };
      existing[row.quote] = row.rate;
      byDate.set(row.date, existing);
    }

    const sorted = Array.from(byDate.values()).sort((a, b) =>
      a.date.localeCompare(b.date),
    );

    // Each currency is measured against its OWN first available point,
    // not a shared reference date — guards against a currency's history
    // starting a few days later than the others within the same range.
    const baseValueByQuote = new Map<string, number>();

    for (const point of sorted) {
      for (const quote of quotes) {
        const value = point[quote];
        if (typeof value === "number" && !baseValueByQuote.has(quote)) {
          baseValueByQuote.set(quote, value);
        }
      }
    }

    return sorted.map((point) => {
      const normalized: CompareChartPointType = { date: point.date };

      for (const quote of quotes) {
        const raw = point[quote];
        const base = baseValueByQuote.get(quote);

        if (typeof raw === "number" && base) {
          normalized[quote] = (raw / base - 1) * 100;
          normalized[getRawRateKey(quote)] = raw;
        }
      }

      return normalized;
    });
  }, [data, quotes]);

  return { baseCurrency, quotes, range, setRange, points, isLoading, error };
}
