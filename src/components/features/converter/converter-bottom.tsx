"use client";

import * as React from "react";
import Container from "@/components/common/container";
import FavoriteToggle from "@/components/shared/favorite-toggle";
import LogButton from "@/components/shared/log-button";
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
  const [toggle, setToggle] = React.useState(false);
  const [logToggle, setLogToggle] = React.useState(false);

  const handleToggle = () => {
    setToggle(!toggle);
  };

  const handleLogToggle = () => {
    setLogToggle(!logToggle);
  };

  return (
    <Container className="w-full bg-card rounded-b-20 border-t border-dashed border-border py-step-200 px-step-200 flex flex-col items-center justify-center gap-step-200 md:px-step-250 md:flex-row md:justify-between">
      <p className="preset-6 uppercase">
        1 {sendCurrency} = {currencyRate.toFixed(4)} {receiveCurrency}
      </p>

      <div className="flex items-center gap-step-100 md:gap-step-150">
        <FavoriteToggle
          isFavorite={toggle}
          onToggle={handleToggle}
          label="Favorite Button"
        />

        <LogButton isLogged={logToggle} onToggle={handleLogToggle} />
      </div>
    </Container>
  );
};

export default ConverterBottom;
