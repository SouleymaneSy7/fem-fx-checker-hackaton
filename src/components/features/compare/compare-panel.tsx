"use client";

import * as React from "react";

import Container from "@/components/common/container";
import List from "@/components/common/list";
import Title from "@/components/common/title";

import { CurrencyFlag } from "@/components/shared/currency-flag";
import FavoriteToggleIcon from "@/components/shared/favorite-toggle-icon";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { PLACEHOLDER_CURRENCIES } from "@/utils/placeholder";

export type CompareRowType = {
  code: string;
  name: string;
  flag?: React.ReactNode;
  rate: number;
};

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

const PLACEHOLDER_RATE_TO_USD: Record<string, number> = {
  USD: 1,
  EUR: 0.853,
  GBP: 0.7345,
  JPY: 157.91,
  CHF: 0.9098,
  AUD: 1.387,
  CAD: 1.3815,
};

export const getPlaceholderRate = (from: string, to: string) =>
  (PLACEHOLDER_RATE_TO_USD[to] ?? 1) / (PLACEHOLDER_RATE_TO_USD[from] ?? 1);

const formatAmount = (value: number) =>
  value.toLocaleString("en-US", { maximumFractionDigits: 2 });

const ComparePanel = () => {
  const [toggle, setToggle] = React.useState(false);
  const handleToggle = () => {
    setToggle(!toggle);
  };

  const sendCurrency = "USD";
  const sendAmount = 1000;

  const filteredCurrencies = PLACEHOLDER_CURRENCIES.filter((converter) =>
    DEFAULT_COMPARE_CODES.includes(converter.code),
  );

  const compareRows: CompareRowType[] = filteredCurrencies
    .filter((currency) => currency.code !== sendCurrency)
    .map((currency) => ({
      code: currency.code,
      name: currency.name,
      flag: currency.flag,
      rate: getPlaceholderRate(sendCurrency, currency.code),
    }));

  const hasRows = compareRows.length > 0 && sendAmount > 0;

  return (
    <Container className="bg-card border border-neutral-600 rounded-xl space-y-step-200 p-step-200 md:space-y-step-250 md:p-step-250">
      <div className="flex flex-wrap items-baseline justify-between gap-step-125">
        <div className="flex flex-wrap items-center gap-step-150">
          <Title level="h3" className="preset-4 uppercase text-neutral-200">
            Multi-currency
          </Title>

          <span className="preset-3-med uppercase text-neutral-50">
            {formatAmount(sendAmount)} from {sendCurrency}
          </span>
        </div>

        <p className="preset-5 text-neutral-100">{compareRows.length} pairs</p>
      </div>

      {hasRows ? (
        <List
          items={compareRows}
          keyExtractor={(row) => row.code}
          className="flex flex-col gap-step-150"
          renderItem={(row) => (
            <li className="flex items-center gap-step-125 rounded-10 border border-neutral-500 bg-neutral-600 px-step-150 py-step-150 md:gap-step-250 md:px-step-200">
              <CurrencyFlag currencyCode={row.code} size={24} />

              <div className="min-w-0 flex flex-col gap-step-075 flex-1">
                <p className="preset-4 uppercase text-foreground">{row.code}</p>
                <p className="truncate preset-5 text-neutral-200">{row.name}</p>
              </div>

              <div className="text-right flex flex-col gap-step-075">
                <p className="preset-3 uppercase text-foreground">
                  {formatAmount(sendAmount * row.rate)}
                </p>

                <p className="truncate preset-6 uppercase text-neutral-200">
                  @ {row.rate.toFixed(4)}
                </p>
              </div>

              <FavoriteToggleIcon
                isFavorite={toggle}
                onToggle={handleToggle}
                label="Favorite Button With Icon"
              />
            </li>
          )}
        />
      ) : (
        <Empty>
          <EmptyTitle>No comparison available</EmptyTitle>
          <EmptyDescription>
            Enter an amount in SEND above to see what your money is worth in
            other currencies.
          </EmptyDescription>
        </Empty>
      )}
    </Container>
  );
};

export default ComparePanel;
