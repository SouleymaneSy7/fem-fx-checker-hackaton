export type FavoritePairType = {
  id: string;
  fromCurrency: string;
  toCurrency: string;
};

export type FavoritesStoreType = {
  favorites: FavoritePairType[];
  pinPair: (fromCurrency: string, toCurrency: string) => void;
  unpinPair: (id: string) => void;
  isPinned: (fromCurrency: string, toCurrency: string) => boolean;
  replaceFavorites: (favorites: FavoritePairType[]) => void;
};

export type FavoriteWithRateType = FavoritePairType & {
  rate: number | undefined;
  changePercent: number | undefined;
  isFavoriteSyncing: boolean;
};
