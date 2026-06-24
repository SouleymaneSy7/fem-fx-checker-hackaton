import Title from "@/components/common/title";
import { ArrowLeftRightIcon, StarIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

const activeCurrency = "USD";
const activeCurrencyRate = 0.853;
const activeCurrencyPair = "EUR";

const Converter = () => {
  return (
    <section className="space-y-step-200">
      <Title level="h1" className="preset-2 uppercase">
        Check the rate
      </Title>

      <div>
        {/* Converter Top - Send Amount, Receive Amount, Currency Picker, Swap Button */}
        <div className="w-full bg-card rounded-t-20 p-step-200 flex flex-col items-center justify-center gap-step-200 md:p-step-250 md:flex-row md:gap-step-300">
          {/* Send */}
          <div className="w-full bg-neutral-600 border border-neutral-500 flex flex-col gap-step-200 p-step-200 rounded-16 md:p-step-250 md:gap-step-250">
            <Title level="h3" className="preset-4 uppercase text-neutral-100">
              Send
            </Title>

            <div className="flex items-center justify-between gap-step-100">
              <p>1000</p>

              {/* Currency Picker */}
              <p>Currency Picker</p>
            </div>
          </div>

          {/* Swap Button */}
          <Button variant={"secondary"} size={"icon-lg"}>
            <ArrowLeftRightIcon />
          </Button>

          {/* Receive */}
          <div className="w-full bg-neutral-600 border border-neutral-500 flex flex-col gap-step-200 p-step-200 rounded-16 md:p-step-250 md:gap-step-250">
            <Title level="h3" className="preset-4 uppercase text-neutral-100">
              Receive
            </Title>

            <div className="flex items-center justify-between gap-step-100">
              <p>1000</p>

              {/* Currency Picker */}
              <p>Currency Picker</p>
            </div>
          </div>
        </div>

        {/* Converter Bottom - Exchange Rate for the active pair, Favorite Button, Log Conversion Button */}
        <div className="w-full bg-card rounded-b-20 border-t border-dashed border-border py-step-200 px-step-200 flex flex-col items-center justify-center gap-step-200 md:px-step-250 md:flex-row md:justify-between">
          <p className="preset-6 uppercase">
            1 {activeCurrency} = {activeCurrencyRate} {activeCurrencyPair}
          </p>

          <div className="flex items-center gap-step-100 md:gap-step-150">
            {/* Favorite Button */}
            <Button variant={"default"}>
              <StarIcon /> Favorite
            </Button>

            {/* Log Conversion Button */}
            <Button variant={"outline"}>Log Conversion</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Converter;
