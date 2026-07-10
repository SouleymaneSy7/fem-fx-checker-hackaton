"use client";

import * as React from "react";

import { useSession } from "@/lib/auth-client";
import {
  createLogEntry,
  deleteAllLogEntries,
  deleteLogEntriesForPair,
  deleteLogEntry,
} from "@/services/logs.service";
import { useLogStore } from "@/store/log-store";
import type { LogEntryType } from "@/types/data.types";

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
      return;
    }

    const pairId = `${entry.fromCurrency}-${entry.toCurrency}`;
    setPending(pairId, true);

    try {
      const created = await createLogEntry(entry);
      addLoggedEntry(created);
    } catch {
      // Falls back to a local-only entry so the action never silently
      // does nothing from the user's point of view.
      addEntry(entry);
    } finally {
      setPending(pairId, false);
    }
  };

  const removeLogEntry = (id: string) => {
    removeEntry(id);
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
