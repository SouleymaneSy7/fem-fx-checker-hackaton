export type OfflineStoreType = {
  isStale: boolean;
  lastFreshAt: number | null;
  markStale: () => void;
  markFresh: () => void;
};
