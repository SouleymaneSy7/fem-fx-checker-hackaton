import axios from "axios";

import { ENDPOINT_RECENT_PAIRS } from "@/constants";
import type { RecentPairRowType, RecentPairType } from "@/types";

// Composite `${from}-${to}` id, not the server-assigned uuid — keeps ids
// consistent with locally-added pairs (see recent-pairs-store.ts), so the
// store's de-dup/replace logic never has to reconcile two different id
// shapes for the same logical pair.
function toRecentPairType(row: RecentPairRowType): RecentPairType {
  return {
    id: `${row.fromCurrency}-${row.toCurrency}`,
    fromCurrency: row.fromCurrency,
    toCurrency: row.toCurrency,
    lastUsedAt: new Date(row.lastUsedAt).getTime(),
  };
}

export async function fetchRecentPairs(): Promise<RecentPairType[]> {
  const { data } = await axios.get<RecentPairRowType[]>(ENDPOINT_RECENT_PAIRS);
  return data.map(toRecentPairType);
}

export async function createRecentPair(
  fromCurrency: string,
  toCurrency: string,
  lastUsedAt: number,
): Promise<RecentPairType> {
  const { data } = await axios.post<RecentPairRowType>(ENDPOINT_RECENT_PAIRS, {
    fromCurrency,
    toCurrency,
    lastUsedAt,
  });
  return toRecentPairType(data);
}

export async function deleteRecentPair(
  fromCurrency: string,
  toCurrency: string,
): Promise<void> {
  await axios.delete(ENDPOINT_RECENT_PAIRS, {
    params: { from: fromCurrency, to: toCurrency },
  });
}
