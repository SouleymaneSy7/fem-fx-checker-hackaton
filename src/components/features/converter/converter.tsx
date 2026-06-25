import Container from "@/components/common/container";
import Title from "@/components/common/title";
import ConverterBottom from "./converter-bottom";
import ConverterTop from "./converter-top";

const sendCurrency = "USD";
const currencyRate = 0.853;
const receiveCurrency = "EUR";

const Converter = () => {
  return (
    <Container as="section" className="space-y-step-200">
      <Title level="h1" className="preset-2 uppercase">
        Check the rate
      </Title>

      <Container>
        <ConverterTop />

        <ConverterBottom
          currencyRate={currencyRate}
          receiveCurrency={receiveCurrency}
          sendCurrency={sendCurrency}
        />
      </Container>
    </Container>
  );
};

export default Converter;
