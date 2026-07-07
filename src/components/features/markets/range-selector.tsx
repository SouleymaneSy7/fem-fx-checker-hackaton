"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { RateRangeType } from "@/types/data.types";
import type { RangeSelectorPropsType } from "@/types/ui.types";

const RANGES: { value: RateRangeType; label: string; shortcut: string }[] = [
  { value: "1d", label: "1d", shortcut: "Alt+1" },
  { value: "1w", label: "1w", shortcut: "Alt+2" },
  { value: "1m", label: "1m", shortcut: "Alt+3" },
  { value: "3m", label: "3m", shortcut: "Alt+4" },
  { value: "1y", label: "1y", shortcut: "Alt+5" },
  { value: "5y", label: "5y", shortcut: "Alt+6" },
];

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
