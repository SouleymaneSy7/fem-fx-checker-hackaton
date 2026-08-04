"use client";

import { motion, useReducedMotion } from "motion/react";
import * as React from "react";

import { Container, Title } from "@/components/common";
import { CurrencyPicker, TextInput } from "@/components/shared";
import { Button, ToggleGroup, ToggleGroupItem } from "@/components/ui";
import {
  CONVERTER_SECTIONS,
  DEFAULT_FROM_CURRENCY,
  DEFAULT_TO_CURRENCY,
  SPRING_PANEL,
} from "@/constants";
import { useCurrencies } from "@/hooks";
import { getCurrencyFlagCode } from "@/services";
import { usePreferencesStore } from "@/store";
import type { ConverterSectionValueType, CurrencyOptionType } from "@/types";

const DEFAULT_TAB_INDICATOR_LAYOUT_ID = "settings-default-tab-indicator";

const ConverterBehaviorPanel = () => {
  const { currencies, isLoading } = useCurrencies();
  const shouldReduceMotion = useReducedMotion();

  const defaultFromCurrency = usePreferencesStore(
    (state) => state.defaultFromCurrency,
  );
  const defaultToCurrency = usePreferencesStore(
    (state) => state.defaultToCurrency,
  );
  const defaultAmount = usePreferencesStore((state) => state.defaultAmount);
  const defaultTab = usePreferencesStore((state) => state.defaultTab);
  const setDefaultFromCurrency = usePreferencesStore(
    (state) => state.setDefaultFromCurrency,
  );
  const setDefaultToCurrency = usePreferencesStore(
    (state) => state.setDefaultToCurrency,
  );
  const setDefaultAmount = usePreferencesStore(
    (state) => state.setDefaultAmount,
  );
  const setDefaultTab = usePreferencesStore((state) => state.setDefaultTab);

  const [amountInput, setAmountInput] = React.useState(
    defaultAmount !== null ? String(defaultAmount) : "",
  );

  const currencyOptions = React.useMemo<CurrencyOptionType[]>(
    () =>
      currencies?.map((currency) => ({
        code: currency.iso_code,
        name: currency.name,
        flag: getCurrencyFlagCode(currency.iso_code) ?? "",
      })) ?? [],
    [currencies],
  );

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    if (!/^\d*[.,]?\d*$/.test(raw)) return;

    setAmountInput(raw);

    if (raw === "") {
      setDefaultAmount(null);
      return;
    }

    const parsed = Number.parseFloat(raw.replace(",", "."));
    if (!Number.isNaN(parsed) && parsed > 0) {
      setDefaultAmount(parsed);
    }
  };

  const handleReset = () => {
    setDefaultFromCurrency(null);
    setDefaultToCurrency(null);
    setDefaultAmount(null);
    setDefaultTab(null);
    setAmountInput("");
  };

  const effectiveTab: ConverterSectionValueType = defaultTab ?? "history";

  return (
    <Container className="space-y-step-200 rounded-xl border border-neutral-600 bg-card p-step-200 md:space-y-step-250 md:p-step-250">
      <div className="flex flex-wrap items-baseline justify-between gap-step-100">
        <Title level="h3" className="preset-3-med text-foreground uppercase">
          Converter defaults
        </Title>

        <Button
          type="button"
          variant="ghost"
          className="preset-6"
          onClick={handleReset}
        >
          Reset to defaults
        </Button>
      </div>

      <p className="preset-5 text-neutral-200">
        Applied the next time you open FX Checker — a shared link's own
        currencies and amount always take priority over these.
      </p>

      <div className="grid grid-cols-1 gap-step-200 sm:grid-cols-2">
        <div className="flex flex-col gap-step-100">
          <span className="preset-4 text-foreground">
            Default send currency
          </span>
          <CurrencyPicker
            label="Default send currency"
            isLoading={isLoading}
            value={defaultFromCurrency ?? DEFAULT_FROM_CURRENCY}
            onValueChange={setDefaultFromCurrency}
            currencies={currencyOptions}
          />
        </div>

        <div className="flex flex-col gap-step-100">
          <span className="preset-4 text-foreground">
            Default receive currency
          </span>
          <CurrencyPicker
            label="Default receive currency"
            isLoading={isLoading}
            value={defaultToCurrency ?? DEFAULT_TO_CURRENCY}
            onValueChange={setDefaultToCurrency}
            currencies={currencyOptions}
          />
        </div>
      </div>

      <div className="max-w-50">
        <TextInput
          label="Default amount"
          inputMode="decimal"
          value={amountInput}
          onChange={handleAmountChange}
        />
      </div>

      <div className="flex flex-col gap-step-100">
        <span className="preset-4 text-foreground">Default tab on load</span>

        <ToggleGroup
          type="single"
          value={effectiveTab}
          onValueChange={(next) => {
            if (next) setDefaultTab(next as ConverterSectionValueType);
          }}
          aria-label="Default tab"
          className="flex-wrap bg-neutral-600"
        >
          {CONVERTER_SECTIONS.map((section) => (
            <ToggleGroupItem key={section.value} value={section.value}>
              {effectiveTab === section.value && (
                <motion.span
                  aria-hidden="true"
                  layout
                  layoutId={DEFAULT_TAB_INDICATOR_LAYOUT_ID}
                  className="absolute inset-0 rounded-md bg-neutral-500"
                  style={{ originY: "0px" }}
                  transition={
                    shouldReduceMotion ? { duration: 0 } : SPRING_PANEL
                  }
                />
              )}
              <span className="relative z-10">{section.label}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </Container>
  );
};

export default ConverterBehaviorPanel;
