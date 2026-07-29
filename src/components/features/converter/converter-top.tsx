"use client";

import * as React from "react";

import { Container, Title } from "@/components/common";
import { ArrowLeftRightIcon } from "@/components/icons";
import SpinnerEllipsis from "@/components/loaders/spinner-ellipsis";
import { CurrencyPicker, NumericInput, TextTooltip } from "@/components/shared";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";
import { SHORTCUT_EVENTS } from "@/constants";
import { useConverter, useCurrencies, useRecentPairs } from "@/hooks";
import { getCurrencyFlagCode } from "@/services";
import type { CurrencyOptionType, SelectRecentPairDetail } from "@/types";
import { formatAmount, formatPreciseAmount } from "@/utils";

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
  const recentPairs = useRecentPairs(fromCurrency, toCurrency);

  // Local string buffer so the input can hold intermediate states (an empty
  // field, a trailing decimal separator) that a raw number can't represent.
  const [amountInput, setAmountInput] = React.useState(String(amount));

  // Drives which "view" of the amount is shown: the raw editable buffer
  // while the user is actively typing, or the comma/decimal-formatted
  // value (same formatAmount used by Receive) once the field loses focus.
  // Formatting live, keystroke by keystroke, would fight the caret.
  const [isAmountFocused, setIsAmountFocused] = React.useState(false);

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

  // Fired by CurrencyPicker when a recent-pair chip is clicked (from
  // either the Send or Receive picker) — applies both sides at once.
  React.useEffect(() => {
    const handleSelectRecentPair = (event: Event) => {
      const detail = (event as CustomEvent<SelectRecentPairDetail>).detail;
      if (!detail) return;

      setFromCurrency(detail.fromCurrency);
      setToCurrency(detail.toCurrency);
    };

    window.addEventListener(
      SHORTCUT_EVENTS.selectRecentPair,
      handleSelectRecentPair,
    );

    return () =>
      window.removeEventListener(
        SHORTCUT_EVENTS.selectRecentPair,
        handleSelectRecentPair,
      );
  }, [setFromCurrency, setToCurrency]);

  // Skipped while the field is focused: the buffer already reflects
  // whatever the user is typing, including an intentionally-emptied
  // field. Without this guard, clearing the input drives `amount` to 0
  // via handleAmountChange below, which re-fires this effect and snaps
  // the buffer back to "0" before the user gets to type a replacement.
  React.useEffect(() => {
    if (isAmountFocused) return;
    setAmountInput(String(amount));
  }, [amount, isAmountFocused]);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    if (!/^\d*[.,]?\d*$/.test(raw)) return;

    setAmountInput(raw);

    const parsed = Number.parseFloat(raw.replace(",", "."));
    setAmount(Number.isNaN(parsed) ? 0 : parsed);
  };

  const handleAmountFocus = () => {
    setIsAmountFocused(true);
  };

  const handleAmountBlur = () => {
    setIsAmountFocused(false);
  };

  // Matches Receive's formatting exactly (thousands separator, up to 2
  // decimals) once the field isn't being edited. The store still keeps
  // the full-precision amount either way — only this display rounds.
  const sendAmountValue = isAmountFocused ? amountInput : formatAmount(amount);

  return (
    <Container className="flex w-full flex-col items-center justify-center gap-step-200 rounded-t-20 bg-card p-step-200 md:flex-row md:gap-step-300 md:p-step-250">
      <div className="flex w-full flex-col gap-step-200 rounded-16 border border-neutral-500 bg-neutral-600 p-step-200 md:gap-step-250 md:p-step-250">
        <Title level="h2" className="preset-4 text-neutral-100 uppercase">
          Send
        </Title>

        <div className="flex items-center justify-between gap-step-100">
          <NumericInput
            value={sendAmountValue}
            onChange={handleAmountChange}
            onFocus={handleAmountFocus}
            onBlur={handleAmountBlur}
            aria-label="Amount to send"
          />

          <CurrencyPicker
            label="Send Currency"
            isLoading={isLoading}
            value={fromCurrency}
            onValueChange={setFromCurrency}
            currencies={sendCurrencyOptions}
            recentPairs={recentPairs}
            focusShortcutTarget="send"
          />
        </div>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size={"icon-lg"}
            variant={"secondary"}
            onClick={swapCurrencies}
            aria-label="Swap send and receive currencies"
            aria-keyshortcuts="Control+S Meta+S"
          >
            <ArrowLeftRightIcon className="rotate-90 md:rotate-0" />
          </Button>
        </TooltipTrigger>

        <TooltipContent>
          <p>Swap send and receive currencies.</p>
        </TooltipContent>
      </Tooltip>

      <div className="flex w-full flex-col gap-step-200 rounded-16 border border-neutral-500 bg-neutral-600 p-step-200 md:gap-step-250 md:p-step-250">
        <Title level="h2" className="preset-4 text-neutral-100 uppercase">
          Receive
        </Title>

        <div className="flex items-center justify-between gap-step-100">
          {error ? (
            <p className="preset-1 text-destructive/80 uppercase">———</p>
          ) : convertedAmount !== null ? (
            <TextTooltip
              className="preset-1 text-primary uppercase"
              aria-live="polite"
              content={formatPreciseAmount(convertedAmount)}
            >
              {formatAmount(convertedAmount)}
            </TextTooltip>
          ) : isLoading ? (
            <SpinnerEllipsis />
          ) : (
            <p className="preset-1 text-destructive/80 uppercase">———</p>
          )}

          <CurrencyPicker
            label="Receive Currency"
            isLoading={isLoading}
            value={toCurrency}
            onValueChange={setToCurrency}
            currencies={receiveCurrencyOptions}
            recentPairs={recentPairs}
          />
        </div>
      </div>
    </Container>
  );
};

export default ConverterTop;
