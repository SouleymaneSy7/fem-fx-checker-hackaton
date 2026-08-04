"use client";

import * as React from "react";

import { Container, Title } from "@/components/common";
import { MultiCurrencyPicker } from "@/components/shared";
import { Button, ToggleGroup, ToggleGroupItem } from "@/components/ui";
import {
  DEFAULT_CHART_CURRENCIES,
  DEFAULT_COMPARE_CURRENCIES,
  MAX_CHART_CURRENCIES,
  TICKER_QUOTE_CURRENCIES,
} from "@/constants";
import {
  useCompareChartCurrencies,
  useCompareCurrencies,
  useCurrencies,
} from "@/hooks";
import { getCurrencyFlagCode } from "@/services";
import { usePreferencesStore } from "@/store";
import type { CurrencyOptionType, DecimalPrecisionType } from "@/types";

const PRECISION_OPTIONS: DecimalPrecisionType[] = [2, 4, 6];

const DisplayDataPanel = () => {
  const { currencies } = useCurrencies();

  const decimalPrecision = usePreferencesStore(
    (state) => state.decimalPrecision,
  );
  const setDecimalPrecision = usePreferencesStore(
    (state) => state.setDecimalPrecision,
  );
  const tickerQuoteCurrencies = usePreferencesStore(
    (state) => state.tickerQuoteCurrencies,
  );
  const setTickerQuoteCurrencies = usePreferencesStore(
    (state) => state.setTickerQuoteCurrencies,
  );

  const { currencies: compareCurrencies, setCurrencies: setCompareCurrencies } =
    useCompareCurrencies();
  const { currencies: chartCurrencies, setCurrencies: setChartCurrencies } =
    useCompareChartCurrencies();

  const currencyOptions = React.useMemo<CurrencyOptionType[]>(
    () =>
      currencies?.map((currency) => ({
        code: currency.iso_code,
        name: currency.name,
        flag: getCurrencyFlagCode(currency.iso_code) ?? "",
      })) ?? [],
    [currencies],
  );

  const effectivePrecision = decimalPrecision ?? 2;
  // Shows what's ACTUALLY in effect right now, not the raw null — the
  // real ticker (header.tsx) falls back to TICKER_QUOTE_CURRENCIES the
  // same way, so this stays in sync with what the person would see there.
  const effectiveTickerCurrencies =
    tickerQuoteCurrencies ?? TICKER_QUOTE_CURRENCIES;

  return (
    <Container className="space-y-step-250 rounded-xl border border-neutral-600 bg-card p-step-200 md:p-step-250">
      <Title level="h3" className="preset-3-med text-foreground uppercase">
        Display & data
      </Title>

      <div className="flex flex-col gap-step-100">
        <span className="preset-4 text-foreground">Decimal precision</span>

        <ToggleGroup
          type="single"
          value={String(effectivePrecision)}
          onValueChange={(next) => {
            if (next) {
              setDecimalPrecision(Number(next) as DecimalPrecisionType);
            }
          }}
          aria-label="Decimal precision"
          className="w-fit bg-neutral-600"
        >
          {PRECISION_OPTIONS.map((precision) => (
            <ToggleGroupItem key={precision} value={String(precision)}>
              {precision} digits
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="flex flex-col gap-step-100">
        <div className="flex items-baseline justify-between gap-step-100">
          <span className="preset-4 text-foreground">Live markets ticker</span>

          {tickerQuoteCurrencies !== null && (
            <Button
              type="button"
              variant="ghost"
              className="preset-6"
              onClick={() => setTickerQuoteCurrencies(null)}
            >
              Reset to defaults
            </Button>
          )}
        </div>

        <p className="preset-5 text-neutral-200">
          Currencies shown scrolling in the header, quoted against EUR.
        </p>

        <MultiCurrencyPicker
          selected={effectiveTickerCurrencies}
          onChange={setTickerQuoteCurrencies}
          currencies={currencyOptions}
          label="Add a currency to the ticker"
        />
      </div>

      <div className="flex flex-col gap-step-100">
        <div className="flex items-baseline justify-between gap-step-100">
          <span className="preset-4 text-foreground">
            Compare table currencies
          </span>

          <Button
            type="button"
            variant="ghost"
            className="preset-6"
            onClick={() => setCompareCurrencies(DEFAULT_COMPARE_CURRENCIES)}
          >
            Reset to defaults
          </Button>
        </div>

        <p className="preset-5 text-neutral-200">
          Default set of currencies shown in the Compare tab's table view.
        </p>

        <MultiCurrencyPicker
          selected={compareCurrencies}
          onChange={setCompareCurrencies}
          currencies={currencyOptions}
          label="Add a currency to the compare table"
        />
      </div>

      <div className="flex flex-col gap-step-100">
        <div className="flex items-baseline justify-between gap-step-100">
          <span className="preset-4 text-foreground">
            Compare chart currencies
          </span>

          <Button
            type="button"
            variant="ghost"
            className="preset-6"
            onClick={() => setChartCurrencies(DEFAULT_CHART_CURRENCIES)}
          >
            Reset to defaults
          </Button>
        </div>

        <p className="preset-5 text-neutral-200">
          Default set of currencies shown in the Compare tab's chart view (up to{" "}
          {MAX_CHART_CURRENCIES}).
        </p>

        <MultiCurrencyPicker
          selected={chartCurrencies}
          onChange={setChartCurrencies}
          currencies={currencyOptions}
          maxSelected={MAX_CHART_CURRENCIES}
          label="Add a currency to the compare chart"
        />
      </div>
    </Container>
  );
};

export default DisplayDataPanel;
