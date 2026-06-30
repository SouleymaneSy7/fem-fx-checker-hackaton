import Container from "@/components/common/container";
import List from "@/components/common/list";
import Title from "@/components/common/title";
import { ArrowRightIcon, StarFilledIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { cn } from "@/lib/utils";

import {
  getPlaceholderRate,
  PLACEHOLDER_CHANGE_PERCENT,
} from "@/utils/placeholder";

export type FavoritePairType = {
  code: string;
  sendCurrency: string;
  receiveCurrency: string;
  rate: number;
  changePercent: number;
};

const pinnedCodes = [
  "EUR",
  "GBP",
  "JPY",
  "CHF",
  "CAD",
  "AUD",
  "INR",
  "CNY",
  "BDT",
];

const sendCurrency = "USD";

const FavoritesPanel = () => {
  const favorites: FavoritePairType[] = Array.from(pinnedCodes).map((code) => ({
    code: `${sendCurrency}-${code}`,
    sendCurrency: sendCurrency,
    receiveCurrency: code,
    rate: getPlaceholderRate(sendCurrency, code),
    changePercent: PLACEHOLDER_CHANGE_PERCENT[code] ?? 0,
  }));

  const hasFavorites = favorites.length > 0;

  return (
    <Container className="bg-card border border-neutral-600 rounded-xl space-y-step-200 p-step-200 md:space-y-step-250 md:p-step-250">
      <div className="flex flex-wrap items-baseline justify-between gap-step-100">
        <Title level="h3" className="preset-3-med uppercase text-foreground">
          Pinned pairs
        </Title>

        <p className="preset-5 text-neutral-100 truncate">
          {favorites.length} favorites
        </p>
      </div>

      {hasFavorites ? (
        <List
          items={favorites}
          keyExtractor={(item) => item.code}
          className="flex flex-col gap-step-150"
          renderItem={(item) => {
            const isPositive = item.changePercent >= 0;

            return (
              <li className="flex items-center gap-step-250 rounded-10 border border-neutral-500 bg-neutral-600 px-step-150 py-step-150 md:px-step-200">
                <div className="flex-1 flex items-center gap-step-100">
                  <p className="preset-4 uppercase text-foreground">
                    {item.sendCurrency}
                  </p>

                  <ArrowRightIcon className="text-neutral-200" size={12} />

                  <p className="preset-4 uppercase text-foreground">
                    {item.receiveCurrency}
                  </p>
                </div>

                <div className="flex flex-col gap-step-075 items-end">
                  <p className="preset-3 text-foreground">
                    {item.rate.toFixed(4)}
                  </p>

                  <p
                    className={cn(
                      "text-right preset-6",
                      isPositive ? "text-green-500" : "text-red-500",
                    )}
                  >
                    {isPositive ? "▲" : "▼"}{" "}
                    {Math.abs(item.changePercent).toFixed(2)}%
                  </p>
                </div>

                <Button
                  variant={"default"}
                  size={"icon"}
                  className="border-primary"
                >
                  <StarFilledIcon className="text-primary" />
                </Button>
              </li>
            );
          }}
        />
      ) : (
        <Empty>
          <EmptyTitle>No pinned pairs yet</EmptyTitle>
          <EmptyDescription>
            Pin a pair to track its rate here. Tap the star icon on any
            conversion or comparison row.
          </EmptyDescription>
        </Empty>
      )}
    </Container>
  );
};

export default FavoritesPanel;
