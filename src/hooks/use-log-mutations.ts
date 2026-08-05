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
import { runOptimisticMutation } from "@/utils";

export function useLogMutations() {
  const { data: session } = useSession();

  const addEntry = useLogStore((state) => state.addEntry);
  const addLoggedEntry = useLogStore((state) => state.addLoggedEntry);
  const removeEntry = useLogStore((state) => state.removeEntry);
  const removeEntriesForPair = useLogStore(
    (state) => state.removeEntriesForPair,
  );
  const clearLog = useLogStore((state) => state.clearLog);
  const replaceEntries = useLogStore((state) => state.replaceEntries);

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

    // Client-generated temp id so the entry is visible right away —
    // reconciled with the server's real id in onSuccess, or removed
    // entirely on rollback.
    const tempEntry: LogEntryType = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };

    setPending(pairId, true);

    await runOptimisticMutation({
      apply: () => addLoggedEntry(tempEntry),
      rollback: () => {
        removeEntry(tempEntry.id);
        toast.error(
          `Couldn't save the ${entry.fromCurrency} → ${entry.toCurrency} conversion — try again.`,
        );
      },
      request: () => createLogEntry(entry),
      onSuccess: (created) => {
        removeEntry(tempEntry.id);
        addLoggedEntry(created);
        toast.success(
          `${entry.fromCurrency} → ${entry.toCurrency} conversion saved to your log.`,
        );
      },
    });

    setPending(pairId, false);
  };

  const removeLogEntry = async (id: string) => {
    if (!session) {
      removeEntry(id);
      toast.success("Conversion removed from your log.");
      return;
    }

    const snapshot = useLogStore.getState().entries;

    await runOptimisticMutation({
      apply: () => {
        removeEntry(id);
        toast.success("Conversion removed from your log.");
      },
      rollback: () => {
        replaceEntries(snapshot);
        toast.error("Couldn't remove that conversion — try again.");
      },
      request: () => deleteLogEntry(id),
    });
  };

  // No toast on success here even before this change (see log-panel.tsx —
  // this fires from the converter's own un-log button, where the button
  // flipping state is feedback enough) — rollback stays silent to match.
  const removeLogEntriesForPair = async (
    fromCurrency: string,
    toCurrency: string,
  ) => {
    if (!session) {
      removeEntriesForPair(fromCurrency, toCurrency);
      return;
    }

    const snapshot = useLogStore.getState().entries;

    await runOptimisticMutation({
      apply: () => removeEntriesForPair(fromCurrency, toCurrency),
      rollback: () => replaceEntries(snapshot),
      request: () => deleteLogEntriesForPair(fromCurrency, toCurrency),
    });
  };

  const clearAllLogs = async () => {
    if (!session) {
      clearLog();
      toast.success("Your conversion log has been cleared.");
      return;
    }

    const snapshot = useLogStore.getState().entries;

    await runOptimisticMutation({
      apply: () => {
        clearLog();
        toast.success("Your conversion log has been cleared.");
      },
      rollback: () => {
        replaceEntries(snapshot);
        toast.error("Couldn't clear your log — try again.");
      },
      request: () => deleteAllLogEntries(),
    });
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
