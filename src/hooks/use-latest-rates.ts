"use client";

import * as React from "react";
import useSWR from "swr";

import { SWR_STALE_5M } from "@/constants";
import { fetchLatestRates } from "@/services/rates.service";

export function useLatestRates(base: string, quotes?: string[]) {
  const key = base ? ["latest-rates", base, quotes?.join(",") ?? ""] : null;

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
