"use client";

import useSWR from "swr";

import { authClient } from "@/lib/auth-client";

export function useSessions() {
  const { data, error, isLoading, mutate } = useSWR("sessions", async () => {
    const { data, error } = await authClient.listSessions();
    if (error) throw new Error(error.message ?? "Couldn't load sessions.");
    return data;
  });

  return { sessions: data ?? [], isLoading, error, mutate };
}
