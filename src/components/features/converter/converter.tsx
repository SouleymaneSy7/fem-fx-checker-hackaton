import { Container, Title } from "@/components/common";
import ConverterBottom from "./converter-bottom";
import ConverterTop from "./converter-top";
import ConverterUrlSync from "./converter-url-sync";

const Converter = () => {
  return (
    <Container as="section" className="space-y-step-200">
      <ConverterUrlSync />

      <Title level="h1" className="preset-2 uppercase">
        Check the rate
      </Title>

      <Container>
        <ConverterTop />
        <ConverterBottom />
      </Container>
    </Container>
  );
};

export default Converter;
