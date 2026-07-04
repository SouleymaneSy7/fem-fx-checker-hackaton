import { z } from "zod";

import type { FetchRatesParamsType } from "@/types/api.types";
import { httpClient } from "./http-client";
import { type RateType, rateSchema } from "./rate.service";

export const ratesSchema = z.array(rateSchema);

// One endpoint behind the latest rate, a specific historical date, and a
// time series — Frankfurter v2 differentiates by query params, not by path.
export async function fetchRates(
  params: FetchRatesParamsType = {},
): Promise<RateType[]> {
  const { data } = await httpClient.get("/rates", {
    params: {
      base: params.base,
      quotes: params.quotes?.join(","),
      date: params.date,
      from: params.from,
      to: params.to,
      providers: params.providers?.join(","),
      group: params.group,
    },
  });

  return ratesSchema.parse(data);
}

export function fetchLatestRates(
  base: string,
  quotes?: string[],
): Promise<RateType[]> {
  return fetchRates({ base, quotes });
}

export function fetchRateHistory(
  base: string,
  quotes: string[],
  from: string,
  to: string,
): Promise<RateType[]> {
  return fetchRates({ base, quotes, from, to });
}
