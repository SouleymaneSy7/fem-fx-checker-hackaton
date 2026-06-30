"use client";
import * as React from "react";

import Container from "@/components/common/container";
import Title from "@/components/common/title";
import { ArrowLeftRightIcon } from "@/components/icons";
import CurrencyPicker from "@/components/shared/currency-picker";
import NumericInput from "@/components/shared/numeric-input";
import { Button } from "@/components/ui/button";
import { PLACEHOLDER_CURRENCIES } from "@/utils/placeholder";

const ConverterTop = () => {
  const [sendCurrency, setSendCurrency] = React.useState("USD");
  const [receiveCurrency, setReceiveCurrency] = React.useState("USD");

  return (
    <Container className="w-full bg-card rounded-t-20 p-step-200 flex flex-col items-center justify-center gap-step-200 md:p-step-250 md:flex-row md:gap-step-300">
      <div className="w-full bg-neutral-600 border border-neutral-500 flex flex-col gap-step-200 p-step-200 rounded-16 md:p-step-250 md:gap-step-250">
        <Title level="h3" className="preset-4 uppercase text-neutral-100">
          Send
        </Title>

        <div className="flex items-center justify-between gap-step-100">
          <NumericInput />

          <CurrencyPicker
            label="Send Currency"
            value={sendCurrency}
            onValueChange={setSendCurrency}
            currencies={PLACEHOLDER_CURRENCIES}
          />
        </div>
      </div>

      <Button type="button" size={"icon-lg"} variant={"secondary"}>
        <ArrowLeftRightIcon />
      </Button>

      <div className="w-full bg-neutral-600 border border-neutral-500 flex flex-col gap-step-200 p-step-200 rounded-16 md:p-step-250 md:gap-step-250">
        <Title level="h3" className="preset-4 uppercase text-neutral-100">
          Receive
        </Title>

        <div className="flex items-center justify-between gap-step-100">
          <p className="preset-1 uppercase text-primary">1000</p>

          <CurrencyPicker
            label="Receive Currency"
            value={receiveCurrency}
            onValueChange={setReceiveCurrency}
            currencies={PLACEHOLDER_CURRENCIES}
          />
        </div>
      </div>
    </Container>
  );
};

export default ConverterTop;
