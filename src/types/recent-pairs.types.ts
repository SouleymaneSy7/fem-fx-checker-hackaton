export type RecentPairType = {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  lastUsedAt: number;
};

export type RecentPairsStoreType = {
  recentPairs: RecentPairType[];
  addRecentPair: (
    fromCurrency: string,
    toCurrency: string,
    lastUsedAt: number,
  ) => void;
  removeRecentPair: (id: string) => void;
  replaceRecentPairs: (recentPairs: RecentPairType[]) => void;
};

export type SelectRecentPairDetail = {
  fromCurrency: string;
  toCurrency: string;
};
