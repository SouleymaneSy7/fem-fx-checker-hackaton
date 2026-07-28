import * as React from "react";

import Container from "@/components/common/container";
import List from "@/components/common/list";
import Title from "@/components/common/title";
import VisuallyHidden from "@/components/common/visually-hidden";
import { ArrowRightIcon } from "@/components/icons";
import FavoriteToggleIcon from "@/components/shared/favorite-toggle-icon";
import TextTooltip from "@/components/shared/text-tooltip";
import TrendIndicator from "@/components/shared/trend-indicator";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";
import { formatAmount, formatPreciseAmount } from "@/utils/format-amount";

const FavoritesPanel = () => {
  const { rows, unpinPair, isLoading } = useFavorites();

  const hasFavorites = rows.length > 0;

  return (
    <React.Fragment>
      {hasFavorites ? (
        <Container className="bg-card border border-neutral-600 rounded-xl space-y-step-200 p-step-200 md:space-y-step-250 md:p-step-250">
          <div className="flex flex-wrap items-baseline justify-between gap-step-100">
            <Title
              level="h3"
              className="preset-3-med uppercase text-foreground"
            >
              Pinned pairs
            </Title>

            <p className="preset-5 text-neutral-100 truncate">
              {rows.length} favorites
            </p>
          </div>

          {/* biome-ignore lint/a11y/useSemanticElements: live region for loading state — <output> is semantically wrong for loading announcements */}
          <VisuallyHidden role="status">
            {isLoading ? "Loading live rates for pinned pairs" : ""}
          </VisuallyHidden>

          <List
            items={rows}
            keyExtractor={(item) => item.id}
            className="flex flex-col gap-step-150"
            renderItem={(item) => {
              const isPositive = (item.changePercent ?? 0) >= 0;
              const isRowLoading = isLoading && item.rate === undefined;

              return (
                <li className="flex items-center gap-step-250 rounded-10 border border-neutral-500 bg-neutral-600 px-step-150 py-step-150 md:px-step-200">
                  <div className="flex-1 flex items-center gap-step-100">
                    <p className="preset-4 uppercase text-foreground">
                      {item.fromCurrency}
                    </p>

                    <ArrowRightIcon className="text-neutral-200" size={12} />

                    <p className="preset-4 uppercase text-foreground">
                      {item.toCurrency}
                    </p>
                  </div>

                  <div className="flex flex-col gap-step-075 items-end">
                    {isRowLoading ? (
                      <React.Fragment>
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-3 w-12" />
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        {item.rate !== undefined ? (
                          <TextTooltip
                            className="preset-3 text-foreground"
                            content={`1 ${item.fromCurrency} = ${formatPreciseAmount(item.rate)} ${item.toCurrency}`}
                          >
                            {formatAmount(item.rate)}
                          </TextTooltip>
                        ) : (
                          <p className="preset-3 text-foreground">—</p>
                        )}

                        {item.changePercent !== undefined && (
                          // TextTooltip's own <span> is the Radix asChild ref
                          // target, so TrendIndicator (not forwardRef) can sit
                          // directly inside it — no extra wrapping span needed.
                          <TextTooltip
                            content={`${isPositive ? "+" : "-"}${Math.abs(item.changePercent).toFixed(4)}% over the last week.`}
                          >
                            <TrendIndicator
                              isPositive={isPositive}
                              value={`${Math.abs(item.changePercent).toFixed(2)}%`}
                              className={cn(
                                "preset-6",
                                isPositive ? "text-green" : "text-red",
                              )}
                            />
                          </TextTooltip>
                        )}
                      </React.Fragment>
                    )}
                  </div>

                  <FavoriteToggleIcon
                    isFavorite={true}
                    isSyncing={item.isFavoriteSyncing}
                    onToggle={() => unpinPair(item.id)}
                    label={`Unpin: ${item.fromCurrency} to ${item.toCurrency}`}
                  />
                </li>
              );
            }}
          />
        </Container>
      ) : (
        <Empty>
          <EmptyTitle>No pinned pairs yet</EmptyTitle>

          <EmptyDescription>
            Pin a pair to track its rate here. Tap the star icon on any
            conversion or comparison row.
          </EmptyDescription>
        </Empty>
      )}
    </React.Fragment>
  );
};

export default FavoritesPanel;
