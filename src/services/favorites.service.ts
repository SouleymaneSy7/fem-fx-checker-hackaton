import axios from "axios";

import type { FavoriteRowType } from "@/types/data.types";

// Same-origin calls to our own Route Handlers — no baseURL override
// needed (unlike httpClient, which targets the external Frankfurter API).
export async function fetchFavorites(): Promise<FavoriteRowType[]> {
  const { data } = await axios.get<FavoriteRowType[]>("/api/favorites");
  return data;
}

export async function createFavorite(
  fromCurrency: string,
  toCurrency: string,
): Promise<FavoriteRowType> {
  const { data } = await axios.post<FavoriteRowType>("/api/favorites", {
    fromCurrency,
    toCurrency,
  });
  return data;
}

export async function deleteFavorite(
  fromCurrency: string,
  toCurrency: string,
): Promise<void> {
  await axios.delete("/api/favorites", {
    params: { from: fromCurrency, to: toCurrency },
  });
}
