"use client";

import useSWR from "swr";
import { SWR_STALE_5M } from "@/constants";
import { fetchRate } from "@/services/rate.service";

export function useRate(base: string, quote: string) {
  const key = base && quote ? ["rate", base, quote] : null;

  const { data, error, isLoading } = useSWR(key, () => fetchRate(base, quote), {
    dedupingInterval: SWR_STALE_5M,
  });

  return { rate: data?.rate, date: data?.date, isLoading, error };
}
