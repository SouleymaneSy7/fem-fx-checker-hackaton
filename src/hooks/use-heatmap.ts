"use client";

import * as React from "react";
import useSWR from "swr";

import {
  DEFAULT_CHART_RANGE,
  DEFAULT_HEATMAP_CURRENCIES,
  HEATMAP_PIVOT_CURRENCY,
} from "@/constants";
import { fetchLatestRates, fetchRates } from "@/services";
import type { HeatmapRowType, RateRangeType } from "@/types";
import { getDateRangeFromPeriod } from "@/utils";

// Builds the full N×N cross-currency grid from just two API calls by
// triangulating every pair through a single pivot currency, instead of
// fetching each pair directly (which would be N² requests):
//
//   rate(i→j, t) = rateAt[j, t] / rateAt[i, t]
//
// so the % change of i against j over the selected period is:
//
//   (rateNow[j] / rateNow[i]) / (rateThen[j] / rateThen[i]) - 1
//
// A positive value means the row currency (i) strengthened against the
// column currency (j) — 1 unit of i buys more j now than it did at the
// start of the period.
export function useHeatmap(
  currencies: string[] = DEFAULT_HEATMAP_CURRENCIES,
  initialRange: RateRangeType = DEFAULT_CHART_RANGE,
) {
  const [range, setRange] = React.useState<RateRangeType>(initialRange);

  const { from } = getDateRangeFromPeriod(range);
  const currenciesKey = currencies.join(",");

  const swrKey = currenciesKey ? ["heatmap", currenciesKey, range] : null;

  const { data, isLoading, error } = useSWR(swrKey, async () => {
    const [now, then] = await Promise.all([
      fetchLatestRates(HEATMAP_PIVOT_CURRENCY, currencies),
      fetchRates({
        base: HEATMAP_PIVOT_CURRENCY,
        quotes: currencies,
        date: from,
      }),
    ]);

    // Pre-seed the pivot's rate against itself — Frankfurter may or may
    // not echo it back in the `quotes` response, so this guarantees it's
    // always available for triangulation without depending on that.
    const rateNow: Record<string, number> = { [HEATMAP_PIVOT_CURRENCY]: 1 };
    for (const row of now) rateNow[row.quote] = row.rate;

    const rateThen: Record<string, number> = { [HEATMAP_PIVOT_CURRENCY]: 1 };
    for (const row of then) rateThen[row.quote] = row.rate;

    return { rateNow, rateThen, asOfDate: then[0]?.date };
  });

  const rows = React.useMemo<HeatmapRowType[]>(() => {
    if (!data) return [];

    return currencies.map((base) => ({
      currency: base,
      cells: currencies.map((quote) => {
        if (base === quote) return { currency: quote, changePercent: null };

        const nowBase = data.rateNow[base];
        const nowQuote = data.rateNow[quote];
        const thenBase = data.rateThen[base];
        const thenQuote = data.rateThen[quote];

        if (!nowBase || !nowQuote || !thenBase || !thenQuote) {
          return { currency: quote, changePercent: null };
        }

        const changePercent =
          (nowQuote / nowBase / (thenQuote / thenBase) - 1) * 100;

        return { currency: quote, changePercent };
      }),
    }));
  }, [data, currencies]);

  return {
    currencies,
    rows,
    range,
    setRange,
    asOfDate: data?.asOfDate,
    isLoading,
    error,
  };
}
