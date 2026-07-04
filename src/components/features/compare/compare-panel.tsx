import * as React from "react";

import Container from "@/components/common/container";
import List from "@/components/common/list";
import Title from "@/components/common/title";

import { CurrencyFlag } from "@/components/shared/currency-flag";
import FavoriteToggleIcon from "@/components/shared/favorite-toggle-icon";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { useCompare } from "@/hooks/use-compare";
import { useCurrencies } from "@/hooks/use-currencies";
import { formatAmount } from "@/utils/format-amount";

const DEFAULT_COMPARE_CODES = [
  "GBP",
  "JPY",
  "CHF",
  "CAD",
  "AUD",
  "INR",
  "CNY",
  "BDT",
];

const ComparePanel = () => {
  const { amount, baseCurrency, rows, toggleFavorite } = useCompare(
    DEFAULT_COMPARE_CODES,
  );
  const { currencies } = useCurrencies();

  const namesByCode = React.useMemo(() => {
    const map = new Map<string, string>();

    for (const currency of currencies ?? []) {
      map.set(currency.iso_code, currency.name);
    }
    return map;
  }, [currencies]);

  const hasRows = rows.length > 0 && amount > 0;
  return (
    <React.Fragment>
      {hasRows ? (
        <Container className="bg-card border border-neutral-600 rounded-xl space-y-step-200 p-step-200 md:space-y-step-250 md:p-step-250">
          <div className="flex flex-wrap items-baseline justify-between gap-step-125">
            <div className="flex flex-wrap items-center gap-step-150">
              <Title level="h3" className="preset-4 uppercase text-neutral-200">
                Multi-currency
              </Title>

              <span className="preset-3-med uppercase text-neutral-50">
                {formatAmount(amount)} from {baseCurrency}
              </span>
            </div>

            <p className="preset-5 text-neutral-100">{rows.length} pairs</p>
          </div>

          <List
            items={rows}
            keyExtractor={(row) => row.currency}
            className="flex flex-col gap-step-150"
            renderItem={(row) => (
              <li className="flex items-center gap-step-125 rounded-10 border border-neutral-500 bg-neutral-600 px-step-150 py-step-150 md:gap-step-250 md:px-step-200">
                <CurrencyFlag currencyCode={row.currency} size={24} />

                <div className="min-w-0 flex flex-col gap-step-075 flex-1">
                  <p className="preset-4 uppercase text-foreground">
                    {row.currency}
                  </p>
                  <p className="truncate preset-5 text-neutral-200">
                    {namesByCode.get(row.currency) ?? row.currency}
                  </p>
                </div>

                <div className="text-right flex flex-col gap-step-075">
                  <p className="preset-3 uppercase text-foreground">
                    {row.convertedAmount !== undefined
                      ? formatAmount(row.convertedAmount)
                      : "—"}
                  </p>

                  <p className="truncate preset-6 uppercase text-neutral-200">
                    {row.rate !== undefined ? `@ ${row.rate.toFixed(4)}` : ""}
                  </p>
                </div>

                <FavoriteToggleIcon
                  isFavorite={row.isPinned}
                  onToggle={() => toggleFavorite(row.currency)}
                  label={
                    row.isPinned
                      ? `Unpin: ${baseCurrency} to ${row.currency}`
                      : `Pin: ${baseCurrency} to ${row.currency}`
                  }
                />
              </li>
            )}
          />
        </Container>
      ) : (
        <Empty>
          <EmptyTitle>No comparison available</EmptyTitle>

          <EmptyDescription>
            Enter an amount in SEND above to see what your money is worth in
            other currencies.
          </EmptyDescription>
        </Empty>
      )}
    </React.Fragment>
  );
};

export default ComparePanel;
