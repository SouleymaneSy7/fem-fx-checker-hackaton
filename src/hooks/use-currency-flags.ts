"use client";

import useSWR from "swr";

import { fetchCurrenciesForFlags } from "@/services/currency-flags.service";

const ONE_DAY = 1000 * 60 * 60 * 24;

export function useCurrencyFlags() {
  const { data, error, isLoading } = useSWR(
    "currencies-flags",
    fetchCurrenciesForFlags,
    {
      revalidateOnFocus: false,
      dedupingInterval: ONE_DAY,
    },
  );

  return { currencies: data ?? [], isLoading, error };
}
