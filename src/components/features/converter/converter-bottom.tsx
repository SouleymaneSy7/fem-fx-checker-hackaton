import Container from "@/components/common/container";
import { StarIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

export interface ConverterBottomPropsType {
  sendCurrency: string;
  currencyRate: number;
  receiveCurrency: string;
}

const ConverterBottom = ({
  sendCurrency,
  currencyRate,
  receiveCurrency,
}: ConverterBottomPropsType) => {
  return (
    <Container className="w-full bg-card rounded-b-20 border-t border-dashed border-border py-step-200 px-step-200 flex flex-col items-center justify-center gap-step-200 md:px-step-250 md:flex-row md:justify-between">
      <p className="preset-6 uppercase">
        1 {sendCurrency} = {currencyRate.toFixed(4)} {receiveCurrency}
      </p>

      <div className="flex items-center gap-step-100 md:gap-step-150">
        <Button variant={"default"}>
          <StarIcon /> Favorite
        </Button>

        <Button variant={"outline"}>Log Conversion</Button>
      </div>
    </Container>
  );
};

export default ConverterBottom;
