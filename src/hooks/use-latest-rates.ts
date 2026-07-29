"use client";

import * as React from "react";
import useSWR from "swr";

import { SWR_STALE_5M } from "@/constants";
import { fetchLatestRates } from "@/services";

export function useLatestRates(base: string, quotes?: string[]) {
  // `quotes === undefined` still fetches (no filter = every rate for the
  // base); an explicit empty array means "nothing to compare" and should
  // skip the request entirely rather than hit the API with a blank filter.
  const key =
    base && (quotes === undefined || quotes.length > 0)
      ? ["latest-rates", base, quotes?.join(",") ?? ""]
      : null;

  const { data, error, isLoading } = useSWR(
    key,
    () => fetchLatestRates(base, quotes),
    {
      dedupingInterval: SWR_STALE_5M,
    },
  );

  // Flatten the array of { quote, rate } rows into a lookup map so
  // consumers can do `rates[currency]` instead of scanning an array.
  const rates = React.useMemo(() => {
    if (!data) return undefined;
    return Object.fromEntries(data.map((row) => [row.quote, row.rate]));
  }, [data]);

  return { rates, date: data?.[0]?.date, isLoading, error };
}
