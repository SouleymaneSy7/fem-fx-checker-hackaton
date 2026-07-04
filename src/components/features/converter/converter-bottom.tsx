"use client";

import Container from "@/components/common/container";
import FavoriteToggle from "@/components/shared/favorite-toggle";
import LogButton from "@/components/shared/log-button";
import { useConverter } from "@/hooks/use-converter";

const ConverterBottom = () => {
  const {
    fromCurrency,
    toCurrency,
    rate,
    isLoading,
    error,
    isPinned,
    toggleFavorite,
    isLogged,
    toggleLog,
  } = useConverter();

  const rateDisplay = error
    ? "Rate unavailable"
    : rate !== undefined
      ? `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`
      : isLoading
        ? "Loading rate..."
        : "Rate unavailable";

  const canLog = isLogged || (rate !== undefined && !isLoading);

  return (
    <Container className="w-full bg-card rounded-b-20 border-t border-dashed border-border py-step-200 px-step-200 flex flex-col items-center justify-center gap-step-200 md:px-step-250 md:flex-row md:justify-between">
      <p className="preset-6 uppercase">{rateDisplay}</p>

      <div className="flex items-center gap-step-100 md:gap-step-150">
        <FavoriteToggle
          isFavorite={isPinned}
          onToggle={toggleFavorite}
          label={
            isPinned
              ? `Unpin: ${fromCurrency} to ${toCurrency}`
              : `Pin: ${fromCurrency} to ${toCurrency}`
          }
        />

        <LogButton
          isLogged={isLogged}
          disabled={!canLog}
          aria-pressed={isLogged}
          label="Favorite Button"
          onToggle={toggleLog}
        />
      </div>
    </Container>
  );
};

export default ConverterBottom;
