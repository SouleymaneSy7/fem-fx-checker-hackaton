import type { RateType } from "@/types/api.types";
import { rateSchema } from "@/validators";
import { httpClient } from "./http-client";

// Shortcut for a single currency pair — e.g. the converter, which only ever
// needs one rate at a time.
export async function fetchRate(
  base: string,
  quote: string,
  date?: string,
): Promise<RateType> {
  const { data } = await httpClient.get(`/rate/${base}/${quote}`, {
    params: date ? { date } : undefined,
  });

  return rateSchema.parse(data);
}
