"use client";

import { motion } from "motion/react";
import * as React from "react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui";
import { RANGES, SPRING_PANEL } from "@/constants";
import { useReducedMotion } from "@/hooks";
import type { RangeSelectorPropsType, RateRangeType } from "@/types";

const RangeSelector = ({ value, onValueChange }: RangeSelectorPropsType) => {
  const shouldReduceMotion = useReducedMotion();
  const indicatorLayoutId = React.useId();

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
          {value === range.value && (
            <motion.span
              aria-hidden="true"
              layout
              layoutId={indicatorLayoutId}
              className="absolute inset-0 rounded-md bg-neutral-500"
              style={{ originY: "0px" }}
              transition={shouldReduceMotion ? { duration: 0 } : SPRING_PANEL}
            />
          )}
          <span className="relative z-10">{range.label}</span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

export default RangeSelector;
