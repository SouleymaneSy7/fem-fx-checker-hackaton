export type TickerEntryType = {
  currency: string;
  rate: number;
  change: { absolute: number; percentage: number } | null;
};
