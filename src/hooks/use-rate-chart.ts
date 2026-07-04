import * as React from "react";

import { useRateHistory } from "@/hooks/use-rate-history";
import type { RatePointType, RateRangeType } from "@/types/data.types";

export function useRateChart(
  base: string,
  quote: string,
  initialRange: RateRangeType = "1m",
) {
  const [range, setRange] = React.useState<RateRangeType>(initialRange);

  const { rates, isLoading, error } = useRateHistory(base, [quote], range);

  const points = React.useMemo<RatePointType[]>(() => {
    if (!rates) return [];

    return rates
      .map((row) => ({ date: row.date, rate: row.rate }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [rates]);

  return { range, setRange, points, isLoading, error };
}
