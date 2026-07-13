import axios from "axios";

import { ENDPOINT_FAVORITES } from "@/constants";
import type { FavoriteRowType } from "@/types/data.types";

// Same-origin calls to our own Route Handlers — no baseURL override
// needed (unlike httpClient, which targets the external Frankfurter API).
export async function fetchFavorites(): Promise<FavoriteRowType[]> {
  const { data } = await axios.get<FavoriteRowType[]>(ENDPOINT_FAVORITES);
  return data;
}

export async function createFavorite(
  fromCurrency: string,
  toCurrency: string,
): Promise<FavoriteRowType> {
  const { data } = await axios.post<FavoriteRowType>(ENDPOINT_FAVORITES, {
    fromCurrency,
    toCurrency,
  });
  return data;
}

export async function deleteFavorite(
  fromCurrency: string,
  toCurrency: string,
): Promise<void> {
  await axios.delete(ENDPOINT_FAVORITES, {
    params: { from: fromCurrency, to: toCurrency },
  });
}
