"use client";

import useSWR from "swr";
import { fetchCurrencies } from "@/services/currencies.service";

const ONE_HOUR = 1000 * 60 * 60;

export function useCurrencies() {
  const { data, error, isLoading } = useSWR(
    "currencies",
    () => fetchCurrencies(),
    {
      revalidateOnFocus: false,
      dedupingInterval: ONE_HOUR,
    },
  );

  return { currencies: data, isLoading, error };
}
