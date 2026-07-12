// Shared amount formatter — used anywhere a converted amount, a send
// amount, or a receive amount is displayed (Converter, Compare, Log).

export const formatAmount = (value: number) =>
  value.toLocaleString("en-US", { maximumFractionDigits: 2 });

// More decimal places than `formatAmount` — used in tooltips, where the
// underlying rate often carries more precision than the 2-decimal
// display rounds off.
export const formatPreciseAmount = (value: number) =>
  value.toLocaleString("en-US", { maximumFractionDigits: 6 });
