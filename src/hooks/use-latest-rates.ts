"use client";

import * as React from "react";
import useSWR from "swr";

import { fetchLatestRates } from "@/services/rates.service";

const FIVE_MINUTES = 1000 * 60 * 5;

export function useLatestRates(base: string, quotes?: string[]) {
  const key = base ? ["latest-rates", base, quotes?.join(",") ?? ""] : null;

  const { data, error, isLoading } = useSWR(
    key,
    () => fetchLatestRates(base, quotes),
    {
      dedupingInterval: FIVE_MINUTES,
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
