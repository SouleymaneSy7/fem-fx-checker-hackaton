"use client";

import * as React from "react";
import { toast } from "sonner";

import { Container } from "@/components/common";
import {
  AlertToggle,
  FavoriteToggle,
  LogButton,
  ShareButton,
} from "@/components/shared";
import {
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";
import { SHORTCUT_EVENTS } from "@/constants";
import { useConverter } from "@/hooks";
import { formatAmount, formatPreciseAmount } from "@/utils";

const ConverterBottom = () => {
  const {
    amount,
    fromCurrency,
    toCurrency,
    rate,
    isLoading,
    error,
    isPinned,
    isFavoriteSyncing,
    toggleFavorite,
    isLogged,
    isLogSyncing,
    toggleLog,
  } = useConverter();

  // Ternary instead of `rate !== undefined && formatAmount(rate)`: the
  // old pattern would have printed the literal string "false" into the
  // UI if this were ever read while `rate` was undefined. It never was
  // in practice (only rendered in the branch below that already checks
  // `rate !== undefined`), but the ternary makes that safe by
  // construction instead of by coincidence.
  const rateDisplay =
    rate !== undefined
      ? `1 ${fromCurrency} = ${formatAmount(rate)} ${toCurrency}`
      : "";
  const canLog = isLogged || (rate !== undefined && !isLoading);
  const canFavorite = isPinned || (rate !== undefined && !isLoading);
  const canAlert = rate !== undefined && !isLoading;

  // Keyboard shortcuts (F / L, see constants/shortcut-registry.ts) act on
  // whichever pair is currently active in the converter. `toggleFavorite`
  // / `toggleLog` are read through refs rather than listed as effect
  // dependencies: both are fresh closures on every render (useConverter
  // recomputes them), so depending on them directly would tear down and
  // re-add the window listener on every keystroke in the amount field.
  const toggleFavoriteRef = React.useRef(toggleFavorite);
  toggleFavoriteRef.current = toggleFavorite;

  const toggleLogRef = React.useRef(toggleLog);
  toggleLogRef.current = toggleLog;

  React.useEffect(() => {
    const handleFavoriteShortcut = () => {
      if (canFavorite) toggleFavoriteRef.current();
    };

    window.addEventListener(
      SHORTCUT_EVENTS.favoriteActivePair,
      handleFavoriteShortcut,
    );
    return () =>
      window.removeEventListener(
        SHORTCUT_EVENTS.favoriteActivePair,
        handleFavoriteShortcut,
      );
  }, [canFavorite]);

  React.useEffect(() => {
    const handleLogShortcut = () => {
      if (canLog) toggleLogRef.current();
    };

    window.addEventListener(SHORTCUT_EVENTS.logActivePair, handleLogShortcut);
    return () =>
      window.removeEventListener(
        SHORTCUT_EVENTS.logActivePair,
        handleLogShortcut,
      );
  }, [canLog]);

  // Copies just the precise numeric rate (not the "1 USD = ..." sentence
  // — that's what ShareButton's link is for). `copyRate` is read through
  // a ref rather than listed as an effect dependency, same reasoning as
  // toggleFavorite/toggleLog above.
  const copyRate = React.useCallback(async () => {
    if (rate === undefined) return;

    try {
      await navigator.clipboard.writeText(formatPreciseAmount(rate));
      toast.success(
        `Rate copied: 1 ${fromCurrency} = ${formatPreciseAmount(rate)} ${toCurrency}.`,
      );
    } catch {
      toast.error("Couldn't copy the rate — copy it from the tooltip instead.");
    }
  }, [rate, fromCurrency, toCurrency]);

  const copyRateRef = React.useRef(copyRate);
  copyRateRef.current = copyRate;

  React.useEffect(() => {
    const handleCopyRateShortcut = () => {
      if (rate !== undefined) copyRateRef.current();
    };

    window.addEventListener(SHORTCUT_EVENTS.copyRate, handleCopyRateShortcut);
    return () =>
      window.removeEventListener(
        SHORTCUT_EVENTS.copyRate,
        handleCopyRateShortcut,
      );
  }, [rate]);

  return (
    <Container className="flex w-full flex-col items-center justify-center gap-step-200 rounded-b-20 border-border border-t border-dashed bg-card px-step-200 py-step-200 md:flex-row md:justify-between md:px-step-250">
      {error ? (
        <p className="preset-6 text-destructive/80 uppercase">
          Rate unavailable
        </p>
      ) : rate !== undefined ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <p
              className="preset-6 cursor-default text-foreground uppercase"
              aria-live="polite"
            >
              {rateDisplay}
            </p>
          </TooltipTrigger>

          <TooltipContent>
            1 {fromCurrency} = {formatPreciseAmount(rate)} {toCurrency}
          </TooltipContent>
        </Tooltip>
      ) : isLoading ? (
        <Skeleton className="h-3.5 w-24" />
      ) : (
        <p className="preset-6 text-destructive/80 uppercase">
          Rate unavailable
        </p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-step-100 md:gap-step-150">
        <FavoriteToggle
          isFavorite={isPinned}
          isSyncing={isFavoriteSyncing}
          onToggle={toggleFavorite}
          disabled={!canFavorite}
          label={
            isPinned
              ? `Unpin: ${fromCurrency} to ${toCurrency}`
              : `Pin: ${fromCurrency} to ${toCurrency}`
          }
        />

        <AlertToggle
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
          currentRate={rate}
          disabled={!canAlert}
          label={`Set alert: ${fromCurrency} to ${toCurrency}`}
        />

        <LogButton
          isLogged={isLogged}
          isSyncing={isLogSyncing}
          disabled={!canLog}
          onToggle={toggleLog}
          label={
            isLogged
              ? `Remove logged conversion: ${fromCurrency} to ${toCurrency}`
              : `Log conversion: ${fromCurrency} to ${toCurrency}`
          }
        />

        <ShareButton
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
          amount={amount}
        />
      </div>
    </Container>
  );
};

export default ConverterBottom;
