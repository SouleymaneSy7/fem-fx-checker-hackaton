"use client";

import { TICKER_BASE_CURRENCY, TICKER_QUOTE_CURRENCIES } from "@/constants";
import { useCurrencies } from "@/hooks/use-currencies";
import { useTicker } from "@/hooks/use-ticker";
import Container from "../common/container";
import Ticker from "../features/ticker/ticker";
import TickerLoading from "../features/ticker/ticker-loading";
import Navbar from "./navbar";

const Header = () => {
  const { currencies, isLoading: isCurrenciesLoading } = useCurrencies();
  const { entries, isLoading } = useTicker(
    TICKER_BASE_CURRENCY,
    TICKER_QUOTE_CURRENCIES,
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
      {isLoading ? <TickerLoading /> : <Ticker pairs={pairs} />}
    </Container>
  );
};

export default Header;
