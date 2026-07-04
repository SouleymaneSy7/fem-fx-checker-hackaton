import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { LogEntryType, LogStoreType } from "@/types/data.types";
import { safeLocalStorage } from "@/utils/safe-storage";

const MAX_LOG_ENTRIES = 100;

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
    }),
    {
      name: "fx-conversion-log",
      storage: createJSONStorage(() => safeLocalStorage),
    },
  ),
);
