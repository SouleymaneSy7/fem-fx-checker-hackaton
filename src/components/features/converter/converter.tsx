import Container from "@/components/common/container";
import Title from "@/components/common/title";
import ConverterBottom from "./converter-bottom";
import ConverterTop from "./converter-top";

const Converter = () => {
  return (
    <Container as="section" className="space-y-step-200">
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
