import { create } from "zustand";

import type { OfflineStoreType } from "@/types";

// Deliberately NOT persisted — this reflects live network reachability
// for the current session only. A hard reload should start clean and
// let the next request re-establish whether the API is actually
// reachable, rather than carrying yesterday's "stale" flag into a
// perfectly working new session.
export const useOfflineStore = create<OfflineStoreType>((set) => ({
  isStale: false,
  lastFreshAt: null,

  markStale: () => set({ isStale: true }),
  markFresh: () => set({ isStale: false, lastFreshAt: Date.now() }),
}));
