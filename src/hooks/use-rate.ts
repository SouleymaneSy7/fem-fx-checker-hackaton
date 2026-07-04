"use client";

import useSWR from "swr";

import { fetchRate } from "@/services/rate.service";

const FIVE_MINUTES = 1000 * 60 * 5;

export function useRate(base: string, quote: string) {
  const key = base && quote ? ["rate", base, quote] : null;

  const { data, error, isLoading } = useSWR(key, () => fetchRate(base, quote), {
    dedupingInterval: FIVE_MINUTES,
  });

  return { rate: data?.rate, date: data?.date, isLoading, error };
}
