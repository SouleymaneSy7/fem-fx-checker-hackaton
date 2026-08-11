"use client";

import { motion } from "motion/react";
import * as React from "react";
import { Container, Title } from "@/components/common";
import { MultiCurrencyPicker } from "@/components/shared";
import { Button, ToggleGroup, ToggleGroupItem } from "@/components/ui";
import {
  DEFAULT_CHART_CURRENCIES,
  DEFAULT_COMPARE_CURRENCIES,
  MAX_CHART_CURRENCIES,
  SPRING_PANEL,
  TICKER_QUOTE_CURRENCIES,
} from "@/constants";
import {
  useCompareChartCurrencies,
  useCompareCurrencies,
  useCurrencies,
  useReducedMotion,
  useSettingsSync,
} from "@/hooks";
import { getCurrencyFlagCode } from "@/services";
import { usePreferencesStore } from "@/store";
import type { CurrencyOptionType, DecimalPrecisionType } from "@/types";

const PRECISION_OPTIONS: DecimalPrecisionType[] = [2, 4, 6];
const DEFAULT_PRECISION_LAYOUT_ID = "settings-display-data-interval-indicator";

const DisplayDataPanel = () => {
  const { currencies } = useCurrencies();
  const shouldReduceMotion = useReducedMotion();
  const { syncSetting } = useSettingsSync();

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
  const effectiveTickerCurrencies =
    tickerQuoteCurrencies ?? TICKER_QUOTE_CURRENCIES;

  const handlePrecisionChange = (next: string) => {
    if (!next) return;
    const precision = Number(next) as DecimalPrecisionType;
    setDecimalPrecision(precision);
    syncSetting({ decimalPrecision: precision });
  };

  const handleResetTickerCurrencies = () => {
    setTickerQuoteCurrencies(null);
    syncSetting({ tickerQuoteCurrencies: null });
  };

  const handleTickerCurrenciesChange = (next: string[]) => {
    setTickerQuoteCurrencies(next);
    syncSetting({ tickerQuoteCurrencies: next });
  };

  const handleResetCompareCurrencies = () => {
    setCompareCurrencies(DEFAULT_COMPARE_CURRENCIES);
    syncSetting({ compareCurrencies: DEFAULT_COMPARE_CURRENCIES });
  };

  const handleCompareCurrenciesChange = (next: string[]) => {
    setCompareCurrencies(next);
    syncSetting({ compareCurrencies: next });
  };

  const handleResetChartCurrencies = () => {
    setChartCurrencies(DEFAULT_CHART_CURRENCIES);
    syncSetting({ compareChartCurrencies: DEFAULT_CHART_CURRENCIES });
  };

  const handleChartCurrenciesChange = (next: string[]) => {
    setChartCurrencies(next);
    syncSetting({ compareChartCurrencies: next });
  };

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
          onValueChange={handlePrecisionChange}
          aria-label="Decimal precision"
          className="w-fit bg-neutral-600"
        >
          {PRECISION_OPTIONS.map((precision) => (
            <ToggleGroupItem key={precision} value={String(precision)}>
              {String(effectivePrecision) === String(precision) && (
                <motion.span
                  aria-hidden="true"
                  layout
                  layoutId={DEFAULT_PRECISION_LAYOUT_ID}
                  className="absolute inset-0 rounded-md bg-neutral-500"
                  style={{ originY: "0px" }}
                  transition={
                    shouldReduceMotion ? { duration: 0 } : SPRING_PANEL
                  }
                />
              )}
              <span className="relative z-10">{precision} digits</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="flex flex-col gap-step-100">
        <div className="flex flex-wrap items-baseline justify-between gap-step-100">
          <span className="preset-4 text-foreground">Live markets ticker</span>

          {tickerQuoteCurrencies !== null && (
            <Button
              type="button"
              variant="ghost"
              className="preset-6"
              onClick={handleResetTickerCurrencies}
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
          onChange={handleTickerCurrenciesChange}
          currencies={currencyOptions}
          label="Add a currency to the ticker"
        />
      </div>

      <div className="flex flex-col gap-step-100">
        <div className="flex flex-wrap items-baseline justify-between gap-step-100">
          <span className="preset-4 text-foreground">
            Compare table currencies
          </span>

          <Button
            type="button"
            variant="ghost"
            className="preset-6"
            onClick={handleResetCompareCurrencies}
          >
            Reset to defaults
          </Button>
        </div>

        <p className="preset-5 text-neutral-200">
          Default set of currencies shown in the Compare tab's table view.
        </p>

        <MultiCurrencyPicker
          selected={compareCurrencies}
          onChange={handleCompareCurrenciesChange}
          currencies={currencyOptions}
          label="Add a currency to the compare table"
        />
      </div>

      <div className="flex flex-col gap-step-100">
        <div className="flex flex-wrap items-baseline justify-between gap-step-100">
          <span className="preset-4 text-foreground">
            Compare chart currencies
          </span>

          <Button
            type="button"
            variant="ghost"
            className="preset-6"
            onClick={handleResetChartCurrencies}
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
          onChange={handleChartCurrenciesChange}
          currencies={currencyOptions}
          maxSelected={MAX_CHART_CURRENCIES}
          label="Add a currency to the compare chart"
        />
      </div>
    </Container>
  );
};

export default DisplayDataPanel;
