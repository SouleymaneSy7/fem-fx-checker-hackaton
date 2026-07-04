// Shared amount formatter — used anywhere a converted amount, a send
// amount, or a receive amount is displayed (Converter, Compare, Log).

export const formatAmount = (value: number) =>
  value.toLocaleString("en-US", { maximumFractionDigits: 2 });
