"use client";

import Container from "@/components/common/container";
import AlertToggle from "@/components/shared/alert-toggle";
import FavoriteToggle from "@/components/shared/favorite-toggle";
import LogButton from "@/components/shared/log-button";
import { Skeleton } from "@/components/ui/skeleton";
import { useConverter } from "@/hooks/use-converter";
import { formatAmount } from "@/utils/format-amount";

const ConverterBottom = () => {
  const {
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

  const rateDisplay = `1 ${fromCurrency} = ${rate !== undefined && formatAmount(rate)} ${toCurrency}`;
  const canLog = isLogged || (rate !== undefined && !isLoading);
  const canFavorite = isPinned || (rate !== undefined && !isLoading);
  const canAlert = rate !== undefined && !isLoading;

  return (
    <Container className="w-full bg-card rounded-b-20 border-t border-dashed border-border py-step-200 px-step-200 flex flex-col items-center justify-center gap-step-200 md:px-step-250 md:flex-row md:justify-between">
      {error ? (
        <p className="text-destructive/80 preset-6 uppercase">
          Rate unavailable
        </p>
      ) : rate !== undefined ? (
        <p className="preset-6 uppercase text-foreground" aria-live="polite">
          {rateDisplay}
        </p>
      ) : isLoading ? (
        <Skeleton className="h-3.5 w-24" />
      ) : (
        <p className="text-destructive/80 preset-6 uppercase">
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
      </div>
    </Container>
  );
};

export default ConverterBottom;
