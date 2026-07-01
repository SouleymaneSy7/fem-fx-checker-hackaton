"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type RateRangeType = "1d" | "1w" | "1m" | "3m" | "1y" | "5y";

const RANGES: { value: RateRangeType; label: string }[] = [
  { value: "1d", label: "1d" },
  { value: "1w", label: "1w" },
  { value: "1m", label: "1m" },
  { value: "3m", label: "3m" },
  { value: "1y", label: "1y" },
  { value: "5y", label: "5y" },
];

type RangeSelectorPropsType = {
  value: RateRangeType;
  onValueChange: (range: RateRangeType) => void;
};

const RangeSelector = ({ value, onValueChange }: RangeSelectorPropsType) => {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(next) => {
        if (next) onValueChange(next as RateRangeType);
      }}
      aria-label="Rate history range"
      className="w-fit max-w-72"
    >
      {RANGES.map((range) => (
        <ToggleGroupItem
          key={range.value}
          value={range.value}
          aria-label={`${range.label} range`}
        >
          {range.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

export default RangeSelector;
