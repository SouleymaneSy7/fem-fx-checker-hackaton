import { usePreferencesStore } from "@/store";

// Shared amount formatter — used anywhere a converted amount, a send
// amount, or a receive amount is displayed (Converter, Compare, Log).
// Reads decimalPrecision imperatively via getState() rather than as a
// reactive hook — this is a plain function called from ~15 files, not a
// component, so subscribing everywhere would mean touching all of them.
// Trade-off: a precision change in Settings applies the next time each
// consumer re-renders/remounts, not instantly if both are open in the
// same tab at once.
export const formatAmount = (value: number) => {
  const precision = usePreferencesStore.getState().decimalPrecision ?? 2;

  return value.toLocaleString("en-US", { maximumFractionDigits: precision });
};

// More decimal places than `formatAmount` — used in tooltips, where the
// underlying rate often carries more precision than the casual display
// rounds off. Deliberately NOT tied to the decimalPrecision preference:
// its whole purpose is showing more digits than whatever the casual
// setting currently is.
export const formatPreciseAmount = (value: number) =>
  value.toLocaleString("en-US", { maximumFractionDigits: 6 });
