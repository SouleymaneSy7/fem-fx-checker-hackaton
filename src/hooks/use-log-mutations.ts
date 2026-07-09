"use client";

import { useSession } from "@/lib/auth-client";
import {
  createLogEntry,
  deleteAllLogEntries,
  deleteLogEntriesForPair,
  deleteLogEntry,
} from "@/services/logs.service";
import { useLogStore } from "@/store/log-store";
import type { LogEntryType } from "@/types/data.types";

// Single entry point for every log mutation — mirrors
// use-favorite-mutations.ts. Signed out: identical to today (instant,
// client-generated id). Signed in: awaits the server so the entry the
// store ends up holding carries the real row id (needed for later
// single-entry deletes to hit the right server row).
export function useLogMutations() {
  const { data: session } = useSession();

  const addEntry = useLogStore((state) => state.addEntry);
  const addLoggedEntry = useLogStore((state) => state.addLoggedEntry);
  const removeEntry = useLogStore((state) => state.removeEntry);
  const removeEntriesForPair = useLogStore(
    (state) => state.removeEntriesForPair,
  );
  const clearLog = useLogStore((state) => state.clearLog);

  const addLogEntry = async (entry: Omit<LogEntryType, "id" | "createdAt">) => {
    if (!session) {
      addEntry(entry);
      return;
    }

    try {
      const created = await createLogEntry(entry);
      addLoggedEntry(created);
    } catch {
      // Falls back to a local-only entry so the action never silently
      // does nothing from the user's point of view.
      addEntry(entry);
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

  return { addLogEntry, removeLogEntry, removeLogEntriesForPair, clearAllLogs };
}
