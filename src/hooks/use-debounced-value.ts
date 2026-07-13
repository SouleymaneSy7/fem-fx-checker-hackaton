"use client";

import * as React from "react";
import { DEBOUNCE_DEFAULT_MS } from "@/constants";

export function useDebouncedValue<T>(
  value: T,
  delayMs = DEBOUNCE_DEFAULT_MS,
): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timeoutId);
  }, [value, delayMs]);

  return debouncedValue;
}
