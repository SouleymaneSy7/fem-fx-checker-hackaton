"use client";

import { Container } from "@/components/common";
import { TICKER_BASE_CURRENCY, TICKER_QUOTE_CURRENCIES } from "@/constants";
import { useCurrencies, useTicker } from "@/hooks";
import { usePreferencesStore } from "@/store";
import Ticker from "../features/ticker/ticker";
import TickerLoading from "../features/ticker/ticker-loading";
import Navbar from "./navbar";

const Header = () => {
  const { currencies, isLoading: isCurrenciesLoading } = useCurrencies();

  const tickerQuoteCurrencies = usePreferencesStore(
    (state) => state.tickerQuoteCurrencies,
  );
  const tickerVisible = usePreferencesStore((state) => state.tickerVisible);
  const tickerSpeedSeconds = usePreferencesStore(
    (state) => state.tickerSpeedSeconds,
  );
  const effectiveTickerCurrencies =
    tickerQuoteCurrencies ?? TICKER_QUOTE_CURRENCIES;

  const { entries, isLoading } = useTicker(
    TICKER_BASE_CURRENCY,
    effectiveTickerCurrencies,
  );

  const availableCurrencies = currencies?.length;

  const pairs = entries.map((entry) => ({
    id: `${TICKER_BASE_CURRENCY}-${entry.currency}`,
    base: TICKER_BASE_CURRENCY,
    quote: entry.currency,
    rate: entry.rate,
    changePercent: entry.change?.percentage ?? 0,
  }));

  return (
    <Container as="header">
      <Navbar
        availableCurrencies={availableCurrencies}
        isLoading={isCurrenciesLoading}
      />
      {/* Data still fetches regardless of tickerVisible — the rates are
          cheap and SWR-cached, and useAppReadiness already gates the
          splash screen on this same request finishing. Hiding it is a
          display choice, not a fetch one. */}
      {tickerVisible &&
        (isLoading ? (
          <TickerLoading />
        ) : (
          <Ticker
            pairs={pairs}
            durationSeconds={tickerSpeedSeconds ?? undefined}
          />
        ))}
    </Container>
  );
};

export default Header;
