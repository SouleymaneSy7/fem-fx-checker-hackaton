"use client";

import * as React from "react";

import Container from "@/components/common/container";
import Title from "@/components/common/title";
import { ArrowLeftRightIcon } from "@/components/icons";
import SpinnerEllipsis from "@/components/loaders/spinner-ellipsis";
import CurrencyPicker from "@/components/shared/currency-picker";
import NumericInput from "@/components/shared/numeric-input";
import { Button } from "@/components/ui/button";
import { SHORTCUT_EVENTS } from "@/constants";
import { useConverter } from "@/hooks/use-converter";
import { useCurrencies } from "@/hooks/use-currencies";
import { getCurrencyFlagCode } from "@/services/currency-flags.service";
import type { CurrencyOptionType } from "@/types/ui.types";
import { formatAmount } from "@/utils/format-amount";

const ConverterTop = () => {
  const {
    amount,
    fromCurrency,
    toCurrency,
    convertedAmount,
    isLoading,
    error,
    setAmount,
    setFromCurrency,
    setToCurrency,
    swapCurrencies,
  } = useConverter();

  const { currencies } = useCurrencies();

  // Local string buffer so the input can hold intermediate states (an empty
  // field, a trailing decimal separator) that a raw number can't represent.
  const [amountInput, setAmountInput] = React.useState(String(amount));

  const currencyOptions = React.useMemo<CurrencyOptionType[]>(
    () =>
      currencies?.map((currency) => ({
        code: currency.iso_code,
        name: currency.name,
        flag: getCurrencyFlagCode(currency.iso_code) ?? "",
      })) ?? [],
    [currencies],
  );

  // Each picker excludes the currency currently selected on the other
  // side — a currency can't be both the send and the receive currency.
  const sendCurrencyOptions = React.useMemo(
    () => currencyOptions.filter((option) => option.code !== toCurrency),
    [currencyOptions, toCurrency],
  );

  const receiveCurrencyOptions = React.useMemo(
    () => currencyOptions.filter((option) => option.code !== fromCurrency),
    [currencyOptions, fromCurrency],
  );

  React.useEffect(() => {
    window.addEventListener(SHORTCUT_EVENTS.swapCurrencies, swapCurrencies);

    return () =>
      window.removeEventListener(
        SHORTCUT_EVENTS.swapCurrencies,
        swapCurrencies,
      );
  }, [swapCurrencies]);

  React.useEffect(() => {
    setAmountInput(String(amount));
  }, [amount]);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    if (!/^\d*[.,]?\d*$/.test(raw)) return;

    setAmountInput(raw);

    const parsed = Number.parseFloat(raw.replace(",", "."));
    setAmount(Number.isNaN(parsed) ? 0 : parsed);
  };

  return (
    <Container className="w-full bg-card rounded-t-20 p-step-200 flex flex-col items-center justify-center gap-step-200 md:p-step-250 md:flex-row md:gap-step-300">
      <div className="w-full bg-neutral-600 border border-neutral-500 flex flex-col gap-step-200 p-step-200 rounded-16 md:p-step-250 md:gap-step-250">
        <Title level="h3" className="preset-4 uppercase text-neutral-100">
          Send
        </Title>

        <div className="flex items-center justify-between gap-step-100">
          <NumericInput
            value={amountInput}
            onChange={handleAmountChange}
            aria-label="Amount to send"
          />

          <CurrencyPicker
            label="Send Currency"
            isLoading={isLoading}
            value={fromCurrency}
            onValueChange={setFromCurrency}
            currencies={sendCurrencyOptions}
            focusShortcutTarget="send"
          />
        </div>
      </div>

      <Button
        type="button"
        size={"icon-lg"}
        variant={"secondary"}
        onClick={swapCurrencies}
        aria-label="Swap send and receive currencies"
        aria-keyshortcuts="Control+S Meta+S"
      >
        <ArrowLeftRightIcon />
      </Button>

      <div className="w-full bg-neutral-600 border border-neutral-500 flex flex-col gap-step-200 p-step-200 rounded-16 md:p-step-250 md:gap-step-250">
        <Title level="h3" className="preset-4 uppercase text-neutral-100">
          Receive
        </Title>

        <div className="flex items-center justify-between gap-step-100">
          {error ? (
            <p className="preset-1 uppercase text-destructive/80">———</p>
          ) : convertedAmount !== null ? (
            <p className="preset-1 uppercase text-primary" aria-live="polite">
              {formatAmount(convertedAmount)}
            </p>
          ) : isLoading ? (
            <SpinnerEllipsis />
          ) : (
            <p className="preset-1 uppercase text-destructive/80">———</p>
          )}

          <CurrencyPicker
            label="Receive Currency"
            isLoading={isLoading}
            value={toCurrency}
            onValueChange={setToCurrency}
            currencies={receiveCurrencyOptions}
          />
        </div>
      </div>
    </Container>
  );
};

export default ConverterTop;
