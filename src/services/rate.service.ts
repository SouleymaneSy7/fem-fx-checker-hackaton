import { z } from "zod";

import { httpClient } from "./http-client";

export const rateSchema = z.object({
  date: z.string(),
  base: z.string(),
  quote: z.string(),
  rate: z.number(),
});

export type RateType = z.infer<typeof rateSchema>;

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
