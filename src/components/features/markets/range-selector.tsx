"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RANGES } from "@/constants";
import type { RangeSelectorPropsType, RateRangeType } from "@/types/ui.types";

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
