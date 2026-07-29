"use client";

import useSWR from "swr";

import { SWR_STALE_1D } from "@/constants";
import { fetchCurrenciesForFlags } from "@/services";

export function useCurrencyFlags() {
  const { data, error, isLoading } = useSWR(
    "currencies-flags",
    fetchCurrenciesForFlags,
    {
      revalidateOnFocus: false,
      dedupingInterval: SWR_STALE_1D,
    },
  );

  return { currencies: data ?? [], isLoading, error };
}
