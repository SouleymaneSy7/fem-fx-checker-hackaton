"use client";

import { useCurrencies } from "@/hooks/use-currencies";
import { useTicker } from "@/hooks/use-ticker";

import Container from "../common/container";
import Ticker from "../features/ticker/ticker";
import Navbar from "./navbar";

// EUR as ticker base since it's the currency with the broadest provider coverage;
// GNF (Guinean Franc) & XOF (CFA franc BCEAO) is deliberately in this list.
const TICKER_BASE = "EUR";
const TICKER_QUOTES = [
  "USD",
  "GBP",
  "JPY",
  "CHF",
  "AUD",
  "CAD",
  "CNY",
  "INR",
  "BDT",
  "GNF",
  "XOF",
];

const Header = () => {
  const { currencies } = useCurrencies();
  const { entries } = useTicker(TICKER_BASE, TICKER_QUOTES);

  const availableCurrencies = currencies?.length;

  const pairs = entries.map((entry) => ({
    id: `${TICKER_BASE}-${entry.currency}`,
    base: TICKER_BASE,
    quote: entry.currency,
    rate: entry.rate,
    changePercent: entry.change?.percentage ?? 0,
  }));

  return (
    <Container as="header">
      <Navbar availableCurrencies={availableCurrencies} />
      <Ticker pairs={pairs} />
    </Container>
  );
};

export default Header;
