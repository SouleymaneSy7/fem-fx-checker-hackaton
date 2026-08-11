"use client";

import { useReducedMotion as useSystemReducedMotion } from "motion/react";
import { usePreferencesStore } from "@/store";

/**
 * Drop-in replacement for motion/react's own `useReducedMotion` — every
 * existing call site keeps working unchanged (`shouldReduceMotion ? ... :
 * ...`), just imported from "@/hooks" instead of "motion/react".
 *
 * Layers the explicit Settings > Interface override on top of the
 * OS-level prefers-reduced-motion media query: `true`/`false` always
 * wins over the system setting, `null` (never touched) defers to it,
 * matching the same null-means-app-default contract as every other
 * PreferencesStoreType field.
 */
export function useReducedMotion(): boolean | null {
  const override = usePreferencesStore((state) => state.reducedMotion);
  const systemPreference = useSystemReducedMotion();

  return override !== null ? override : systemPreference;
}
