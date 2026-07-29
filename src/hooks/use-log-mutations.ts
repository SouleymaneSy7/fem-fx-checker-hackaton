"use client";

import * as React from "react";
import { toast } from "sonner";

import { useSession } from "@/lib/auth-client";
import {
  createLogEntry,
  deleteAllLogEntries,
  deleteLogEntriesForPair,
  deleteLogEntry,
} from "@/services";
import { useLogStore } from "@/store";
import type { LogEntryType } from "@/types";

export function useLogMutations() {
  const { data: session } = useSession();

  const addEntry = useLogStore((state) => state.addEntry);
  const addLoggedEntry = useLogStore((state) => state.addLoggedEntry);
  const removeEntry = useLogStore((state) => state.removeEntry);
  const removeEntriesForPair = useLogStore(
    (state) => state.removeEntriesForPair,
  );
  const clearLog = useLogStore((state) => state.clearLog);

  const [pendingPairIds, setPendingPairIds] = React.useState<Set<string>>(
    new Set(),
  );

  const setPending = (pairId: string, pending: boolean) => {
    setPendingPairIds((current) => {
      const next = new Set(current);
      if (pending) {
        next.add(pairId);
      } else {
        next.delete(pairId);
      }
      return next;
    });
  };

  const addLogEntry = async (entry: Omit<LogEntryType, "id" | "createdAt">) => {
    if (!session) {
      addEntry(entry);
      toast.success(
        `${entry.fromCurrency} → ${entry.toCurrency} conversion was saved locally.`,
      );
      return;
    }

    const pairId = `${entry.fromCurrency}-${entry.toCurrency}`;
    setPending(pairId, true);

    try {
      const created = await createLogEntry(entry);
      addLoggedEntry(created);
      toast.success(
        `${entry.fromCurrency} → ${entry.toCurrency} conversion saved to your log.`,
      );
    } catch {
      addEntry(entry);
      toast.warning(
        `Couldn't reach the server — your ${entry.fromCurrency} → ${entry.toCurrency} conversion was saved locally.`,
      );
    } finally {
      setPending(pairId, false);
    }
  };

  const removeLogEntry = (id: string) => {
    removeEntry(id);
    toast.success("Conversion removed from your log.");
    if (session) deleteLogEntry(id).catch(() => {});
  };

  const removeLogEntriesForPair = (
    fromCurrency: string,
    toCurrency: string,
  ) => {
    removeEntriesForPair(fromCurrency, toCurrency);
    if (session)
      deleteLogEntriesForPair(fromCurrency, toCurrency).catch(() => {});
  };

  const clearAllLogs = () => {
    clearLog();
    toast.success("Your conversion log has been cleared.");
    if (session) deleteAllLogEntries().catch(() => {});
  };

  const isAddPending = React.useCallback(
    (fromCurrency: string, toCurrency: string) =>
      pendingPairIds.has(`${fromCurrency}-${toCurrency}`),
    [pendingPairIds],
  );

  return {
    addLogEntry,
    removeLogEntry,
    removeLogEntriesForPair,
    clearAllLogs,
    isAddPending,
  };
}
