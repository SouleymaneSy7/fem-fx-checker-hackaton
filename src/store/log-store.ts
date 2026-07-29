import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { MAX_LOG_ENTRIES, STORAGE_KEY_CONVERSION_LOG } from "@/constants";
import type { LogEntryType, LogStoreType } from "@/types";
import { safeLocalStorage } from "@/utils/safe-storage";

export const useLogStore = create<LogStoreType>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) =>
        set((state) => {
          const newEntry: LogEntryType = {
            ...entry,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
          };
          // FIFO cap: oldest entry drops once the limit is reached
          return {
            entries: [newEntry, ...state.entries].slice(0, MAX_LOG_ENTRIES),
          };
        }),

      // Same as addEntry, but for an entry the server already assigned an
      // id/createdAt to — used once signed in, so later single-entry
      // deletes target the real server row instead of a throwaway local id.
      addLoggedEntry: (entry) =>
        set((state) => ({
          entries: [entry, ...state.entries].slice(0, MAX_LOG_ENTRIES),
        })),

      removeEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        })),

      removeEntriesForPair: (fromCurrency: string, toCurrency: string) =>
        set((state) => ({
          entries: state.entries.filter(
            (entry) =>
              !(
                entry.fromCurrency === fromCurrency &&
                entry.toCurrency === toCurrency
              ),
          ),
        })),

      clearLog: () => set({ entries: [] }),

      // Wholesale swap-in of the server's canonical list — used once on
      // sign-in by AccountSync.
      replaceEntries: (entries) => set({ entries }),
    }),
    {
      name: STORAGE_KEY_CONVERSION_LOG,
      storage: createJSONStorage(() => safeLocalStorage),
    },
  ),
);
