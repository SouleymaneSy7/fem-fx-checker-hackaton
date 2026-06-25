import Container from "../common/container";
import Ticker from "../features/ticker/ticker";
import Navbar from "./navbar";

const PAIRS = [
  {
    id: crypto.randomUUID(),
    base: "EUR",
    quote: "AED",
    rate: 4.1751,
    changePercent: 0.142,
  },
  {
    id: crypto.randomUUID(),
    base: "EUR",
    quote: "AFN",
    rate: 73.578,
    changePercent: -0.53,
  },
  {
    id: crypto.randomUUID(),
    base: "EUR",
    quote: "ALL",
    rate: 94.28,
    changePercent: 0.848,
  },
  {
    id: crypto.randomUUID(),
    base: "EUR",
    quote: "AMD",
    rate: 417.92,
    changePercent: -0.521,
  },
  {
    id: crypto.randomUUID(),
    base: "EUR",
    quote: "ANG",
    rate: 2.035,
    changePercent: 0.957,
  },
  {
    id: crypto.randomUUID(),
    base: "EUR",
    quote: "GNF",
    rate: 2.035,
    changePercent: 0,
  },
];

const availableCurrencies = 55;

const Header = () => {
  return (
    <Container as="header">
      <Navbar availableCurrencies={availableCurrencies} />
      <Ticker pairs={PAIRS} />
    </Container>
  );
};

export default Header;
