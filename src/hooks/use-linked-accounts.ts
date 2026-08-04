"use client";

import useSWR from "swr";

import { authClient } from "@/lib/auth-client";

export function useLinkedAccounts() {
  const { data, error, isLoading, mutate } = useSWR(
    "linked-accounts",
    async () => {
      const { data, error } = await authClient.listAccounts();
      if (error) {
        throw new Error(error.message ?? "Couldn't load linked accounts.");
      }
      return data;
    },
  );

  const hasPassword =
    data?.some((account) => account.providerId === "credential") ?? false;

  return { accounts: data ?? [], hasPassword, isLoading, error, mutate };
}
