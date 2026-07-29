"use client";

import useSWR from "swr";

import { SWR_STALE_1H } from "@/constants";
import { fetchCurrencies } from "@/services";

export function useCurrencies() {
  const { data, error, isLoading } = useSWR(
    "currencies",
    () => fetchCurrencies(),
    {
      revalidateOnFocus: false,
      dedupingInterval: SWR_STALE_1H,
    },
  );

  return { currencies: data, isLoading, error };
}
