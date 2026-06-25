/**
 * Placeholder shape for one ticker entry.
 * TODO: align with the real rate type once the services layer is wired in
 * (see src/services) — for now this only describes what the UI needs.
 */

export type TickerPairType = {
  id: string;
  base: string;
  quote: string;
  rate: number;
  changePercent: number;
};
